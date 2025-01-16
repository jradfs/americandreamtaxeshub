import * as React from "react";

import { cn } from "src/lib/utils";

interface SortableColumn {
  id: string;
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
  onSort?: () => void;
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  onRowSelect?: (selectedRows: string[]) => void;
  selectedRows?: string[];
  columns?: SortableColumn[];
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  onSelect?: () => void;
  id?: string;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, onRowSelect, selectedRows, columns, ...props }, ref) => (
    <div
      className="relative w-full overflow-auto"
      role="region"
      aria-label="Scrollable table"
    >
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          "min-w-full table-auto md:table-fixed",
          className,
        )}
        role="grid"
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, onSelect, id, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        selected && "bg-muted",
        className,
      )}
      role="row"
      aria-selected={selected}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect();
        }
      }}
      data-row-id={id}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sorted, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sortable && "cursor-pointer select-none",
        className,
      )}
      role="columnheader"
      aria-sort={
        sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined
      }
      {...props}
    >
      <div className="flex items-center gap-2">
        {props.children}
        {sortable && (
          <span className="inline-flex">
            {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
          </span>
        )}
      </div>
    </th>
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "break-words",
      className,
    )}
    role="gridcell"
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
