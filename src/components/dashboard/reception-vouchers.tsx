
import { FileText, ArrowRight } from 'lucide-react';
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
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-2 px-1 py-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileText
            className="size-[19px] shrink-0 text-emerald-600"
            strokeWidth={2.2}
          />

          <h2 className="truncate text-[13px] font-semibold tracking-[-0.2px] text-gray-800 sm:text-sm">
            Derniers bons de réception
          </h2>
        </div>

        <button
  type="button"
  onClick={onViewAll}
  className="
    group inline-flex shrink-0 items-center gap-1.5
    rounded-lg border border-emerald-100
    bg-emerald-50/70
    px-3 py-2
    text-[11px] font-semibold text-emerald-700
    shadow-sm
    transition-all duration-200
    hover:border-emerald-200
    hover:bg-emerald-100
    hover:text-emerald-800
    hover:shadow
    active:scale-[0.97]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-emerald-500
    focus-visible:ring-offset-2
  "
>
  <span>Voir tout</span>

  <ArrowRight
    size={13}
    strokeWidth={2}
    className="transition-transform duration-200 group-hover:translate-x-0.5"
  />
</button>
      </div>

      {/* Tableau */}
      <div className="mt-2 w-full min-w-0 overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full min-w-[510px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[17%]" />
            <col className="w-[22%]" />
            <col className="w-[17%]" />
            <col className="w-[11%]" />
            <col className="w-[15%]" />
          </colgroup>

          <thead>
            <tr className="bg-gray-50">
              <TableHeader>Référence</TableHeader>
              <TableHeader>Compte</TableHeader>
              <TableHeader>Date de création</TableHeader>
              <TableHeader align="center">
                Quantité d'olives
              </TableHeader>
              <TableHeader align="center">
                Huile (L)
              </TableHeader>
              <TableHeader align="center" last>
                Statut
              </TableHeader>
            </tr>
          </thead>

          <tbody>
            {vouchers.map((voucher) => (
              <tr
                key={voucher.reference}
                className="group transition-colors hover:bg-gray-50/80"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="flex size-[17px] shrink-0 items-center justify-center rounded bg-[#edf4e6] text-[#526b2f]">
                      <FileText size={11} strokeWidth={2} />
                    </span>

                    <span className="whitespace-nowrap text-[10px] font-semibold text-gray-700 sm:text-[11px]">
                      {voucher.reference}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="block truncate text-[10px] font-normal text-gray-600 sm:text-[11px]">
                    {voucher.account}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-[9px] text-gray-500 sm:text-[10px]">
                    {voucher.createdAt}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <span className="whitespace-nowrap text-[10px] font-normal text-gray-700 sm:text-[11px]">
                    {formatNumber(voucher.olivesQuantity)} kg
                  </span>
                </TableCell>

                <TableCell align="center">
                  <span className="whitespace-nowrap text-[10px] font-normal text-gray-700 sm:text-[11px]">
                    {formatNumber(voucher.oilQuantity)} L
                  </span>
                </TableCell>

                <TableCell align="center" last>
                  <div className="flex justify-center">
                    <VoucherStatus status={voucher.status} />
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------------
   En-tête du tableau
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
      className={`border-b border-r border-gray-100 px-2 py-[7px] text-[9px] font-semibold tracking-[-0.15px] text-gray-700 sm:text-[10px] ${
        last ? 'border-r-0' : ''
      } ${alignment[align]}`}
    >
      {children}
    </th>
  );
}

/* --------------------------------
   Cellule du tableau
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
      className={`border-b border-r border-gray-100 px-2 py-[7px] ${
        last ? 'border-r-0' : ''
      } ${alignment[align]}`}
    >
      {children}
    </td>
  );
}

/* --------------------------------
   Badge de statut
--------------------------------- */

function VoucherStatus({
  status,
}: {
  status: ReceptionVoucherStatus;
}) {
  const styles: Record<ReceptionVoucherStatus, string> = {
    'En cours': 'bg-blue-50 text-blue-600',
    Clôturé: 'bg-emerald-50 text-emerald-700',
  };

  const labels: Record<ReceptionVoucherStatus, string> = {
    'En cours': 'En cours',
    Clôturé: 'Validé',
  };

  return (
    <span
      className={`inline-flex min-w-[53px] items-center justify-center rounded-full px-2 py-[4px] text-[9px] font-medium leading-none sm:text-[10px] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
