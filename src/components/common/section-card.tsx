import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  children,
  action,
  icon,
  className = '',
}: SectionCardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-card shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-green-700">
              {icon}
            </div>
          )}

          <h2 className="font-semibold">
            {title}
          </h2>
        </div>

        {action && <div>{action}</div>}
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}