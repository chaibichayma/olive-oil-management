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
  Compte,
  CompteTable,
} from './compte-table';


/* ============================================================
   PAGE COMPTES
============================================================ */

export function ComptePage() {

  const navigate =
    useNavigate();


  /* ==========================================================
     DONNÉES
  ========================================================== */

  const [comptes, setComptes] =
    useState<Compte[]>([

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

  const [
    compteToDelete,
    setCompteToDelete,
  ] = useState<Compte | null>(null);


  /* ==========================================================
     MODIFIER
  ========================================================== */

 const handleEdit = (
  compte: Compte,
) => {

  navigate(
    `/store-admin/accounts/edit/${compte.compteId}`,
  );

};


  /* ==========================================================
     SUPPRIMER
  ========================================================== */

  const handleDelete = (
    compte: Compte,
  ) => {

    setCompteToDelete(
      compte,
    );

  };


  /* ==========================================================
     ANNULER SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {

    setCompteToDelete(
      null,
    );

  };


  /* ==========================================================
     CONFIRMER SUPPRESSION
  ========================================================== */

  const handleConfirmDelete = () => {

    if (!compteToDelete) {
      return;
    }

    setComptes(
      (current) =>
        current.filter(
          (compte) =>
            compte.compteId !==
            compteToDelete.compteId,
        ),
    );

    setCompteToDelete(
      null,
    );

  };


  /* ==========================================================
     AJOUTER
  ========================================================== */

  const handleAdd = () => {

    navigate(
      '/store-admin/accounts/add',
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
    {/* TITRE ET FIL D'ARIANE */}
    <div className="min-w-0">
      

   
<div className="mt-2 flex flex-wrap items-center gap-2 font-sans text-sm tracking-wide text-[#64748b]">

  <span className="font-medium transition-colors hover:text-[#556B2F]">
    Paramétrage
  </span>

  <ChevronRight className="size-4 text-[#94a3b8]" />

  <span className="font-semibold text-[#334155]">
    Comptes
  </span>

</div>
    </div>

    {/* AJOUTER */}
    <Button
      type="button"
      onClick={handleAdd}
      className="w-full shrink-0 bg-[#556B2F] hover:bg-[#465A27] md:w-auto"
    >
      <Plus className="size-4 shrink-0" />
      Ajouter un compte
    </Button>
  </div>
</Container>



      {/* ======================================================
          TABLEAU
      ====================================================== */}

      <Container>

        <CompteTable
          comptes={comptes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </Container>


      {/* ======================================================
          MODALE SUPPRESSION
      ====================================================== */}

      {compteToDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCancelDelete}
        >

          <div
            className="relative w-full max-w-[500px] rounded-xl bg-white p-8 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* FERMER */}

            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-5 top-5 text-gray-500 transition hover:text-gray-800"
              aria-label="Fermer"
            >

              <X className="size-6" />

            </button>


            {/* ICÔNE */}

            <div className="flex justify-center">

              <div className="flex size-20 items-center justify-center rounded-full bg-red-50">

                <Trash2 className="size-10 text-red-500" />

              </div>

            </div>


            {/* TEXTE */}

            <div className="mt-5 text-center">

              <h2 className="text-2xl font-bold text-gray-900">

                Supprimer le compte

              </h2>

              <p className="mt-3 text-base text-gray-500">

                Voulez-vous vraiment supprimer
                le compte

              </p>

              <p className="font-semibold text-gray-900">

                {compteToDelete.name}

                {' ?'}

              </p>

            </div>


            {/* BOUTONS */}

            <div className="mt-7 flex justify-center gap-4">

              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-12 min-w-[125px]"
              >

                Annuler

              </Button>


              <Button
                type="button"
                onClick={handleConfirmDelete}
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