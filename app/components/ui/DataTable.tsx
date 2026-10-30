import type { ReactNode } from "react";

type DataTableColumn<T> = {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyMessage = "データがありません",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-max border-collapse text-sm">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className={`
                  px-4 py-3 text-left
                  font-medium text-gray-600
                  whitespace-nowrap
                  ${column.className ?? ""}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-gray-500"
              >
                読み込み中...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`
                  transition-colors
                  ${
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50"
                      : ""
                  }
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`
                      px-4 py-3 text-gray-700
                      ${column.className ?? ""}
                    `}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
