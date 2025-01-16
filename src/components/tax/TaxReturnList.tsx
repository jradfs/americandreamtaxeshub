"use client";

import { DataGrid } from "@/components/shared/DataGrid";
import { useTaxReturns } from "@/hooks/useTaxReturns";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  taxReturn: {
    id: string;
    status: string;
  };
}

function ActionButtons({ taxReturn }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        View
      </Button>
      {taxReturn.status !== "completed" && (
        <Button variant="outline" size="sm">
          Edit
        </Button>
      )}
    </div>
  );
}

export function TaxReturnList({ clientId }: { clientId: string }) {
  const { data, isLoading } = useTaxReturns(clientId);

  return (
    <DataGrid
      data={data}
      columns={[
        { field: "tax_year", header: "Year" },
        {
          field: "status",
          header: "Status",
          render: (row) => {
            switch (row.status) {
              case "approved":
                return (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                    <span>Approved</span>
                  </div>
                );
              case "rejected":
                return (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-500 w-4 h-4" />
                    <span>Rejected</span>
                  </div>
                );
              default:
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {row.status}
                    </span>
                  </div>
                );
            }
          }
        },
        { field: "due_date", header: "Due Date" },
        {
          field: "actions",
          header: "Actions",
          render: (row) => <ActionButtons taxReturn={row} />,
        },
      ]}
    />
  );
}
