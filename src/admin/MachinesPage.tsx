import { machines } from "@/data/machines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MachinesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-steel-light">
          Machines
        </h1>
        <p className="text-sm text-steel mt-1">
          Read-only view of the machines defined on the public website. This
          section is ready to be wired to a database-backed CMS in the next
          iteration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {machines.map((m) => (
          <Card key={m.id} className="metal-surface border-steel/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-steel-light">
                {m.name.en}
              </CardTitle>
              <p className="text-xs text-steel mt-1">{m.subtitle.en}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-steel line-clamp-3">
                {m.summary.en}
              </p>
              <p className="text-[11px] text-steel mt-1">
                Category:{" "}
                <span className="capitalize text-steel-light">
                  {m.category}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MachinesPage;

