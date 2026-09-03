import React, { useState, useEffect } from 'react';

// Precision custom-drawn SVG star (not generic icon font)
const StarGlyph = ({ filled, animating, delay = 0, sizeClass = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 20 20"
    className={`${sizeClass} transition-transform duration-100 ${
      animating ? 'animate-star-pop' : ''
    }`}
    style={animating ? { animationDelay: `${delay}ms` } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
      fill={filled ? '#C9714F' : 'none'}
      stroke={filled ? '#C9714F' : '#8A8578'}
      strokeWidth={filled ? '0.5' : '1.3'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
  totalCount,
  triggerSequentialAnimation = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (triggerSequentialAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  }, [triggerSequentialAnimation]);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  };

  const activeValue = hoverValue || value || 0;

  return (
    <div className="inline-flex items-center gap-1.5 select-none align-middle">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(activeValue);
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readOnly && setHoverValue(star)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              className={`p-0.5 rounded transition-transform ${
                readOnly
                  ? 'cursor-default focus:outline-none'
                  : 'cursor-pointer hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]'
              }`}
              title={readOnly ? `${value} out of 5 stars` : `Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <StarGlyph
                filled={isFilled}
                animating={isAnimating && isFilled}
                delay={(star - 1) * 100}
                sizeClass={sizeClasses[size] || sizeClasses.md}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs tabular-nums text-[#2B2924] font-medium ml-1">
          {value ? Number(value).toFixed(1) : 'Unrated'}
          {totalCount !== undefined && (
            <span className="text-[#8A8578] font-normal ml-1">({totalCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
