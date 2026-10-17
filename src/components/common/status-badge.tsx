interface StatusBadgeProps {
  status: 'En cours' | 'Clôturé';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    'En cours': 'bg-green-100 text-green-700',
    'Clôturé': 'bg-red-100 text-red-600',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}