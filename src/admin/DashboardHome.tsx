import { useQuery } from "@tanstack/react-query";
import { machines } from "@/data/machines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminStatsResponse {
  totalUsers: number;
  totalMachines: number | null;
  totalInquiries: number | null;
  totalGalleryItems: number | null;
}

const DashboardHome = () => {
  const { data } = useQuery<AdminStatsResponse>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to load dashboard stats");
      }
      return res.json();
    },
  });

  const totalMachines = machines.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-steel-light">
          Overview
        </h1>
        <p className="text-sm text-steel mt-1">
          High-level metrics for the glass machinery platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="metal-surface border-steel/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-steel">
              Total Machines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-steel-light">
              {totalMachines}
            </div>
            <p className="text-xs text-steel mt-1">
              Defined in the public catalogue.
            </p>
          </CardContent>
        </Card>

        <Card className="metal-surface border-steel/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-steel">
              Admin Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-steel-light">
              {data?.totalUsers ?? "—"}
            </div>
            <p className="text-xs text-steel mt-1">
              Active users with dashboard access.
            </p>
          </CardContent>
        </Card>

        <Card className="metal-surface border-steel/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-steel">
              Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-steel-light">
              {data?.totalInquiries ?? 0}
            </div>
            <p className="text-xs text-steel mt-1">
              Placeholder – ready for integration.
            </p>
          </CardContent>
        </Card>

        <Card className="metal-surface border-steel/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-steel">
              Gallery Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-steel-light">
              {data?.totalGalleryItems ?? totalMachines}
            </div>
            <p className="text-xs text-steel mt-1">
              Mirrors public gallery content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

