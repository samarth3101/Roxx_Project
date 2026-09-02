import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  sortField,
  sortOrder,
  onSort,
  loading = false,
  emptyMessage = 'No records found',
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {columns.map((col) => {
                const isCurrentSort = sortField === col.field;
                const canSort = col.sortable !== false && onSort;

                return (
                  <th
                    key={col.field || col.header}
                    className={`py-3.5 px-4 sm:px-6 transition-colors ${
                      canSort ? 'cursor-pointer hover:text-slate-900 hover:bg-slate-100/70 select-none' : ''
                    } ${col.className || ''}`}
                    onClick={() => canSort && onSort(col.field)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.header}</span>
                      {canSort && (
                        <span className="text-slate-400">
                          {isCurrentSort ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-500">
                  <p className="text-base font-medium text-slate-700">{emptyMessage}</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-blue-50/30 transition-colors duration-150 group"
                >
                  {columns.map((col) => (
                    <td
                      key={col.field || col.header}
                      className={`py-3.5 px-4 sm:px-6 text-slate-800 ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row, idx) : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
