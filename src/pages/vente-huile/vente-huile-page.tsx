import { Container } from '@/components/common/container';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { ShoppingCart } from 'lucide-react';

export function VenteHuilePage() {
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle text="Vente d'huile" />
          <ToolbarDescription>
            Gestion des ventes d'huile d'olive.
          </ToolbarDescription>
        </ToolbarHeading>
      </Toolbar>

      <div className="rounded-xl border border-[#DCE8CF] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#F4F8EF]">
            <ShoppingCart className="size-6 text-[#556B2F]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Gestion des ventes d'huile
            </h2>
            <p className="text-sm text-slate-500">
              Enregistrement et suivi des ventes.
            </p>
          </div>
        </div>

        {/* Le formulaire de vente sera ajouté ici. */}
      </div>
    </Container>
  );
}