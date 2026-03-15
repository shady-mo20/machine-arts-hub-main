import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/machines", label: "Machines" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/settings", label: "Settings" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface-dark text-steel-light flex">
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-steel/20 bg-surface-dark/95">
        <div className="h-16 flex items-center px-6 border-b border-steel/20">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gradient-steel">
              Machine Arts Hub
            </span>
            <span className="text-xs text-steel">Admin Console</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-steel hover:text-accent hover:bg-accent/5"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-steel/20 text-xs text-steel">
          <div className="mb-1 font-medium text-steel-light">
            {user?.fullName}
          </div>
          <div className="mb-1">{user?.email}</div>
          <div className="mb-2 capitalize">{user?.role}</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-steel/20 bg-surface-dark/90 backdrop-blur flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-steel">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-steel">
              Signed in as{" "}
              <span className="font-medium text-steel-light">
                {user?.fullName}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-steel/40 text-steel hover:text-accent hover:border-accent/50"
              onClick={() => {
                void logout();
              }}
            >
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 lg:px-8 py-6 bg-gradient-industrial overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

