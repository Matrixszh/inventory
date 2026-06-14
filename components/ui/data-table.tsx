import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage: string;
  searchSlot?: React.ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage,
  searchSlot,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#252836]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-slate-50">Data Table</h3>
        {searchSlot}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-white/5">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 align-top text-sm text-slate-200">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 p-4">
        <p className="text-sm text-slate-400">
          Page {page} of {Math.max(totalPages, 1)}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
