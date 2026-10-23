
import { useMemo, useState } from 'react';
import { ChartNoAxesCombined, ChevronDown } from 'lucide-react';

interface ProductionData {
  month: string;
  olives: number;
  oil: number;
}

interface ProductionEvolutionProps {
  data?: ProductionData[];
  maxValue?: number;
  year?: number;
  availableYears?: number[];
  onYearChange?: (year: number) => void;
}

const defaultData: ProductionData[] = [
  { month: 'Jan', olives: 3500, oil: 1000 },
  { month: 'Fév', olives: 4500, oil: 1100 },
  { month: 'Mar', olives: 5000, oil: 1200 },
  { month: 'Avr', olives: 6500, oil: 1300 },
  { month: 'Mai', olives: 8000, oil: 1500 },
  { month: 'Juin', olives: 10000, oil: 1700 },
  { month: 'Juil', olives: 11500, oil: 1900 },
  { month: 'Août', olives: 14000, oil: 2100 },
  { month: 'Sep', olives: 15000, oil: 2200 },
  { month: 'Oct', olives: 10000, oil: 1800 },
  { month: 'Nov', olives: 9500, oil: 1600 },
  { month: 'Déc', olives: 8500, oil: 1500 },
];

const DEFAULT_YEARS = [2026, 2025, 2024, 2023, 2022];

export function ProductionEvolution({
  data = defaultData,
  maxValue = 15000,
  year = 2026,
  availableYears = DEFAULT_YEARS,
  onYearChange,
}: ProductionEvolutionProps) {
  const [selectedYear, setSelectedYear] = useState(year);

  const yAxisValues = useMemo(
    () => [0, 5000, 10000, 15000],
    [],
  );

  const getHeight = (value: number) =>
    Math.max(0, Math.min((value / maxValue) * 100, 100));

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
    onYearChange?.(value);
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <ChartNoAxesCombined
            className="size-6 shrink-0 text-emerald-600"
            strokeWidth={2.2}
          />

          <h2 className="text-base font-semibold text-gray-900">
            Évolution de la production
          </h2>
        </div>

        {/* Filtre par année */}
        <div className="relative shrink-0">
          <select
  value={selectedYear}
  onChange={(event) =>
    handleYearChange(Number(event.target.value))
  }
  aria-label="Filtrer par année"
  className="h-9 w-[120px] cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-3 text-center text-xs font-semibold text-gray-700 outline-none transition hover:border-gray-300 focus:border-green-600"
>
  {availableYears.map((itemYear) => (
    <option key={itemYear} value={itemYear}>
      {itemYear === year ? '2026' : itemYear}
    </option>
  ))}
</select>

          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-6 px-4 pb-3 pt-5">
        <LegendItem
          color="bg-[#526B2F]"
          label="Olives reçues (kg)"
        />

        <LegendItem
          color="bg-[#E8BD24]"
          label="Huile produite (L)"
        />
      </div>

      {/* Graphique */}
      <div className="w-full overflow-hidden px-4 pb-4">
        <div className="flex h-[210px] min-w-0 sm:h-[225px]">
          {/* Axe vertical */}
          <div className="flex w-12 shrink-0 flex-col justify-between pb-7 pr-1 text-right text-[11px] text-gray-400">
            {[...yAxisValues].reverse().map((value) => (
              <span key={value}>
                {value.toLocaleString('fr-FR')}
              </span>
            ))}
          </div>

          {/* Zone du graphique */}
          <div className="relative min-w-0 flex-1">
            {/* Grille horizontale */}
            <div className="absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">
              {yAxisValues.map((value) => (
                <div
                  key={value}
                  className="w-full border-t border-gray-100"
                />
              ))}
            </div>

            {/* Barres */}
            <div className="absolute inset-x-0 bottom-7 top-0 flex items-end">
              {data.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <div className="flex h-full items-end justify-center gap-1">
                    <div
                      className="w-[9px] rounded-t-[4px] bg-[#526B2F] transition-opacity hover:opacity-80"
                      style={{
                        height: `${getHeight(item.olives)}%`,
                      }}
                      title={`${item.olives.toLocaleString('fr-FR')} kg`}
                    />

                    <div
                      className="w-[9px] rounded-t-[4px] bg-[#E8BD24] transition-opacity hover:opacity-80"
                      style={{
                        height: `${getHeight(item.oil)}%`,
                      }}
                      title={`${item.oil.toLocaleString('fr-FR')} L`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mois */}
            <div className="absolute inset-x-0 bottom-0 flex h-7">
              {data.map((item) => (
                <span
                  key={item.month}
                  className="min-w-0 flex-1 whitespace-nowrap text-center text-[11px] text-gray-400"
                >
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------
   Légende
--------------------------------- */

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2.5 shrink-0 rounded-full ${color}`} />

      <span className="whitespace-nowrap text-xs text-gray-500">
        {label}
      </span>
    </div>
  );
}
