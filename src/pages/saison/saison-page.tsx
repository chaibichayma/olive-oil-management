import { useState } from 'react';

import {
  ChevronRight,
  Plus,
  Trash2,
  X,
  Sprout,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { useNavigate } from 'react-router-dom';

import {
  Saison,
  SaisonTable,
} from './saison-table';

/* ============================================================
   PAGE SAISON
============================================================ */

export function SaisonPage() {
  /* ==========================================================
     DONNÉES STATIQUES
  ========================================================== */

  const [saisons, setSaisons] = useState<Saison[]>([
    {
      id: '1',
      beginDate: '2026-01-01',
      endDate: '2027-01-31',
      statusId: 1,
      year: 2026,
      priceKilo: 0.8,
      priceAchat: 10.0,
      priceVente: 12.0,
      nbreCaisses: 500,
    },

    {
      id: '2',
      beginDate: '2025-10-01',
      endDate: '2026-01-31',
      statusId: 2,
      year: 2025,
      priceKilo: 0.75,
      priceAchat: 9.5,
      priceVente: 11.5,
      nbreCaisses: 450,
    },

    {
      id: '3',
      beginDate: '2024-10-01',
      endDate: '2025-01-31',
      statusId: 2,
      year: 2024,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '4',
      beginDate: '2023-10-01',
      endDate: '2024-01-31',
      statusId: 2,
      year: 2023,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '5',
      beginDate: '2022-10-01',
      endDate: '2023-01-31',
      statusId: 2,
      year: 2022,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '6',
      beginDate: '2021-10-01',
      endDate: '2022-01-31',
      statusId: 2,
      year: 2021,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '7',
      beginDate: '2020-10-01',
      endDate: '2021-01-31',
      statusId: 2,
      year: 2020,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '8',
      beginDate: '2019-10-01',
      endDate: '2020-01-31',
      statusId: 2,
      year: 2019,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '9',
      beginDate: '2018-10-01',
      endDate: '2019-01-31',
      statusId: 2,
      year: 2018,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '10',
      beginDate: '2017-10-01',
      endDate: '2018-01-31',
      statusId: 2,
      year: 2017,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },

    {
      id: '11',
      beginDate: '2016-10-01',
      endDate: '2017-01-31',
      statusId: 2,
      year: 2016,
      priceKilo: 0.7,
      priceAchat: 9.0,
      priceVente: 11.0,
      nbreCaisses: 400,
    },
  ]);


const handleAdd = () => {
  navigate('/store-admin/saison/add');
};

  /* ==========================================================
     SAISON À SUPPRIMER
  ========================================================== */

  const [saisonToDelete, setSaisonToDelete] =
    useState<Saison | null>(null);

  /* ==========================================================
     MODIFIER
  ========================================================== */
const navigate = useNavigate();

const handleEdit = (saison: Saison) => {
  navigate(`/store-admin/saison/edit/${saison.id}`);
};
  /* ==========================================================
     SUPPRESSION
  ========================================================== */

  const handleDelete = (saison: Saison) => {
    setSaisonToDelete(saison);
  };

  /* ==========================================================
     ANNULER SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {
    setSaisonToDelete(null);
  };

  /* ==========================================================
     CONFIRMER SUPPRESSION
  ========================================================== */

  const handleConfirmDelete = () => {
    if (!saisonToDelete) {
      return;
    }

    setSaisons((current) =>
      current.filter(
        (item) => item.id !== saisonToDelete.id,
      ),
    );

    setSaisonToDelete(null);
  };


  /* ==========================================================
     AJOUTER
  ========================================================== */

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* ======================================================
          HEADER DE PAGE
      ====================================================== */}

      <Container>
        <div className="py-5 lg:py-6">
          {/* ==================================================
              BREADCRUMB
          ================================================== */}

          

<div className="mb-4 flex items-center gap-2 font-sans text-sm tracking-wide text-[#64748b]">

  <span className="font-medium transition-colors hover:text-[#556B2F]">
    Paramétrage
  </span>

  <ChevronRight className="size-4 text-[#94a3b8]" />

  <span className="font-semibold text-[#334155]">
    Saisons
  </span>

</div>


          {/* ==================================================
              TITRE + BOUTON
          ================================================== */}

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            {/* =================================================
                GAUCHE
            ================================================= */}

            <div className="flex items-center gap-4">
              {/* ICÔNE */}
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eef4e6]">
                <Sprout className="size-6 text-[#556B2F]" />
              </div>

              {/* TITRE */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
                  Saisons
                </h1>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  Gestion des campagnes et paramètres de
                  production
                </p>
              </div>
            </div>

            {/* =================================================
                BOUTON AJOUTER
            ================================================= */}

            <Button
              type="button"
              onClick={handleAdd}
              className="h-11 rounded-lg bg-[#556B2F] px-5 font-semibold text-white shadow-sm transition-all hover:bg-[#465A27] hover:shadow-md"
            >
              <Plus className="size-4" />

              Ajouter une saison
            </Button>
          </div>
        </div>
      </Container>

      {/* ======================================================
          TABLEAU
      ====================================================== */}

      <Container>
        <SaisonTable
          saisons={saisons}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>

      {/* ======================================================
          MODALE SUPPRESSION
      ====================================================== */}

      {saisonToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            className="relative w-full max-w-[500px] rounded-xl bg-white p-8 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                FERMER
            ================================================= */}

            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            {/* =================================================
                ICÔNE
            ================================================= */}

            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="size-10 text-red-500" />
              </div>
            </div>

            {/* =================================================
                TITRE
            ================================================= */}

            <div className="mt-5 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Supprimer la saison
              </h2>

              <p className="mt-3 text-base text-gray-500">
                Voulez-vous vraiment supprimer la
                saison
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {saisonToDelete.year} ?
              </p>
            </div>

            {/* =================================================
                BOUTONS
            ================================================= */}

            <div className="mt-7 flex justify-center gap-4">
              {/* ANNULER */}

              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-12 min-w-[125px] rounded-lg"
              >
                Annuler
              </Button>

              {/* SUPPRIMER */}

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-12 min-w-[150px] rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-5" />

                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}