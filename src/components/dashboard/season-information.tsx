import { CalendarDays } from 'lucide-react';
import { SectionCard } from '@/components/common/section-card';
import { StatusBadge } from '@/components/common/status-badge';

interface SeasonInformationProps {
  year?: number;
  startDate?: string;
  endDate?: string;
  olivePrice?: number;
  oilPurchasePrice?: number;
  oilSalePrice?: number;
  numberOfBoxes?: number;
  status?: 'En cours' | 'Clôturé';
}

export function SeasonInformation({
  year = 2026,
  startDate = '01/01/2026',
  endDate = '31/01/2027',
  olivePrice = 0.8,
  oilPurchasePrice = 10,
  oilSalePrice = 12,
  numberOfBoxes = 500,
  status = 'En cours',
}: SeasonInformationProps) {
  return (
    <SectionCard
      title="Informations sur la saison"
      action={<StatusBadge status={status} />}
    >
      <div className="space-y-0">
        <InfoRow label="Année" value={year.toString()} />

        <InfoRow label="Date début" value={startDate} />

        <InfoRow label="Date fin" value={endDate} />

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
    </SectionCard>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function InfoRow({ label, value, last = false }: InfoRowProps) {
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