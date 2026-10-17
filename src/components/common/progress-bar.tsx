interface ProgressBarProps {
  value: number;
  max?: number;
}

export function ProgressBar({
  value,
  max = 100,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-green-700 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="w-10 text-right text-sm">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}