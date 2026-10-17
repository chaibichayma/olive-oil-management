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
  Utilisateur,
  UtilisateurTable,
} from './utilisateur-table';


/* ============================================================
   PAGE UTILISATEURS
============================================================ */

export function UtilisateurPage() {

  const navigate =
    useNavigate();


  /* ==========================================================
     DONNÉES
  ========================================================== */

  const [utilisateurs, setUtilisateurs] =
    useState<Utilisateur[]>([

      {
        id: 1,
        displayName: 'Ayah Ben Ali',
        userName: 'ayah',
        mail: 'ayah@example.com',
        password: 'demo123',
        userCode: 'U001',
        isActive: true,
      },

      {
        id: 2,
        displayName: 'Mohamed',
        userName: 'mohamed',
        mail: 'mohamed@example.com',
        password: 'demo123',
        userCode: 'U002',
        isActive: true,
      },

      {
        id: 3,
        displayName: 'Salma',
        userName: 'salma',
        mail: 'salma@example.com',
        password: 'demo123',
        userCode: 'U003',
        isActive: false,
      },

      {
        id: 4,
        displayName: 'Youssef',
        userName: 'youssef',
        mail: 'youssef@example.com',
        password: 'demo123',
        userCode: 'U004',
        isActive: true,
      },

      {
        id: 5,
        displayName: 'Amine',
        userName: 'amine',
        mail: 'amine@example.com',
        password: 'demo123',
        userCode: 'U005',
        isActive: true,
      },

      {
        id: 6,
        displayName: 'Sarra',
        userName: 'sarra',
        mail: 'sarra@example.com',
        password: 'demo123',
        userCode: 'U006',
        isActive: false,
      },

      {
        id: 7,
        displayName: 'Houssem',
        userName: 'houssem',
        mail: 'houssem@example.com',
        password: 'demo123',
        userCode: 'U007',
        isActive: true,
      },

      {
        id: 8,
        displayName: 'Mariem',
        userName: 'mariem',
        mail: 'mariem@example.com',
        password: 'demo123',
        userCode: 'U008',
        isActive: true,
      },

      {
        id: 9,
        displayName: 'Ahmed',
        userName: 'ahmed',
        mail: 'ahmed@example.com',
        password: 'demo123',
        userCode: 'U009',
        isActive: true,
      },

      {
        id: 10,
        displayName: 'Ines',
        userName: 'ines',
        mail: 'ines@example.com',
        password: 'demo123',
        userCode: 'U010',
        isActive: false,
      },

      {
        id: 11,
        displayName: 'Omar',
        userName: 'omar',
        mail: 'omar@example.com',
        password: 'demo123',
        userCode: 'U011',
        isActive: true,
      },

      {
        id: 12,
        displayName: 'Nour',
        userName: 'nour',
        mail: 'nour@example.com',
        password: 'demo123',
        userCode: 'U012',
        isActive: true,
      },

    ]);


  /* ==========================================================
     UTILISATEUR À SUPPRIMER
  ========================================================== */

  const [
    utilisateurToDelete,
    setUtilisateurToDelete,
  ] = useState<Utilisateur | null>(
    null,
  );


  /* ==========================================================
     MODIFIER
  ========================================================== */

const handleEdit = (utilisateur: Utilisateur) => {
  navigate(`/store-admin/users/edit/${utilisateur.id}`);
};


  /* ==========================================================
     OUVRIR MODALE SUPPRESSION
  ========================================================== */

  const handleDelete = (
    utilisateur: Utilisateur,
  ) => {

    setUtilisateurToDelete(
      utilisateur,
    );

  };


  /* ==========================================================
     ANNULER SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {

    setUtilisateurToDelete(
      null,
    );

  };


  /* ==========================================================
     CONFIRMER SUPPRESSION
  ========================================================== */

  const handleConfirmDelete = () => {

    if (!utilisateurToDelete) {
      return;
    }

    setUtilisateurs(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            utilisateurToDelete.id,
        ),
    );

    setUtilisateurToDelete(
      null,
    );

  };


  /* ==========================================================
     AJOUTER
  ========================================================== */

  const handleAdd = () => {

    navigate(
      '/store-admin/users/add',
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
  <div className="flex flex-col gap-4 py-4 sm:py-6 md:flex-row md:items-center md:justify-between">

<div className="mt-2 flex items-center gap-2 font-sans text-sm tracking-wide text-[#64748b]">

  <span className="font-medium transition-colors hover:text-[#556B2F]">
    Paramétrage
  </span>

  <ChevronRight className="size-4 text-[#94a3b8]" />

  <span className="font-semibold text-[#334155]">
    Utilisateurs
  </span>

</div>

    {/* TITRE ET FIL D'ARIANE */}
    

    {/* AJOUTER */}
    <Button
      type="button"
      onClick={handleAdd}
      className="w-full shrink-0 bg-[#556B2F] hover:bg-[#465A27] md:w-auto"
    >
      <Plus className="size-4 shrink-0" />
      Ajouter un utilisateur
    </Button>
  </div>
</Container>



      {/* ======================================================
          TABLEAU
      ====================================================== */}

      <Container>

        <UtilisateurTable
          utilisateurs={
            utilisateurs
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

      {utilisateurToDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={
            handleCancelDelete
          }
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

                Supprimer l'utilisateur

              </h2>


              <p className="mt-3 text-base text-gray-500">

                Voulez-vous vraiment supprimer
                l'utilisateur

              </p>


              <p className="font-semibold text-gray-900">

                {
                  utilisateurToDelete.displayName
                }

                {' ?'}

              </p>

            </div>


            {/* =================================================
                BOUTONS
            ================================================= */}

            <div className="mt-7 flex justify-center gap-4">

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