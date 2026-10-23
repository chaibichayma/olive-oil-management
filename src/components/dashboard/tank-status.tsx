
import { ArrowRight, Database } from 'lucide-react';

export interface Tank {
  reference: string;
  name: string;
  capacity: number;
  level: number;
}

interface TankStatusProps {
  tanks?: Tank[];
  onViewAll?: () => void;
}

const defaultTanks: Tank[] = [
  {
    reference: 'C-001',
    name: 'Citerne 1',
    capacity: 5000,
    level: 4000,
  },
  {
    reference: 'C-002',
    name: 'Citerne 2',
    capacity: 3000,
    level: 1350,
  },
  {
    reference: 'C-003',
    name: 'Citerne 3',
    capacity: 2000,
    level: 400,
  },
  {
    reference: 'C-004',
    name: 'Citerne 4',
    capacity: 4000,
    level: 0,
  },
];

export function TankStatus({
  tanks = defaultTanks,
  onViewAll,
}: TankStatusProps) {
  const formatNumber = (value: number) =>
    value.toLocaleString('fr-FR');

  const getPercentage = (level: number, capacity: number) => {
    if (capacity <= 0) return 0;

    return Math.min(
      Math.max(Math.round((level / capacity) * 100), 0),
      100,
    );
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 60) return 'bg-[#529447]';
    if (percentage >= 30) return 'bg-[#E9BD25]';
    if (percentage > 0) return 'bg-[#F26464]';
    return 'bg-gray-200';
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm sm:p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-2 px-1 py-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <Database
            size={21}
            strokeWidth={2.1}
            className="shrink-0 text-emerald-600"
          />

          <h2 className="truncate text-sm font-semibold tracking-[-0.25px] text-gray-800 sm:text-base">
            État des citernes
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-[11px] font-semibold text-emerald-700 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 active:scale-[0.97] sm:text-xs"
        >
          <span>Voir toutes</span>
          <ArrowRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Tableau */}
      <div className="mt-3 w-full min-w-0 overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full min-w-[390px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[20%]" />
            <col className="w-[18%]" />
            <col className="w-[17%]" />
            <col className="w-[27%]" />
          </colgroup>

          <thead>
            <tr className="bg-[#F7F8FA]">
              <TableHeader>Référence</TableHeader>
              <TableHeader>Nom</TableHeader>
              <TableHeader align="center">Capacité (L)</TableHeader>
              <TableHeader align="center">Niveau (L)</TableHeader>
              <TableHeader align="center" last>
                Taux
              </TableHeader>
            </tr>
          </thead>

          <tbody>
            {tanks.map((tank) => {
              const percentage = getPercentage(
                tank.level,
                tank.capacity,
              );

              return (
                <tr
                  key={tank.reference}
                  className="transition-colors duration-150 hover:bg-gray-50/80"
                >
                  <TableCell>
                    <span className="whitespace-nowrap text-[10px] font-semibold text-gray-700 sm:text-xs">
                      {tank.reference}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="block truncate text-[10px] font-medium text-gray-600 sm:text-xs">
                      {tank.name}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <span className="whitespace-nowrap text-[10px] font-medium tabular-nums text-gray-600 sm:text-xs">
                      {formatNumber(tank.capacity)}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <span className="whitespace-nowrap text-[10px] font-medium tabular-nums text-gray-600 sm:text-xs">
                      {formatNumber(tank.level)}
                    </span>
                  </TableCell>

                  <TableCell align="center" last>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <div
                        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100 sm:h-2.5"
                        role="progressbar"
                        aria-label={`Taux de remplissage de ${tank.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                      >
                        <div
                          className={`h-full rounded-full transition-[width] duration-500 ${getProgressColor(
                            percentage,
                          )}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="w-7 shrink-0 text-right text-[10px] font-medium tabular-nums text-gray-500 sm:w-8 sm:text-[11px]">
                        {percentage}%
                      </span>
                    </div>
                  </TableCell>
                </tr>
              );
            })}

            {tanks.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-gray-400"
                >
                  Aucune citerne disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* --------------------------------
   En-têtes des colonnes
--------------------------------- */

interface TableHeaderProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  last?: boolean;
}

function TableHeader({
  children,
  align = 'left',
  last = false,
}: TableHeaderProps) {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      scope="col"
      className={`
        border-b border-r border-gray-200/70
        ${last ? 'border-r-0' : ''}
        px-1.5 py-3
        text-[9px] font-semibold
        leading-tight tracking-[0.1px]
        text-[#475467]
        sm:px-2 sm:py-3.5 sm:text-[10px]
        ${alignment[align]}
      `}
    >
      {children}
    </th>
  );
}

/* --------------------------------
   Cellules du tableau
--------------------------------- */

interface TableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  last?: boolean;
}

function TableCell({
  children,
  align = 'left',
  last = false,
}: TableCellProps) {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={`
        border-b border-r border-gray-100
        ${last ? 'border-r-0' : ''}
        px-1.5 py-3
        sm:px-2 sm:py-3.5
        ${alignment[align]}
      `}
    >
      {children}
    </td>
  );
}
