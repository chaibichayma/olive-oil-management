import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-border p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex size-12 shrink-0 items-center justify-center">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm text-[#25291F]">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#11140F]">
            {value}
            {unit && (
              <span className="ml-1 text-lg font-medium">
                {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}