import { Package, Coins, Droplets, Leaf } from 'lucide-react';
import { StatCard } from '@/components/common/stat-card';

const statistics = [
  {
    title: "Quantité d'olives reçues",
    value: "12 540",
    unit: "kg",
    icon: <Leaf className="size-7 text-green-800" />,
    background: 'bg-[#EEF5EA]',
  },
  {
    title: "Quantité d'huile produite",
    value: "2 450",
    unit: "L",
    icon: <Droplets className="size-7 text-yellow-600" />,
    background: 'bg-[#F8F3E5]',
  },
  {
    title: "Nombre de caisses",
    value: "500",
    icon: <Package className="size-7 text-[#526B2F]" />,
    background: 'bg-[#EDF4F1]',
  },
  {
    title: "Prix d'un kilo d'olivier",
    value: "0,80",
    unit: "DT",
    icon: <Coins className="size-7 text-amber-800" />,
    background: 'bg-[#F5EFEB]',
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {statistics.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          unit={stat.unit}
          icon={stat.icon}
          className={stat.background}
        />
      ))}
    </div>
  );
}