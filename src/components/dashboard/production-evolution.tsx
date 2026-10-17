import { useMemo } from 'react';

interface ProductionData {
  month: string;
  olives: number;
  oil: number;
}

interface ProductionEvolutionProps {
  data?: ProductionData[];
  maxValue?: number;
}

const defaultData: ProductionData[] = [
  { month: 'Jan', olives: 4000, oil: 1000 },
  { month: 'Fév', olives: 4500, oil: 1100 },
  { month: 'Mar', olives: 5000, oil: 1200 },
  { month: 'Avr', olives: 6000, oil: 1300 },
  { month: 'Mai', olives: 7500, oil: 1500 },
  { month: 'Juin', olives: 9000, oil: 1700 },
  { month: 'Juil', olives: 10000, oil: 1900 },
  { month: 'Août', olives: 12500, oil: 2100 },
  { month: 'Sep', olives: 13500, oil: 2200 },
  { month: 'Oct', olives: 9000, oil: 1800 },
  { month: 'Nov', olives: 8500, oil: 1600 },
  { month: 'Déc', olives: 8000, oil: 1500 },
];

export function ProductionEvolution({
  data = defaultData,
  maxValue = 15000,
}: ProductionEvolutionProps) {
  const yAxisValues = useMemo(() => {
    return [0, 5000, 10000, 15000];
  }, []);

  const getHeight = (value: number) => {
    return Math.min((value / maxValue) * 100, 100);
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">
          Évolution de la production
        </h2>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 px-5 pb-3 pt-5">
        <LegendItem
          color="bg-[#526B2F]"
          label="Olives reçues (kg)"
        />

        <LegendItem
          color="bg-[#E5C23B]"
          label="Huile produite (L)"
        />
      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden px-4 pb-5">
        <div className="flex h-[250px] min-w-0">

          {/* Y Axis */}
          <div className="flex w-12 shrink-0 flex-col justify-between pb-7 text-right text-xs text-muted-foreground">
            {[...yAxisValues].reverse().map((value) => (
              <span key={value}>
                {value.toLocaleString('fr-FR')}
              </span>
            ))}
          </div>

          {/* Chart area */}
          <div className="relative min-w-0 flex-1">

            {/* Grid */}
            <div className="absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">
              {yAxisValues.map((value) => (
                <div
                  key={value}
                  className="w-full border-t border-border"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-x-0 bottom-7 top-0 flex items-end">
              {data.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <div className="flex h-full items-end justify-center gap-1">

                    {/* Olives */}
                    <div
                      className="w-[9px] rounded-t-sm bg-[#526B2F] transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${getHeight(item.olives)}%`,
                      }}
                      title={`${item.olives.toLocaleString(
                        'fr-FR',
                      )} kg`}
                    />

                    {/* Huile */}
                    <div
                      className="w-[9px] rounded-t-sm bg-[#E5C23B] transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${getHeight(item.oil)}%`,
                      }}
                      title={`${item.oil.toLocaleString(
                        'fr-FR',
                      )} L`}
                    />

                  </div>
                </div>
              ))}
            </div>

            {/* Months */}
            <div className="absolute inset-x-0 bottom-0 flex h-7">
              {data.map((item) => (
                <span
                  key={item.month}
                  className="min-w-0 flex-1 text-center text-[11px] text-muted-foreground"
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
   Legend
--------------------------------- */

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({
  color,
  label,
}: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`size-2.5 shrink-0 rounded-full ${color}`}
      />

      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}