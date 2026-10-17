import { Fragment } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { Container } from '@/components/common/container';

import { DashboardContent } from './dashboard-content';

export function DashboardPage() {
  return (
    <Fragment>
      <Container>
        <div className="mb-5 flex items-center justify-between gap-4">
          {/* Titre */}
          <h1 className="text-2xl font-bold tracking-tight text-[#182718]">
            Tableau de bord
          </h1>

          
        </div>
      </Container>

      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
}