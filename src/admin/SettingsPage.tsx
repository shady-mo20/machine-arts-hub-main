import { useAuth } from "@/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-steel-light">
          Settings
        </h1>
        <p className="text-sm text-steel mt-1">
          Profile overview and system placeholders. Security-sensitive changes
          (such as password rotation and environment configuration) are handled
          server-side and documented in the technical README.
        </p>
      </div>

      <Card className="metal-surface border-steel/30">
        <CardHeader>
          <CardTitle className="text-sm text-steel-light">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-steel space-y-2">
          <p>
            <span className="inline-block w-24 text-steel-light">
              Name
            </span>
            <span>{user?.fullName}</span>
          </p>
          <p>
            <span className="inline-block w-24 text-steel-light">
              Email
            </span>
            <span>{user?.email}</span>
          </p>
          <p>
            <span className="inline-block w-24 text-steel-light">
              Role
            </span>
            <span className="capitalize">{user?.role}</span>
          </p>
          <p>
            <span className="inline-block w-24 text-steel-light">
              Status
            </span>
            <span className="capitalize">{user?.status}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="metal-surface border-dashed border-steel/40">
        <CardHeader>
          <CardTitle className="text-sm text-steel-light">
            System Configuration (placeholders)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-steel space-y-2">
          <p>
            Environment-level security settings such as the JWT secret, database
            location, and initial admin seed parameters are configured outside
            the UI and described in the technical README.
          </p>
          <p>
            This section is intentionally minimal to avoid exposing sensitive
            configuration directly in the browser while still giving admins a
            clear view of available levers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

