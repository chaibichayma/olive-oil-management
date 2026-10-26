import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import {
  BonReceptionPage
} from '@/pages/bon-reception';
import BonReceptionFormPage from '@/pages/bon-reception/BonReceptionFormPage';
import { AjouterCiternePage, CiternePage } from '@/pages/citernes';
import { ComptePage, AjouterComptePage} from '@/pages/comptes';
import { AjouterOuvrierPage} from '@/pages/ouvriers';
import { OuvrierPage } from '@/pages/ouvriers/ouvrier-page';
import { WorkerPlanningsPage } from '@/pages/plannings-ouvriers';
import { AjouterSaisonPage, SaisonPage } from '@/pages/saison';

import { DashboardPage } from '@/pages/store-admin';
import { TraitementBasesPage } from '@/pages/traitement-bases/traitement-bases-page';
import { UtilisateurPage, AjouterUtilisateurPage} from '@/pages/utilisateurs';
import { VenteHuilePage } from '@/pages/vente-huile/vente-huile-page';

import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>

          <Route
            path="/"
            element={
              <Navigate
                to="/store-admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="/store-admin/dashboard"
            element={<DashboardPage />}
          />

          <Route
  path="/store-admin/saison"
  element={<SaisonPage />}
/>

<Route
  path="/store-admin/saison/ajouter"
  element={<AjouterSaisonPage />}
/>

<Route
  path="/store-admin/tanks"
  element={<CiternePage />}
/>
<Route
  path="/store-admin/tanks/ajouter"
  element={<AjouterCiternePage />}
/>
<Route
  path="/store-admin/users"
  element={<UtilisateurPage />}
/>
<Route
  path="/store-admin/users/ajouter"
  element={<AjouterUtilisateurPage />}
/>

<Route
  path="/store-admin/accounts"
  element={<ComptePage />}
/>
<Route
  path="/store-admin/accounts/form"
  element={<AjouterComptePage />}
/>

<Route
            path="/store-admin/workers"
            element={
              <OuvrierPage />
            }
          />

          <Route
  path="/store-admin/workers/form"
  element={<AjouterOuvrierPage />}
/>
          <Route
  path="/store-admin/worker-plannings"
  element={<WorkerPlanningsPage />}
/>
<Route
  path="/store-admin/reception-vouchers"
  element={<BonReceptionPage />}
/>

<Route
  path="/store-admin/base-processing"
  element={<TraitementBasesPage />}
/>

<Route
  path="/store-admin/reception-vouchers/add"
  element={<BonReceptionFormPage mode="add" />}
/>

<Route
  path="/store-admin/reception-vouchers/edit/:id"
  element={<BonReceptionFormPage mode="edit" />}
/>

        </Route>
      </Route>

      <Route
        path="auth/*"
        element={<AuthRouting />}
      />

      <Route
        path="error/*"
        element={<ErrorRouting />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/error/404"
            replace
          />
        }
      />
      <Route
  path="/store-admin/oil-sales"
  element={<VenteHuilePage />}
/>
    </Routes>
  );
}
