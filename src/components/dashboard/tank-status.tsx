import { BriefcaseBusiness } from 'lucide-react';

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
  const formatNumber = (value: number) => {
    return value.toLocaleString('fr-FR');
  };

  const getPercentage = (level: number, capacity: number) => {
    if (capacity <= 0) return 0;

    return Math.min(
      Math.round((level / capacity) * 100),
      100,
    );
  };

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-2 py-2 sm:px-1 sm:py-2">
        <div className="flex min-w-0 items-center gap-3">
          <BriefcaseBusiness className="size-5 shrink-0 text-green-700" />

          <h2 className="truncate text-base font-semibold text-foreground">
            État des citernes
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="ml-3 shrink-0 text-sm font-medium text-green-700 transition-colors hover:text-green-900"
        >
          Voir toutes
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="mt-2 overflow-hidden rounded-lg border border-border">

        <table className="w-full table-fixed border-collapse">

          {/* ---------- HEADER ---------- */}
          <thead>
            <tr className="bg-muted/50">

              <TableHeader width="18%">
                Référence
              </TableHeader>

              <TableHeader width="22%">
                Nom
              </TableHeader>

              <TableHeader width="20%" align="center">
                Capacité (L)
              </TableHeader>

              <TableHeader width="18%" align="center">
                Niveau (L)
              </TableHeader>

              <TableHeader width="22%" align="center" last>
                Taux
              </TableHeader>

            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            {tanks.map((tank) => {
              const percentage = getPercentage(
                tank.level,
                tank.capacity,
              );

              return (
                <tr
                  key={tank.reference}
                  className="last:[&>td]:border-b-0"
                >

                  {/* Reference */}
                  <TableCell>
                    <span className="font-medium">
                      {tank.reference}
                    </span>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="block truncate">
                      {tank.name}
                    </span>
                  </TableCell>

                  {/* Capacity */}
                  <TableCell align="center">
                    {formatNumber(tank.capacity)}
                  </TableCell>

                  {/* Level */}
                  <TableCell align="center">
                    {formatNumber(tank.level)}
                  </TableCell>

                  {/* Progress */}
                  <TableCell align="center" last>
                    <div className="flex items-center justify-center gap-2">

                      {/* Progress background */}
                      <div className="h-3 w-14 overflow-hidden rounded-full bg-muted sm:w-16">
                        <div
                          className="h-full rounded-full bg-[#526B2F] transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      {/* Percentage */}
                      <span className="w-8 text-right text-xs font-medium text-muted-foreground">
                        {percentage}%
                      </span>

                    </div>
                  </TableCell>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* Petit espace sous le tableau */}
      <div className="h-1" />

    </div>
  );
}

/* =====================================================
   TABLE HEADER
===================================================== */

interface TableHeaderProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  last?: boolean;
}

function TableHeader({
  children,
  align = 'left',
  width,
  last = false,
}: TableHeaderProps) {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      style={{ width }}
      className={`
        border-b border-border
        ${!last ? 'border-r' : ''}
        px-2.5
        py-3
        text-xs
        font-medium
        text-black
        ${alignment[align]}
      `}
    >
      {children}
    </th>
  );
}

/* =====================================================
   TABLE CELL
===================================================== */

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
        border-b border-border
        ${!last ? 'border-r' : ''}
        px-2.5
        py-4
        text-sm
        text-foreground
        ${alignment[align]}
      `}
    >
      {children}
    </td>
  );
}