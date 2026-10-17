import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import {
  AjouterBonReceptionPage,
  BonReceptionPage,
  ModifierBonReceptionPage,
} from '@/pages/bon-reception';
import { CiternePage, AjouterCiternePage, ModifierCiternePage } from '@/pages/citernes';
import { ComptePage, AjouterComptePage, ModifierComptePage } from '@/pages/comptes';
import { AjouterOuvrierPage, ModifierOuvrierPage } from '@/pages/ouvriers';
import { OuvrierPage } from '@/pages/ouvriers/ouvrier-page';
import { WorkerPlanningsPage } from '@/pages/plannings-ouvriers';
import { SaisonPage, AjouterSaisonPage, ModifierSaisonPage } from '@/pages/saison';

import { DashboardPage } from '@/pages/store-admin';
import { UtilisateurPage, AjouterUtilisateurPage, ModifierUtilisateurPage } from '@/pages/utilisateurs';

import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      {/* ================================
          Routes protégées
      ================================= */}
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>

          {/* ================================
              Tableau de bord
          ================================= */}
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

          {/* ================================
              Paramétrage
          ================================= */}

          {/* Saison */}
          <Route
  path="/store-admin/saison"
  element={<SaisonPage />}
/>
<Route
  path="/store-admin/saison/add"
  element={<AjouterSaisonPage />}
/>
<Route
  path="/store-admin/saison/edit/:id"
  element={<ModifierSaisonPage />}
/>

<Route
  path="/store-admin/tanks"
  element={<CiternePage />}
/>
<Route
  path="/store-admin/tanks/add"
  element={<AjouterCiternePage />}
/>
<Route
  path="/store-admin/tanks/edit/:id"
  element={<ModifierCiternePage />}
/>
<Route
  path="/store-admin/users"
  element={<UtilisateurPage />}
/>
<Route
  path="/store-admin/users/add"
  element={<AjouterUtilisateurPage />}
/>
<Route
  path="/store-admin/users/edit/:id"
  element={<ModifierUtilisateurPage />}
/>
<Route
  path="/store-admin/accounts"
  element={<ComptePage />}
/>
<Route
  path="/store-admin/accounts/add"
  element={<AjouterComptePage />}
/>
<Route
  path="/store-admin/accounts/edit/:id"
  element={<ModifierComptePage />}
/>
<Route
            path="/store-admin/workers"
            element={
              <OuvrierPage />
            }
          />

          <Route
  path="/store-admin/workers/add"
  element={<AjouterOuvrierPage />}
/>
<Route
  path="/store-admin/workers/edit/:id"
  element={<ModifierOuvrierPage />}
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
  path="/store-admin/reception-vouchers/add"
  element={<AjouterBonReceptionPage />}
/>
<Route
  path="/store-admin/reception-vouchers/edit/:id"
  element={<ModifierBonReceptionPage />}
/>


          {/* Les prochaines pages seront ajoutées ici */}

          {/*
          <Route
            path="/store-admin/citernes"
            element={<CiternesPage />}
          />

          <Route
            path="/store-admin/utilisateurs"
            element={<UtilisateursPage />}
          />

          <Route
            path="/store-admin/comptes"
            element={<ComptesPage />}
          />
          */}

        </Route>
      </Route>

      {/* ================================
          Authentification
      ================================= */}
      <Route
        path="auth/*"
        element={<AuthRouting />}
      />

      {/* ================================
          Pages d'erreur
      ================================= */}
      <Route
        path="error/*"
        element={<ErrorRouting />}
      />

      {/* ================================
          Route inconnue
      ================================= */}
      <Route
        path="*"
        element={
          <Navigate
            to="/error/404"
            replace
          />
        }
      />
    </Routes>
  );
}
