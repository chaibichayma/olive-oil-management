
import {
  Package,
  Coins,
  Droplets,
  Leaf,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface Statistic {
  title: string;
  value: string;
  unit?: string;
  icon: typeof Leaf;
  iconColor: string;
  iconBackground: string;
  cardBackground: string;
  trend: string;
  trendLabel: string;
  positive: boolean;
  chart: number[];
}

const statistics: Statistic[] = [
  {
    title: "Quantité d'olives reçues",
    value: '12 540',
    unit: 'kg',
    icon: Leaf,
    iconColor: 'text-emerald-700',
    iconBackground: 'bg-emerald-100',
    cardBackground: 'bg-[#F1F8F0]',
    trend: '+12%',
    trendLabel: 'par rapport à la saison précédente',
    positive: true,
    chart: [12, 18, 14, 25, 20, 34, 30, 42],
  },
  {
    title: "Quantité d'huile produite",
    value: '2 450',
    unit: 'L',
    icon: Droplets,
    iconColor: 'text-amber-600',
    iconBackground: 'bg-amber-100',
    cardBackground: 'bg-[#FCF7E9]',
    trend: '+8%',
    trendLabel: 'par rapport à la saison précédente',
    positive: true,
    chart: [10, 15, 12, 24, 19, 30, 27, 38],
  },
  {
    title: 'Nombre de caisses',
    value: '500',
    icon: Package,
    iconColor: 'text-blue-600',
    iconBackground: 'bg-blue-100',
    cardBackground: 'bg-[#EFF6FF]',
    trend: '+5%',
    trendLabel: 'par rapport à la saison précédente',
    positive: true,
    chart: [10, 16, 13, 25, 20, 31, 28, 39],
  },
  {
    title: "Prix d'un kilo d'olivier",
    value: '0,80',
    unit: 'DT',
    icon: Coins,
    iconColor: 'text-red-600',
    iconBackground: 'bg-red-100',
    cardBackground: 'bg-[#FFF1F1]',
    trend: '-3%',
    trendLabel: 'par rapport à la saison précédente',
    positive: false,
    chart: [35, 28, 34, 24, 29, 18, 23, 15],
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statistics.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.positive
          ? TrendingUp
          : TrendingDown;

        return (
          <div
            key={stat.title}
            className={`
              group relative min-w-0 overflow-hidden
              rounded-2xl border border-white/80
              ${stat.cardBackground}
              p-4 shadow-sm
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-md
            `}
          >
            <div className="flex items-start gap-3">
              {/* Icône */}
              <div
                className={`
                  flex size-11 shrink-0 items-center justify-center
                  rounded-full ${stat.iconBackground}
                  ring-1 ring-white/70
                `}
              >
                <Icon
                  className={`size-6 ${stat.iconColor}`}
                  strokeWidth={2.2}
                />
              </div>

              {/* Informations */}
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium leading-5 text-slate-600">
                  {stat.title}
                </p>

                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-[25px] font-bold leading-8 tracking-tight text-slate-900">
                    {stat.value}
                  </span>

                  {stat.unit && (
                    <span className="text-sm font-semibold text-slate-700">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Évolution et mini-graphique */}
            <div className="mt-3 flex min-w-0 items-end justify-between gap-2">
              <div className="min-w-0">
                <div
                  className={`
                    flex items-center gap-1 text-xs font-bold
                    ${stat.positive ? 'text-emerald-600' : 'text-red-600'}
                  `}
                >
                  <TrendIcon className="size-3.5" strokeWidth={2.5} />
                  <span>{stat.trend}</span>
                </div>

                <p className="mt-1 text-[9px] leading-4 text-slate-500">
                  {stat.trendLabel}
                </p>
              </div>

              <MiniChart
                values={stat.chart}
                color={stat.positive ? '#4CAF70' : '#FF7777'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface MiniChartProps {
  values: number[];
  color: string;
}

function MiniChart({ values, color }: MiniChartProps) {
  const width = 76;
  const height = 30;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 3 - ((value - min) / range) * (height - 8);

      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-8 w-[76px] shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`chart-gradient-${color.replace('#', '')}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <polygon
        points={areaPoints}
        fill={`url(#chart-gradient-${color.replace('#', '')})`}
      />

      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
