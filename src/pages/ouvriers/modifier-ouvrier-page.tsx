import { useEffect, useState } from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  IdCard,
  Phone,
  Save,
  UserRound,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';


/* ============================================================
   TYPE OUVRIER
============================================================ */

interface Ouvrier {
  id: number;

  nom: string;

  telephone: string;

  cin: string;

  specialite: string;

  salaire: number;

  statut: string;

  dateAjout: string;
}


/* ============================================================
   DONNÉES STATIQUES
============================================================ */

const defaultOuvriers: Ouvrier[] = [

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

];


/* ============================================================
   PAGE MODIFIER OUVRIER
============================================================ */

export function ModifierOuvrierPage() {

  const navigate =
    useNavigate();

  const { id } =
    useParams<{
      id: string;
    }>();


  /* ==========================================================
     FORMULAIRE
  ========================================================== */

  const [
    formData,
    setFormData,
  ] = useState({

    nom: '',

    telephone: '',

    cin: '',

    specialite: 'Manutention',

    salaire: '',

    statut: 'Actif',

    dateAjout: '',

  });


  /* ==========================================================
     MODALE SUCCÈS
  ========================================================== */

  const [
    showSuccessModal,
    setShowSuccessModal,
  ] = useState(false);


  /* ==========================================================
     CHARGER OUVRIER
  ========================================================== */

  useEffect(() => {

    if (!id) {
      return;
    }

    const ouvrierId =
      Number(id);

    const ouvrier =
      defaultOuvriers.find(
        (item) =>
          item.id === ouvrierId,
      );


    if (!ouvrier) {

      navigate(
        '/store-admin/workers',
      );

      return;
    }


    setFormData({

      nom:
        ouvrier.nom,

      telephone:
        ouvrier.telephone,

      cin:
        ouvrier.cin,

      specialite:
        ouvrier.specialite,

      salaire:
        ouvrier.salaire.toString(),

      statut:
        ouvrier.statut,

      dateAjout:
        convertDateToInput(
          ouvrier.dateAjout,
        ),

    });

  }, [
    id,
    navigate,
  ]);


  /* ==========================================================
     CONVERSION DATE
     DD/MM/YYYY → YYYY-MM-DD
  ========================================================== */

  const convertDateToInput = (
    date: string,
  ) => {

    const parts =
      date.split('/');

    if (
      parts.length !== 3
    ) {

      return '';

    }


    const [
      day,
      month,
      year,
    ] = parts;


    return `${year}-${month}-${day}`;

  };


  /* ==========================================================
     CHANGEMENT INPUT
  ========================================================== */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >,
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (current) => ({

        ...current,

        [name]:
          value,

      }),
    );

  };


  /* ==========================================================
     ENREGISTRER
  ========================================================== */

  const handleSubmit = (
    event: React.FormEvent,
  ) => {

    event.preventDefault();


    const modifiedOuvrier: Ouvrier = {

      id:
        Number(id),

      nom:
        formData.nom,

      telephone:
        formData.telephone,

      cin:
        formData.cin,

      specialite:
        formData.specialite,

      salaire:
        Number(
          formData.salaire || 0,
        ),

      statut:
        formData.statut,

      dateAjout:
        formatDateForDisplay(
          formData.dateAjout,
        ),

    };


    console.log(
      'Ouvrier modifié :',
      modifiedOuvrier,
    );


    setShowSuccessModal(
      true,
    );

  };


  /* ==========================================================
     YYYY-MM-DD → DD/MM/YYYY
  ========================================================== */

  const formatDateForDisplay = (
    date: string,
  ) => {

    if (!date) {
      return '';
    }


    const parts =
      date.split('-');


    if (
      parts.length !== 3
    ) {

      return date;

    }


    const [
      year,
      month,
      day,
    ] = parts;


    return `${day}/${month}/${year}`;

  };


  /* ==========================================================
     ANNULER
  ========================================================== */

  const handleCancel = () => {

    navigate(
      '/store-admin/workers',
    );

  };


  /* ==========================================================
     OK SUCCÈS
  ========================================================== */

  const handleSuccessOk = () => {

    navigate(
      '/store-admin/workers',
    );

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">


      {/* ======================================================
          RETOUR
      ====================================================== */}

      <button
        type="button"

        onClick={
          handleCancel
        }

        className="mb-5 flex items-center gap-2 text-sm font-medium text-[#556B2F] transition hover:text-[#3f5124]"
      >

        <ArrowLeft className="size-4" />

        Retour aux ouvriers

      </button>


      {/* ======================================================
          CARD FORMULAIRE
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-border px-6 py-5">

          <h1 className="text-xl font-bold text-foreground">

            Modifier l'ouvrier

          </h1>

          <p className="mt-1 text-sm text-muted-foreground">

            Modifiez les informations de l'ouvrier
            puis enregistrez les changements.

          </p>

        </div>


        {/* ====================================================
            FORMULAIRE
        ==================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-6 md:grid-cols-2">


            {/* ==================================================
                NOM
            ================================================== */}

            <div>

              <label
                htmlFor="nom"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Nom complet

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={
                    formData.nom
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Nom et prénom"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                TÉLÉPHONE
            ================================================== */}

            <div>

              <label
                htmlFor="telephone"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Téléphone

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={
                    formData.telephone
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Ex : 22123456"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                CIN
            ================================================== */}

            <div>

              <label
                htmlFor="cin"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                CIN

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="cin"
                  name="cin"
                  type="text"
                  value={
                    formData.cin
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Ex : 12345678"
                  maxLength={8}
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                SPÉCIALITÉ
            ================================================== */}

            <div>

              <label
                htmlFor="specialite"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Spécialité

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <select
                  id="specialite"
                  name="specialite"
                  value={
                    formData.specialite
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="h-11 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                >

                  <option value="Manutention">
                    Manutention
                  </option>

                  <option value="Pressage">
                    Pressage
                  </option>

                  <option value="Entretien">
                    Entretien
                  </option>

                  <option value="Contrôle qualité">
                    Contrôle qualité
                  </option>

                </select>

              </div>

            </div>


            {/* ==================================================
                SALAIRE
            ================================================== */}

            <div>

              <label
                htmlFor="salaire"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Salaire

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <input
                  id="salaire"
                  name="salaire"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.salaire
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Ex : 50"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                  DT

                </span>

              </div>

            </div>


            {/* ==================================================
                STATUT
            ================================================== */}

            <div>

              <label
                htmlFor="statut"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Statut

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <select
                id="statut"
                name="statut"
                value={
                  formData.statut
                }
                onChange={
                  handleChange
                }
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
              >

                <option value="Actif">
                  Actif
                </option>

                <option value="En congé">
                  En congé
                </option>

                <option value="Inactif">
                  Inactif
                </option>

              </select>

            </div>


            {/* ==================================================
                DATE AJOUT
            ================================================== */}

            <div>

              <label
                htmlFor="dateAjout"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Date d'ajout

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="dateAjout"
                  name="dateAjout"
                  type="date"
                  value={
                    formData.dateAjout
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>

          </div>


          {/* ====================================================
              FOOTER
          ==================================================== */}

          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">

            <Button
              type="button"
              variant="outline"
              onClick={
                handleCancel
              }
              className="h-11 min-w-[110px]"
            >

              <X className="size-4" />

              Annuler

            </Button>


            <Button
              type="submit"
              className="h-11 min-w-[145px] bg-[#556B2F] hover:bg-[#465A27]"
            >

              <Save className="size-4" />

              Enregistrer

            </Button>

          </div>

        </form>

      </div>


      {/* ======================================================
          MODALE SUCCÈS
      ====================================================== */}

      {showSuccessModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-[380px] rounded-xl bg-white p-7 text-center shadow-2xl">


            {/* ==================================================
                ICÔNE
            ================================================== */}

            <div className="flex justify-center">

              <div className="flex size-16 items-center justify-center rounded-full bg-[#eef4e6]">

                <Check className="size-9 text-[#556B2F]" />

              </div>

            </div>


            {/* ==================================================
                TEXTE
            ================================================== */}

            <h2 className="mt-4 text-xl font-bold text-gray-900">

              Ouvrier modifié avec succès

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              Les informations de l'ouvrier ont été
              enregistrées.

            </p>


            {/* ==================================================
                OK
            ================================================== */}

            <Button
              type="button"
              onClick={
                handleSuccessOk
              }
              className="mt-6 h-11 w-full bg-[#556B2F] hover:bg-[#465A27]"
            >

              OK

            </Button>

          </div>

        </div>

      )}

    </div>
  );
}