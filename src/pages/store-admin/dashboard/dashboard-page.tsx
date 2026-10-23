
import { Fragment } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Download,
  Leaf,
} from 'lucide-react';

import { Container } from '@/components/common/container';
import { DashboardContent } from './dashboard-content';

export function DashboardPage() {
  return (
    <Fragment>
      <Container>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Titre et description */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E5F0DF]">
              <Leaf
                className="size-7 text-[#526B2F]"
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#182718]">
                Tableau de bord
              </h1>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Suivez en temps réel l'activité de votre production d'huile d'olive
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Filtre de saison */}
            <div className="relative">
  <CalendarDays
    className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#526B2F]"
    strokeWidth={1.8}
  />

  <select
    defaultValue="2026"
    aria-label="Sélectionner une saison"
    className="
      h-11 w-[175px] cursor-pointer appearance-none
      rounded-xl border border-slate-200
      bg-white pl-11 pr-10
      text-sm font-semibold text-slate-700
      shadow-sm
      outline-none transition-all duration-200
      hover:border-[#526B2F]/60 hover:shadow-md
      focus:border-[#526B2F]
      focus:ring-4 focus:ring-[#526B2F]/10
    "
  >
    <option value="2026">Saison 2026</option>
    <option value="2025">Saison 2025</option>
    <option value="2024">Saison 2024</option>
    <option value="2023">Saison 2023</option>
  </select>

  <ChevronDown
    className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500"
    strokeWidth={2}
  />
</div>

            {/* Télécharger le rapport */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#526B2F] px-3 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#405523] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#526B2F]/30 focus:ring-offset-2"
            >
              <Download className="size-4" strokeWidth={2} />
              <span>Télécharger le rapport</span>
            </button>
          </div>
        </div>
      </Container>

      {/* Contenu du tableau de bord */}
      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
}
