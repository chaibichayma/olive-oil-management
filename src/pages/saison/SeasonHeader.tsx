
import {
  CalendarDays,
  ChevronRight,
  Plus,
  TrendingUp,
  Tag,
  ChartNoAxesColumnIncreasing,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

interface SeasonHeaderProps {
  totalSeasons: number;
  averagePurchasePrice: number;
  averageSalePrice: number;
  currentYear: number | null;
  currentBeginDate?: string;
  currentEndDate?: string;
  onAddSeason: () => void;
}

export function SeasonHeader({
  totalSeasons,
  averagePurchasePrice,
  averageSalePrice,
  currentYear,
  currentBeginDate,
  currentEndDate,
  onAddSeason,
}: SeasonHeaderProps) {
  const formatPrice = (value: number) =>
    `${value.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} DT`;

  const formatDate = (value?: string) => {
    if (!value) return '—';

    const date = new Date(`${value.slice(0, 10)}T00:00:00`);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('fr-FR');
  };

  const cards = [
    {
      title: 'Nombre de saisons',
      value: String(totalSeasons),
      icon: CalendarDays,
      color: 'green',
      footer: 'Saisons enregistrées',
    },
    {
      title: "Prix moyen d’achat (1L)",
      value: formatPrice(averagePurchasePrice),
      icon: ChartNoAxesColumnIncreasing,
      color: 'amber',
      footer: 'Prix moyen par litre',
    },
    {
      title: 'Prix moyen de vente (1L)',
      value: formatPrice(averageSalePrice),
      icon: Tag,
      color: 'blue',
      footer: 'Prix moyen par litre',
    },
  ] as const;

  const colors = {
    green: {
      card: 'border-[#E7EDE1] bg-[#FCFDFB]',
      icon: 'bg-[#EEF4E7] text-[#617D3B]',
      bars: 'text-[#A7C88B]',
    },
    amber: {
      card: 'border-[#F1E8D7] bg-[#FFFDF9]',
      icon: 'bg-[#FFF3DA] text-[#B98512]',
      bars: 'text-[#F2C65D]',
    },
    blue: {
      card: 'border-[#E1EAF5] bg-[#FBFDFF]',
      icon: 'bg-[#EAF3FD] text-[#347CC4]',
      bars: 'text-[#91C4F0]',
    },
  };

  return (
    <Container>
      <div className="space-y-6 py-6">
        {/* Fil d'Ariane */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          <span>Accueil</span>
          <ChevronRight className="size-4" />
          <span>Paramétrage</span>
          <ChevronRight className="size-4" />
          <span className="font-semibold text-gray-800">
            Saisons
          </span>
        </nav>

        {/* Titre et bouton */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4E7]">
              <CalendarDays className="size-8 text-[#556B2F]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Saisons
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Gestion des campagnes et paramètres de production
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={onAddSeason}
            className="h-12 gap-2 rounded-xl bg-[#556B2F] px-5 text-white shadow-sm transition hover:bg-[#465A27]"
          >
            <Plus className="size-5" />
            Ajouter une saison
          </Button>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const color = colors[card.color];

            return (
              <div
                key={card.title}
                className={`flex min-h-[170px] items-center gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-md ${color.card}`}
              >
                <div
                  className={`flex size-[68px] shrink-0 items-center justify-center rounded-full ${color.icon}`}
                >
                  <Icon className="size-8" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {card.footer}
                  </p>
                </div>

                <div className={`hidden items-end gap-1 self-center sm:flex ${color.bars}`}>
                  <span className="h-3 w-2 rounded-full bg-current opacity-60" />
                  <span className="h-5 w-2 rounded-full bg-current opacity-75" />
                  <span className="h-7 w-2 rounded-full bg-current" />
                  <span className="h-10 w-2 rounded-full bg-current opacity-80" />
                </div>
              </div>
            );
          })}

          {/* Carte saison actuelle */}
          <div className="min-h-[170px] rounded-2xl border border-[#F4E3E5] bg-[#FFFCFC] p-5 transition-shadow hover:shadow-md">
            <div className="flex h-full items-start gap-4">
              <div className="flex size-[68px] shrink-0 items-center justify-center rounded-full bg-[#FDEBED] text-[#C94343]">
                <TrendingUp className="size-8" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">
                  Saison actuelle
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {currentYear ?? '—'}
                  </span>

                  {currentYear !== null && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF7E8] px-3 py-1 text-xs font-semibold text-[#557B36]">
                      <span className="size-2 rounded-full bg-[#65A747]" />
                      En cours
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  {currentBeginDate && currentEndDate
                    ? `${formatDate(currentBeginDate)} – ${formatDate(currentEndDate)}`
                    : 'Dates non renseignées'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
