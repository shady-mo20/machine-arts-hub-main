import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InquiriesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-steel-light">
          Inquiries
        </h1>
        <p className="text-sm text-steel mt-1">
          This module is a placeholder for a future integration with the public
          contact form. It is designed to surface structured inquiries once
          persistence is wired up.
        </p>
      </div>

      <Card className="metal-surface border-dashed border-steel/40">
        <CardHeader>
          <CardTitle className="text-sm text-steel-light">
            No inquiry storage configured yet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-steel space-y-2">
          <p>
            The current public contact form is intentionally left untouched to
            avoid changing user-facing behaviour.
          </p>
          <p>
            When you are ready to persist inquiries, connect the contact form
            to a backend endpoint and surface the records in this view with
            filters, status tracking, and assignment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InquiriesPage;

