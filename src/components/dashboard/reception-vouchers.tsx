
import { FileText } from 'lucide-react';
import { StatusBadge } from '@/components/common/status-badge';

export type ReceptionVoucherStatus = 'En cours' | 'Clôturé';

export interface ReceptionVoucher {
  reference: string;
  account: string;
  createdAt: string;
  olivesQuantity: number;
  oilQuantity: number;
  status: ReceptionVoucherStatus;
}

interface ReceptionVouchersProps {
  vouchers?: ReceptionVoucher[];
  onViewAll?: () => void;
}

const defaultVouchers: ReceptionVoucher[] = [
  {
    reference: 'BR-001',
    account: 'Ahmed Ben Ali',
    createdAt: '25/09/2026 10:30',
    olivesQuantity: 1500,
    oilQuantity: 300,
    status: 'En cours',
  },
  {
    reference: 'BR-002',
    account: 'Client 1',
    createdAt: '22/09/2026 14:00',
    olivesQuantity: 2000,
    oilQuantity: 400,
    status: 'En cours',
  },
  {
    reference: 'BR-003',
    account: 'Fournisseur 1',
    createdAt: '20/09/2026 09:15',
    olivesQuantity: 800,
    oilQuantity: 150,
    status: 'En cours',
  },
  {
    reference: 'BR-004',
    account: 'Ahmed Ben Ali',
    createdAt: '18/09/2026 16:45',
    olivesQuantity: 1200,
    oilQuantity: 250,
    status: 'Clôturé',
  },
  {
    reference: 'BR-005',
    account: 'Client 2',
    createdAt: '15/09/2026 11:20',
    olivesQuantity: 600,
    oilQuantity: 110,
    status: 'Clôturé',
  },
];

export function ReceptionVouchers({
  vouchers = defaultVouchers,
  onViewAll,
}: ReceptionVouchersProps) {
  const formatNumber = (value: number) =>
    value.toLocaleString('fr-FR');

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
      {/* HEADER */}
      <div className="flex min-w-0 items-center justify-between gap-2 px-2 py-2 sm:px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileText className="size-5 shrink-0 text-green-700" />

          <h2 className="min-w-0 text-sm font-semibold text-foreground sm:truncate">
            Derniers bons de réception
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 whitespace-nowrap text-xs font-medium text-green-700 transition-colors hover:text-green-900"
        >
          Voir tout
        </button>
      </div>

      {/* TABLEAU RESPONSIVE */}
      <div className="mt-2 w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-border">
        <table className="w-max min-w-[760px] table-auto border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <TableHeader width="100px">Référence</TableHeader>
              <TableHeader width="140px">Compte</TableHeader>
              <TableHeader width="180px">Date de création</TableHeader>
              <TableHeader width="140px" align="center">
                Quantité d'olives (kg)
              </TableHeader>
              <TableHeader width="140px" align="center">
                Quantité d'huile (L)
              </TableHeader>
              <TableHeader width="110px" align="center" last>
                Statut
              </TableHeader>
            </tr>
          </thead>

          <tbody>
            {vouchers.map((voucher) => (
              <tr
                key={voucher.reference}
                className="last:[&>td]:border-b-0"
              >
                <TableCell>
                  <span className="whitespace-nowrap font-medium">
                    {voucher.reference}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap">
                    {voucher.account}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap">
                    {voucher.createdAt}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <span className="whitespace-nowrap">
                    {formatNumber(voucher.olivesQuantity)}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <span className="whitespace-nowrap">
                    {formatNumber(voucher.oilQuantity)}
                  </span>
                </TableCell>

                <TableCell align="center" last>
                  <div className="flex justify-center whitespace-nowrap">
                    <StatusBadge status={voucher.status} />
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-1" />
    </div>
  );
}

/* TABLE HEADER */

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
      style={{ width, minWidth: width }}
      className={`
        border-b border-border
        ${!last ? 'border-r' : ''}
        bg-muted/50
        px-3
        py-3
        text-[11px]
        font-medium
        text-black
        ${alignment[align]}
      `}
    >
      {children}
    </th>
  );
}

/* TABLE CELL */

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
        px-3
        py-3
        text-xs
        text-foreground
        ${alignment[align]}
      `}
    >
      {children}
    </td>
  );
}
