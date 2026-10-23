
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  ChevronRight,
  BriefcaseBusiness,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

import {
  Compte,
  CompteTable,
} from './compte-table';

/* ============================================================
   PAGE COMPTES
============================================================ */

export function ComptePage() {
  const navigate = useNavigate();

  /* ==========================================================
     DONNÉES
  ========================================================== */

  const [comptes, setComptes] = useState<Compte[]>([
    {
      compteId: 1,
      name: 'Ahmed Ben Ali',
      adresse: 'Sousse',
      mobile: '12345678',
      mail: 'ahmed@gmail.com',
      statusId: 1,
      priceConv: 0,
      isBaseCompte: true,
      baseCompteId: null,
    },
    {
      compteId: 2,
      name: 'Client 1',
      adresse: 'Monastir',
      mobile: '98765432',
      mail: 'client1@gmail.com',
      statusId: 1,
      priceConv: 1.25,
      isBaseCompte: false,
      baseCompteId: 1,
    },
    {
      compteId: 3,
      name: 'Fournisseur 1',
      adresse: 'Sfax',
      mobile: '55667788',
      mail: 'fournisseur@gmail.com',
      statusId: 2,
      priceConv: 0.8,
      isBaseCompte: false,
      baseCompteId: 1,
    },
    {
      compteId: 4,
      name: 'Coopérative',
      adresse: 'Mahdia',
      mobile: '22334455',
      mail: 'coop@gmail.com',
      statusId: 1,
      priceConv: 0,
      isBaseCompte: true,
      baseCompteId: null,
    },
    {
      compteId: 5,
      name: 'Client 2',
      adresse: 'Tunis',
      mobile: '22113344',
      mail: 'client2@gmail.com',
      statusId: 1,
      priceConv: 1.1,
      isBaseCompte: false,
      baseCompteId: 4,
    },
    {
      compteId: 6,
      name: 'Fournisseur 2',
      adresse: 'Gabès',
      mobile: '55664433',
      mail: 'fournisseur2@gmail.com',
      statusId: 1,
      priceConv: 0.9,
      isBaseCompte: false,
      baseCompteId: 4,
    },
    {
      compteId: 7,
      name: 'Client 3',
      adresse: 'Nabeul',
      mobile: '99887766',
      mail: 'client3@gmail.com',
      statusId: 2,
      priceConv: 1.15,
      isBaseCompte: false,
      baseCompteId: 4,
    },
    {
      compteId: 8,
      name: 'Coopérative 2',
      adresse: 'Kairouan',
      mobile: '44556677',
      mail: 'coop2@gmail.com',
      statusId: 1,
      priceConv: 0,
      isBaseCompte: true,
      baseCompteId: null,
    },
    {
      compteId: 9,
      name: 'Client 4',
      adresse: 'Bizerte',
      mobile: '77889900',
      mail: 'client4@gmail.com',
      statusId: 1,
      priceConv: 0.95,
      isBaseCompte: false,
      baseCompteId: 8,
    },
    {
      compteId: 10,
      name: 'Fournisseur 3',
      adresse: 'Béja',
      mobile: '11223344',
      mail: 'fournisseur3@gmail.com',
      statusId: 2,
      priceConv: 0.75,
      isBaseCompte: false,
      baseCompteId: 8,
    },
    {
      compteId: 11,
      name: 'Client 5',
      adresse: 'Zaghouan',
      mobile: '33445566',
      mail: 'client5@gmail.com',
      statusId: 1,
      priceConv: 1.2,
      isBaseCompte: false,
      baseCompteId: 8,
    },
    {
      compteId: 12,
      name: 'Coopérative 3',
      adresse: 'Le Kef',
      mobile: '66778899',
      mail: 'coop3@gmail.com',
      statusId: 1,
      priceConv: 0,
      isBaseCompte: true,
      baseCompteId: null,
    },
  ]);

  /* ==========================================================
     COMPTE À SUPPRIMER
  ========================================================== */

  const [compteToDelete, setCompteToDelete] =
    useState<Compte | null>(null);

  /* ==========================================================
     MODIFIER
  ========================================================== */

  const handleEdit = (compte: Compte) => {
    navigate(`/store-admin/accounts/edit/${compte.compteId}`);
  };

  /* ==========================================================
     SUPPRIMER
  ========================================================== */

  const handleDelete = (compte: Compte) => {
    setCompteToDelete(compte);
  };

  /* ==========================================================
     ANNULER SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {
    setCompteToDelete(null);
  };

  /* ==========================================================
     CONFIRMER SUPPRESSION
  ========================================================== */

  const handleConfirmDelete = () => {
    if (!compteToDelete) return;

    setComptes((current) =>
      current.filter(
        (compte) =>
          compte.compteId !== compteToDelete.compteId,
      ),
    );

    setCompteToDelete(null);
  };

  /* ==========================================================
     AJOUTER
  ========================================================== */

  const handleAdd = () => {
    navigate('/store-admin/accounts/add');
  };

  /* ==========================================================
     RENDU
  ========================================================== */

  return (
    <>
      {/* ======================================================
          HEADER DE LA PAGE
      ====================================================== */}

      <Container>
        <header className="w-full py-5 sm:py-6">

          {/* TITRE, DESCRIPTION ET BOUTON */}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            {/* ICÔNE ET TITRE */}

            <div className="flex min-w-0 items-center gap-4">

              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e1e9d7] bg-[#f0f5e8]">
                <BriefcaseBusiness className="size-6 text-[#556B2F]" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-[#172033] sm:text-2xl">
                  Gestion des comptes
                </h1>

                <p className="mt-1 text-sm leading-5 text-slate-500 sm:text-[15px]">
                  Centralisez les comptes, les coordonnées et les paramètres de conversion.
                </p>
              </div>

            </div>

            {/* BOUTON AJOUTER */}

            <Button
              type="button"
              onClick={handleAdd}
              className="h-10 w-full shrink-0 gap-2 rounded-lg bg-[#556B2F] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#465A27] sm:w-auto"
            >
              <Plus className="size-4 shrink-0" />
              Ajouter un compte
            </Button>

          </div>

          {/* SÉPARATION */}

          <div className="mt-6 border-b border-[#e8ebdf]" />

        </header>
      </Container>

      {/* ======================================================
          TABLEAU DES COMPTES
      ====================================================== */}

      <Container>
        <CompteTable
          comptes={comptes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>

      {/* ======================================================
          MODALE DE SUPPRESSION
      ====================================================== */}

      {compteToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >

            {/* FERMER */}

            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            {/* ICÔNE */}

            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="size-7 text-red-500" />
              </div>
            </div>

            {/* MESSAGE */}

            <div className="mt-5 text-center">
              <h2
                id="delete-account-title"
                className="text-xl font-bold tracking-tight text-slate-900"
              >
                Supprimer le compte ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Voulez-vous vraiment supprimer le compte suivant ?
              </p>

              <p className="mt-2 break-words font-semibold text-slate-800">
                {compteToDelete.name}
              </p>
            </div>

            {/* BOUTONS */}

            <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-11 min-w-[120px] rounded-lg border-slate-200"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-11 min-w-[145px] rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-4" />
                Supprimer
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
