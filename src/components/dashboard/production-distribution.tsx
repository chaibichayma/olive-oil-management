import { Package, Droplets, Leaf } from 'lucide-react';

interface DistributionItem {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
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
  const total = olivesReceived + oilProduced + numberOfBoxes;

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
      color: '#E5C23B',
      icon: <Droplets className="size-4" />,
    },
    {
      label: 'Nombre de caisses',
      value: numberOfBoxes,
      color: '#8BC89B',
      icon: <Package className="size-4" />,
    },
  ];

  const formatNumber = (value: number) => {
    return value.toLocaleString('fr-FR');
  };

  /*
   * Calcul des pourcentages pour le graphique circulaire.
   */
  const olivePercentage = (olivesReceived / total) * 100;
  const oilPercentage = (oilProduced / total) * 100;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-foreground">
          Répartition
        </h2>
      </div>

      {/* Content */}
      <div className="flex min-h-[280px] items-center justify-center gap-6 p-5">
        
        {/* Donut chart */}
        <div className="relative flex shrink-0 items-center justify-center">
          <div
            className="size-40 rounded-full"
            style={{
              background: `conic-gradient(
                #526B2F 0% ${olivePercentage}%,
                #E5C23B ${olivePercentage}% ${olivePercentage + oilPercentage}%,
                #8BC89B ${olivePercentage + oilPercentage}% 100%
              )`,
            }}
          >
            {/* Centre blanc */}
            <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-card">
              <span className="text-sm text-muted-foreground">
                Total
              </span>

              <span className="text-xl font-bold">
                {formatNumber(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span style={{ color: item.color }}>
                  {item.icon}
                </span>

                <span className="text-lg font-bold">
                  {formatNumber(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}