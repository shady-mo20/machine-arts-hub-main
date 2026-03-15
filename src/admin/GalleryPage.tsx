import { machines } from "@/data/machines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GalleryPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-steel-light">
          Gallery & Media
        </h1>
        <p className="text-sm text-steel mt-1">
          Lightweight overview of imagery used across the public site. This
          module is prepared for future integration with a media library.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {machines.map((m) => (
          <Card key={m.id} className="overflow-hidden border-steel/30 bg-surface-dark/70">
            <div className="h-32 bg-black/40">
              <img
                src={m.image}
                alt={m.name.en}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-steel-light line-clamp-1">
                {m.name.en}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-[11px] text-steel">
                ID: <span className="text-steel-light">{m.id}</span>
              </p>
              <p className="text-[11px] text-steel">
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

export default GalleryPage;

