interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function InfoRow({
  label,
  value,
  last = false,
}: InfoRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        !last ? 'border-b border-border' : ''
      }`}
    >
      <span className="text-sm text-foreground">
        {label}
      </span>

      <span className="text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}