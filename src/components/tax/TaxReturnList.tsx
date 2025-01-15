'use client'

import { DataGrid } from "@/components/shared/DataGrid"
import { useTaxReturns } from "@/hooks/useTaxReturns"
import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  taxReturn: {
    id: string
    status: string
  }
}

function ActionButtons({ taxReturn }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        View
      </Button>
      {taxReturn.status !== 'completed' && (
        <Button variant="outline" size="sm">
          Edit
        </Button>
      )}
    </div>
  )
}

export function TaxReturnList({ clientId }: { clientId: string }) {
  const { data, isLoading } = useTaxReturns(clientId)
  
  return (
    <DataGrid
      data={data}
      columns={[
        { field: 'tax_year', header: 'Year' },
        { field: 'status', header: 'Status' },
        { field: 'due_date', header: 'Due Date' },
        {
          field: 'actions',
          header: 'Actions',
          render: (row) => (
            <ActionButtons taxReturn={row} />
          )
        }
      ]}
    />
  )
} 