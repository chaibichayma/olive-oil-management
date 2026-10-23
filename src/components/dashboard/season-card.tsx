
import {
  CalendarDays,
  UsersRound,
  Calendar,
  Coins,
  TrendingUp,
  TrendingDown,
  Package,
} from 'lucide-react';

import { StatusBadge } from '@/components/common/status-badge';

interface SeasonCardProps {
  year?: number;
  startDate?: string;
  endDate?: string;
  olivePrice?: number;
  oilPurchasePrice?: number;
  oilSalePrice?: number;
  numberOfBoxes?: number;
  status?: 'En cours' | 'Clôturé';
}

interface InfoRowProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor?: string;
  last?: boolean;
}

export function SeasonCard({
  year = 2026,
  startDate = '01/01/2026',
  endDate = '31/01/2027',
  olivePrice = 0.8,
  oilPurchasePrice = 10,
  oilSalePrice = 12,
  numberOfBoxes = 500,
  status = 'En cours',
}: SeasonCardProps) {
  const formatPrice = (price: number) =>
    `${price.toFixed(2).replace('.', ',')} DT`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <CalendarDays
            className="size-6 shrink-0 text-emerald-600"
            strokeWidth={2.2}
          />

          <h2 className="text-base font-semibold text-gray-900">
            Informations sur la saison
          </h2>
        </div>

        <div className="shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Informations de la saison */}
      <div className="px-5">
        <InfoRow
          icon={UsersRound}
          label="Année"
          value={String(year)}
          iconColor="text-gray-500"
        />

        <InfoRow
          icon={Calendar}
          label="Date début"
          value={startDate}
          iconColor="text-gray-500"
        />

        <InfoRow
          icon={Calendar}
          label="Date fin"
          value={endDate}
          iconColor="text-gray-500"
        />

        <InfoRow
          icon={Coins}
          label="Prix d'un kilo d'olivier"
          value={formatPrice(olivePrice)}
          iconColor="text-amber-500"
        />

        <InfoRow
          icon={TrendingUp}
          label="Prix achat (1L huile)"
          value={formatPrice(oilPurchasePrice)}
          iconColor="text-green-600"
        />

        <InfoRow
          icon={TrendingDown}
          label="Prix vente (1L huile)"
          value={formatPrice(oilSalePrice)}
          iconColor="text-amber-500"
        />

        <InfoRow
          icon={Package}
          label="Nombre de caisses"
          value={numberOfBoxes.toLocaleString('fr-FR')}
          iconColor="text-gray-500"
          last
        />
      </div>
    </div>
  );
}

/* --------------------------------
   Ligne d'information réutilisable
--------------------------------- */

function InfoRow({
  label,
  value,
  icon: Icon,
  iconColor = 'text-gray-500',
  last = false,
}: InfoRowProps) {
  return (
    <div
      className={`flex min-h-[39px] items-center justify-between gap-3 py-2 ${
        !last ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className={`size-[18px] shrink-0 ${iconColor}`}
          strokeWidth={2}
        />

        <span className="truncate text-sm text-gray-600">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-gray-900">
        {value}
      </span>
    </div>
  );
}
