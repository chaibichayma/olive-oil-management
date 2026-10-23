
import { Package, Droplets, Leaf } from 'lucide-react';

interface DistributionItem {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface ProductionDistributionProps {
  olivesReceived?: number;
  oilProduced?: number;
  numberOfBoxes?: number;
}

export function ProductionDistribution({
  olivesReceived = 12540,
  oilProduced = 2450,
  numberOfBoxes = 500,
}: ProductionDistributionProps) {
  const items: DistributionItem[] = [
    {
      label: 'Olives reçues (kg)',
      value: olivesReceived,
      color: '#526B2F',
      icon: <Leaf className="size-4" />,
    },
    {
      label: 'Huile produite (L)',
      value: oilProduced,
      color: '#E8BC27',
      icon: <Droplets className="size-4" />,
    },
    {
      label: 'Nombre de caisses',
      value: numberOfBoxes,
      color: '#929BAA',
      icon: <Package className="size-4" />,
    },
  ];

  // Le total correspond à la somme des trois indicateurs.
  const total = items.reduce((sum, item) => sum + item.value, 0);

  const formatNumber = (value: number) =>
    value.toLocaleString('fr-FR');

  const getPercentage = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  // Calcul des segments du graphique en anneau.
  let currentPercentage = 0;

  const gradientSegments = items.map((item) => {
    const start = currentPercentage;
    const percentage = total > 0 ? (item.value / total) * 100 : 0;

    currentPercentage += percentage;

    return `${item.color} ${start}% ${currentPercentage}%`;
  });

  const gradient =
    total > 0
      ? `conic-gradient(${gradientSegments.join(', ')})`
      : '#E5E7EB';

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* En-tête */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold tracking-tight text-slate-800">
          Répartition de la production
        </h2>
      </div>

      {/* Contenu */}
      <div className="flex min-h-[250px] flex-1 flex-col items-center justify-center gap-6 p-5 sm:flex-row sm:gap-5">
        {/* Graphique en anneau */}
        <div className="relative size-40 shrink-0 sm:size-36 lg:size-40">
          <div
            className="absolute inset-0 rounded-full shadow-inner"
            style={{ background: gradient }}
            role="img"
            aria-label={`Répartition : olives ${getPercentage(olivesReceived)} %, huile ${getPercentage(oilProduced)} %, caisses ${getPercentage(numberOfBoxes)} %`}
          />

          {/* Centre du graphique */}
          <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
            <span className="text-[11px] font-medium text-slate-400">
              Total
            </span>

            <span className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-800">
              {formatNumber(total)}
            </span>

            <span className="mt-1 text-[9px] font-medium text-slate-400">
              Indicateurs cumulés
            </span>
          </div>
        </div>

        {/* Légende */}
        <div className="flex w-full min-w-0 flex-col justify-center gap-5 sm:flex-1">
          {items.map((item) => (
            <div
              key={item.label}
              className="min-w-0"
            >
              {/* Libellé et pastille */}
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="truncate text-[11px] font-medium text-slate-500">
                  {item.label}
                </span>
              </div>

              {/* Valeur et pourcentage */}
              <div className="ml-[18px] mt-1 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span style={{ color: item.color }}>
                    {item.icon}
                  </span>

                  <span className="text-base font-extrabold tracking-tight text-slate-800">
                    {formatNumber(item.value)}
                  </span>
                </div>

                <span className="shrink-0 text-[10px] font-medium text-slate-400">
                  ({getPercentage(item.value)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
