import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { ProductionDistribution } from '@/components/dashboard/production-distribution';
import { ProductionEvolution } from '@/components/dashboard/production-evolution';
import { ReceptionVouchers } from '@/components/dashboard/reception-vouchers';
import { TankStatus } from '@/components/dashboard/tank-status';
import { SeasonCard } from '@/components/dashboard/season-card';

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <DashboardStats />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SeasonCard />

        <ProductionDistribution />

        <ProductionEvolution />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ReceptionVouchers />

        <TankStatus />
      </div>
    </div>
  );
}