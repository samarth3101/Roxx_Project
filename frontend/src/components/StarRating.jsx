import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
  totalCount,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const activeValue = hoverValue || value || 0;

  return (
    <div className="inline-flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readOnly && setHoverValue(star)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              className={`transition-all duration-150 ${
                readOnly
                  ? 'cursor-default focus:outline-none'
                  : 'cursor-pointer hover:scale-115 focus:outline-none'
              }`}
              title={readOnly ? `${value} stars` : `Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)]'
                    : 'text-slate-300 hover:text-slate-400'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          {value ? Number(value).toFixed(1) : 'No ratings'}
          {totalCount !== undefined && (
            <span className="text-slate-500 font-normal ml-1">({totalCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
