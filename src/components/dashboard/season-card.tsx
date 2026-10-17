import { CalendarDays } from 'lucide-react';
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
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5 text-green-700" />

          <h2 className="font-semibold">
            Informations sur la saison
          </h2>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Informations */}
      <div className="px-5">
        <InfoRow
          label="Année"
          value={year.toString()}
        />

        <InfoRow
          label="Date début"
          value={startDate}
        />

        <InfoRow
          label="Date fin"
          value={endDate}
        />

        <InfoRow
          label="Prix d'un kilo d'olivier"
          value={`${olivePrice.toFixed(2).replace('.', ',')} DT`}
        />

        <InfoRow
          label="Prix achat (1L huile)"
          value={`${oilPurchasePrice.toFixed(2).replace('.', ',')} DT`}
        />

        <InfoRow
          label="Prix vente (1L huile)"
          value={`${oilSalePrice.toFixed(2).replace('.', ',')} DT`}
        />

        <InfoRow
          label="Nombre de caisses"
          value={numberOfBoxes.toLocaleString('fr-FR')}
          last
        />
      </div>
    </div>
  );
}

/* --------------------------------
   Composant réutilisable InfoRow
--------------------------------- */

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