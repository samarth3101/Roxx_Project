import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  sortField,
  sortOrder,
  onSort,
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items matching your criteria.',
  emptyAction = null,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-[8px] bg-[#FFFFFF] border border-[#E8E5DF]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E5DF] bg-[#FAF9F6] text-[13px] font-medium text-[#8A8578]">
              {columns.map((col) => {
                const isCurrentSort = sortField === col.field;
                const canSort = col.sortable !== false && onSort;

                return (
                  <th
                    key={col.field || col.header}
                    className={`py-2.5 px-4 transition-colors font-medium select-none ${
                      canSort ? 'cursor-pointer hover:text-[#1A1815] group' : ''
                    } ${col.className || ''}`}
                    onClick={() => canSort && onSort(col.field)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {canSort && (
                        <span className="w-3.5 h-3.5 flex items-center justify-center">
                          {isCurrentSort ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#C9714F]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#C9714F]" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 text-[#8A8578] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5DF] text-[13px]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[#8A8578]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#C9714F] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-[#8A8578]">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[#8A8578]">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5DF] flex items-center justify-center text-[#8A8578]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#1A1815]">{emptyTitle}</p>
                    <p className="text-xs text-[#8A8578]">{emptyDescription}</p>
                    {emptyAction && <div className="pt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-[#FAF9F6] transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col.field || col.header}
                      className={`py-2.5 px-4 text-[#2B2924] ${col.cellClassName || ''}`}
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
