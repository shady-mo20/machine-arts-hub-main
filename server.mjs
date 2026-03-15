import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // The app can still start, but authentication will not be secure without a secret.
  // This is documented in the technical README.
  console.warn("[machine-arts-hub] JWT_SECRET is not set. Set a strong secret in production.");
}

const DB_PATH =
  process.env.ADMIN_DB_PATH ||
  path.resolve(process.cwd(), "data", "admin.sqlite");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

sqlite3.verbose();
const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  await run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `
  );
}

async function seedInitialAdminIfConfigured() {
  const countRow = await get("SELECT COUNT(*) as count FROM users");
  const hasUsers = countRow && countRow.count > 0;
  if (hasUsers) return;

  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.env.INITIAL_ADMIN_NAME || "Initial Admin";

  if (!email || !password) {
    console.info(
      "[machine-arts-hub] No admin users found. Define INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD to seed the first admin user."
    );
    return;
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(password, 12);

  await run(
    `
    INSERT INTO users (full_name, email, password_hash, role, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [name, email, passwordHash, "admin", "active", now, now]
  );

  console.info(
    `[machine-arts-hub] Seeded initial admin user with email "${email}". Remember to rotate INITIAL_ADMIN_PASSWORD and store it securely.`
  );
}

function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function signToken(payload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.verify(token, JWT_SECRET);
}

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRow = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!userRow) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (userRow.status !== "active") {
      return res
        .status(403)
        .json({ error: "User is not active. Contact an administrator." });
    }

    const isMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const safeUser = mapUserRow(userRow);
    const token = signToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      fullName: safeUser.fullName,
    });

    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ user: safeUser });
  } catch (err) {
    console.error("Error in /api/auth/login", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("admin_token", { path: "/" });
  res.status(204).end();
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const row = await get("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!row) {
      return res.status(401).json({ error: "User not found" });
    }
    res.json({ user: mapUserRow(row) });
  } catch (err) {
    console.error("Error in /api/auth/me", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin stats (used by dashboard overview)
app.get("/api/admin/stats", requireAuth, async (req, res) => {
  try {
    const usersCountRow = await get(
      "SELECT COUNT(*) as count FROM users WHERE status = 'active'"
    );

    res.json({
      totalUsers: usersCountRow?.count || 0,
      // The following are placeholders that can be wired to a database later.
      totalMachines: null,
      totalInquiries: null,
      totalGalleryItems: null,
    });
  } catch (err) {
    console.error("Error in /api/admin/stats", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User management (admin only)
app.get(
  "/api/admin/users",
  requireAuth,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const rows = await all(
        "SELECT id, full_name, email, role, status, created_at, updated_at FROM users ORDER BY created_at DESC"
      );
      res.json({ users: rows.map(mapUserRow) });
    } catch (err) {
      console.error("Error in GET /api/admin/users", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/api/admin/users",
  requireAuth,
  requireRole(["admin"]),
  async (req, res) => {
    const { fullName, email, password, role, status } = req.body || {};

    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "fullName, email, password and role are required" });
    }

    if (!["admin", "developer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    try {
      const now = new Date().toISOString();
      const passwordHash = await bcrypt.hash(password, 12);
      const userStatus = status || "active";

      const result = await run(
        `
        INSERT INTO users (full_name, email, password_hash, role, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [fullName, email, passwordHash, role, userStatus, now, now]
      );

      const created = await get("SELECT * FROM users WHERE id = ?", [
        result.lastID,
      ]);
      res.status(201).json({ user: mapUserRow(created) });
    } catch (err) {
      if (err && err.code === "SQLITE_CONSTRAINT") {
        return res.status(409).json({ error: "Email is already in use" });
      }
      console.error("Error in POST /api/admin/users", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.put(
  "/api/admin/users/:id",
  requireAuth,
  requireRole(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { fullName, email, role, status } = req.body || {};

    if (!fullName || !email || !role || !status) {
      return res
        .status(400)
        .json({ error: "fullName, email, role and status are required" });
    }

    if (!["admin", "developer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const now = new Date().toISOString();
      await run(
        `
        UPDATE users
        SET full_name = ?, email = ?, role = ?, status = ?, updated_at = ?
        WHERE id = ?
      `,
        [fullName, email, role, status, now, id]
      );

      const updated = await get("SELECT * FROM users WHERE id = ?", [id]);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: mapUserRow(updated) });
    } catch (err) {
      if (err && err.code === "SQLITE_CONSTRAINT") {
        return res.status(409).json({ error: "Email is already in use" });
      }
      console.error("Error in PUT /api/admin/users/:id", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.patch(
  "/api/admin/users/:id/status",
  requireAuth,
  requireRole(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const now = new Date().toISOString();
      await run(
        `
        UPDATE users
        SET status = ?, updated_at = ?
        WHERE id = ?
      `,
        [status, now, id]
      );

      const updated = await get("SELECT * FROM users WHERE id = ?", [id]);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: mapUserRow(updated) });
    } catch (err) {
      console.error("Error in PATCH /api/admin/users/:id/status", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.patch(
  "/api/admin/users/:id/password",
  requireAuth,
  requireRole(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body || {};

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    try {
      const now = new Date().toISOString();
      const passwordHash = await bcrypt.hash(newPassword, 12);

      await run(
        `
        UPDATE users
        SET password_hash = ?, updated_at = ?
        WHERE id = ?
      `,
        [passwordHash, now, id]
      );

      const updated = await get("SELECT * FROM users WHERE id = ?", [id]);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: mapUserRow(updated) });
    } catch (err) {
      console.error("Error in PATCH /api/admin/users/:id/password", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Initialize and start server
async function start() {
  try {
    await initDb();
    await seedInitialAdminIfConfigured();

    app.listen(PORT, () => {
      console.log(
        `[machine-arts-hub] Admin API listening on http://localhost:${PORT}`
      );
      console.log(`[machine-arts-hub] Database: ${DB_PATH}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();

