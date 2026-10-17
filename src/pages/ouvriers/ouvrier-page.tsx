import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Container } from '@/components/common/container';

import {
  Ouvrier,
  OuvrierTable,
} from './ouvrier-table';


/* ============================================================
   PAGE GESTION DES OUVRIERS
============================================================ */

export function OuvrierPage() {

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const navigate =
    useNavigate();


  /* ==========================================================
     DONNÉES STATIQUES
  ========================================================== */

  const [ouvriers, setOuvriers] =
    useState<Ouvrier[]>([

      {
        id: 1,
        nom: 'Mohamed Ali',
        telephone: '22123456',
        cin: '12345678',
        specialite: 'Manutention',
        salaire: 50,
        statut: 'Actif',
        dateAjout: '15/09/2026',
      },

      {
        id: 2,
        nom: 'Youssef Saidi',
        telephone: '22234567',
        cin: '87654321',
        specialite: 'Pressage',
        salaire: 60,
        statut: 'Actif',
        dateAjout: '14/09/2026',
      },

      {
        id: 3,
        nom: 'Khaled Amri',
        telephone: '22345678',
        cin: '11223344',
        specialite: 'Entretien',
        salaire: 55,
        statut: 'En congé',
        dateAjout: '12/09/2026',
      },

      {
        id: 4,
        nom: 'Nour Reda',
        telephone: '23456789',
        cin: '44332211',
        specialite: 'Manutention',
        salaire: 50,
        statut: 'Actif',
        dateAjout: '10/09/2026',
      },

      {
        id: 5,
        nom: 'Salem Ben Khaled',
        telephone: '22567890',
        cin: '55667788',
        specialite: 'Pressage',
        salaire: 60,
        statut: 'Actif',
        dateAjout: '08/09/2026',
      },

      {
        id: 6,
        nom: 'Fathi Abdelli',
        telephone: '21678901',
        cin: '99887766',
        specialite: 'Contrôle qualité',
        salaire: 65,
        statut: 'Actif',
        dateAjout: '05/09/2026',
      },

      {
        id: 7,
        nom: 'Hichem Mansouri',
        telephone: '22789012',
        cin: '66778899',
        specialite: 'Entretien',
        salaire: 55,
        statut: 'Inactif',
        dateAjout: '02/09/2026',
      },

      {
        id: 8,
        nom: 'Adel Mrad',
        telephone: '23890123',
        cin: '33445566',
        specialite: 'Manutention',
        salaire: 50,
        statut: 'Actif',
        dateAjout: '01/09/2026',
      },

      {
        id: 9,
        nom: 'Sami Trabelsi',
        telephone: '22990123',
        cin: '77889900',
        specialite: 'Pressage',
        salaire: 60,
        statut: 'Actif',
        dateAjout: '29/08/2026',
      },

      {
        id: 10,
        nom: 'Ahmed Jaziri',
        telephone: '22112233',
        cin: '88990011',
        specialite: 'Entretien',
        salaire: 55,
        statut: 'Actif',
        dateAjout: '27/08/2026',
      },

      {
        id: 11,
        nom: 'Walid Ben Amor',
        telephone: '22334455',
        cin: '99001122',
        specialite: 'Manutention',
        salaire: 50,
        statut: 'En congé',
        dateAjout: '25/08/2026',
      },

      {
        id: 12,
        nom: 'Amine Gharbi',
        telephone: '22556677',
        cin: '10112233',
        specialite: 'Contrôle qualité',
        salaire: 65,
        statut: 'Actif',
        dateAjout: '22/08/2026',
      },

    ]);


  /* ==========================================================
     OUVRIER À SUPPRIMER
  ========================================================== */

  const [
    ouvrierToDelete,
    setOuvrierToDelete,
  ] =
    useState<Ouvrier | null>(
      null,
    );


  /* ==========================================================
     MODIFIER
  ========================================================== */

  const handleEdit = (
  ouvrier: Ouvrier,
) => {

  navigate(
    `/store-admin/workers/edit/${ouvrier.id}`,
  );

};


  /* ==========================================================
     OUVRIR SUPPRESSION
  ========================================================== */

  const handleDelete = (
    ouvrier: Ouvrier,
  ) => {

    setOuvrierToDelete(
      ouvrier,
    );
  };


  /* ==========================================================
     ANNULER SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {

    setOuvrierToDelete(
      null,
    );
  };


  /* ==========================================================
     CONFIRMER SUPPRESSION
  ========================================================== */

  const handleConfirmDelete = () => {

    if (!ouvrierToDelete) {
      return;
    }

    setOuvriers(
      (current) =>
        current.filter(
          (ouvrier) =>
            ouvrier.id !==
            ouvrierToDelete.id,
        ),
    );

    setOuvrierToDelete(
      null,
    );
  };


  /* ==========================================================
     AJOUTER
  ========================================================== */

  const handleAdd = () => {

    navigate(
      '/store-admin/workers/add',
    );
  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>

      {/* ======================================================
          HEADER
      ====================================================== */}

      
<Container>
  <div className="flex min-w-0 flex-col gap-4 py-4 sm:py-6 md:flex-row md:items-center md:justify-between">

    {/* TITRE */}
    <div className="min-w-0">
      

      {/* BREADCRUMB */}
     
<div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 font-sans text-sm tracking-wide text-[#64748b]">

  <span className="font-medium transition-colors hover:text-[#556B2F]">
    Paramétrage
  </span>

  <ChevronRight className="size-4 shrink-0 text-[#94a3b8]" />

  <span className="font-semibold text-[#334155]">
    Gestion des ouvriers
  </span>

</div>

    </div>

    {/* AJOUTER */}
    <Button
      onClick={handleAdd}
      className="w-full shrink-0 bg-[#556B2F] hover:bg-[#465A27] md:w-auto"
    >
      <Plus className="size-4 shrink-0" />
      Ajouter un ouvrier
    </Button>

  </div>
</Container>


      {/* ======================================================
          TABLEAU
      ====================================================== */}

      <Container>

        <OuvrierTable
          ouvriers={
            ouvriers
          }

          onEdit={
            handleEdit
          }

          onDelete={
            handleDelete
          }
        />

      </Container>


      {/* ======================================================
          MODALE SUPPRESSION
      ====================================================== */}

      {ouvrierToDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"

          onClick={
            handleCancelDelete
          }
        >

          {/* ==================================================
              MODALE
          ================================================== */}

          <div
            className="relative w-full max-w-[500px] rounded-xl bg-white p-8 shadow-2xl"

            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                FERMER
            ================================================= */}

            <button
              type="button"

              onClick={
                handleCancelDelete
              }

              className="absolute right-5 top-5 text-gray-500 transition hover:text-gray-800"

              aria-label="Fermer"
            >

              <X className="size-6" />

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
                TEXTE
            ================================================= */}

            <div className="mt-5 text-center">

              <h2 className="text-2xl font-bold text-gray-900">

                Supprimer l'ouvrier

              </h2>


              <p className="mt-3 text-base text-gray-500">

                Voulez-vous vraiment supprimer

              </p>


              <p className="mt-1 font-semibold text-gray-900">

                {ouvrierToDelete.nom} ?

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

                onClick={
                  handleCancelDelete
                }

                className="h-12 min-w-[125px]"
              >

                Annuler

              </Button>


              {/* SUPPRIMER */}

              <Button
                type="button"

                onClick={
                  handleConfirmDelete
                }

                className="h-12 min-w-[150px] bg-red-500 text-white hover:bg-red-600"
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