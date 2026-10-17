import { useEffect, useState } from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  Check,
  MapPin,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';


/* ============================================================
   TYPE COMPTE
============================================================ */

interface Compte {
  compteId: number;
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: number;
  priceConv: number;
  isBaseCompte: boolean;
  baseCompteId: number | null;
}


/* ============================================================
   DONNÉES STATIQUES
============================================================ */

const defaultComptes: Compte[] = [

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

];


/* ============================================================
   PAGE MODIFIER COMPTE
============================================================ */

export function ModifierComptePage() {

  const navigate =
    useNavigate();

  const { id } =
    useParams<{
      id: string;
    }>();


  /* ==========================================================
     ÉTAT DU FORMULAIRE
  ========================================================== */

  const [
    formData,
    setFormData,
  ] = useState({

    name: '',

    adresse: '',

    mobile: '',

    mail: '',

    statusId: '1',

    priceConv: '',

    isBaseCompte: false,

    baseCompteId: '',

  });


  /* ==========================================================
     MODALE SUCCÈS
  ========================================================== */

  const [
    showSuccessModal,
    setShowSuccessModal,
  ] = useState(false);


  /* ==========================================================
     CHARGER LE COMPTE
  ========================================================== */

  useEffect(() => {

    if (!id) {
      return;
    }

    const compteId =
      Number(id);

    const compte =
      defaultComptes.find(
        (item) =>
          item.compteId === compteId,
      );

    if (!compte) {
      navigate(
        '/store-admin/accounts',
      );

      return;
    }


    setFormData({

      name:
        compte.name,

      adresse:
        compte.adresse,

      mobile:
        compte.mobile,

      mail:
        compte.mail,

      statusId:
        compte.statusId.toString(),

      priceConv:
        compte.priceConv.toString(),

      isBaseCompte:
        compte.isBaseCompte,

      baseCompteId:
        compte.baseCompteId !== null
          ? compte.baseCompteId.toString()
          : '',

    });

  }, [
    id,
    navigate,
  ]);


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
     CHANGEMENT COMPTE DE BASE
  ========================================================== */

  const handleBaseCompteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    const checked =
      event.target.checked;


    setFormData(
      (current) => ({

        ...current,

        isBaseCompte:
          checked,

        baseCompteId:
          checked
            ? ''
            : current.baseCompteId,

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


    const modifiedCompte: Compte = {

      compteId:
        Number(id),

      name:
        formData.name,

      adresse:
        formData.adresse,

      mobile:
        formData.mobile,

      mail:
        formData.mail,

      statusId:
        Number(
          formData.statusId,
        ),

      priceConv:
        Number(
          formData.priceConv || 0,
        ),

      isBaseCompte:
        formData.isBaseCompte,

      baseCompteId:
        formData.isBaseCompte ||
        !formData.baseCompteId
          ? null
          : Number(
              formData.baseCompteId,
            ),

    };


    console.log(
      'Compte modifié :',
      modifiedCompte,
    );


    setShowSuccessModal(
      true,
    );

  };


  /* ==========================================================
     ANNULER
  ========================================================== */

  const handleCancel = () => {

    navigate(
      '/store-admin/accounts',
    );

  };


  /* ==========================================================
     OK SUCCÈS
  ========================================================== */

  const handleSuccessOk = () => {

    navigate(
      '/store-admin/accounts',
    );

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">


      {/* ======================================================
          BOUTON RETOUR
      ====================================================== */}

      <button
        type="button"
        onClick={handleCancel}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-[#556B2F] transition hover:text-[#3f5124]"
      >

        <ArrowLeft className="size-4" />

        Retour aux comptes

      </button>


      {/* ======================================================
          FORMULAIRE
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-border px-6 py-5">

          <h1 className="text-xl font-bold text-foreground">

            Modifier le compte

          </h1>

          <p className="mt-1 text-sm text-muted-foreground">

            Modifiez les informations du compte puis
            enregistrez les changements.

          </p>

        </div>


        {/* ====================================================
            BODY
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-6 md:grid-cols-2">


            {/* ==================================================
                NOM
            ================================================== */}

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Nom du compte
                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nom du compte"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                ADRESSE
            ================================================== */}

            <div>

              <label
                htmlFor="adresse"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Adresse
                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  placeholder="Adresse"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                MOBILE
            ================================================== */}

            <div>

              <label
                htmlFor="mobile"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Numéro mobile
                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="Ex : 22123456"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>

              <label
                htmlFor="mail"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Adresse e-mail

              </label>

              <div className="relative">

                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="mail"
                  name="mail"
                  type="email"
                  value={formData.mail}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

              </div>

            </div>


            {/* ==================================================
                STATUT
            ================================================== */}

            <div>

              <label
                htmlFor="statusId"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Statut

                <span className="text-red-500">
                  {' *'}
                </span>

              </label>

              <div className="relative">

                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                <select
                  id="statusId"
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleChange}
                  required
                  className="h-11 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                >

                  <option value="1">
                    Actif
                  </option>

                  <option value="2">
                    Inactif
                  </option>

                </select>

              </div>

            </div>


            {/* ==================================================
                PRIX CONVERSION
            ================================================== */}

            <div>

              <label
                htmlFor="priceConv"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Prix de conversion

              </label>

              <div className="relative">

                <input
                  id="priceConv"
                  name="priceConv"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceConv}
                  onChange={handleChange}
                  placeholder="Ex : 1.25"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                  DT

                </span>

              </div>

            </div>


            {/* ==================================================
                COMPTE DE BASE
            ================================================== */}

            <div className="flex items-end">

              <label className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-md border border-input bg-background px-4">

                <input
                  type="checkbox"
                  checked={
                    formData.isBaseCompte
                  }
                  onChange={
                    handleBaseCompteChange
                  }
                  className="size-4 accent-[#556B2F]"
                />

                <span className="text-sm font-medium text-foreground">

                  Ce compte est un compte de base

                </span>

              </label>

            </div>


            {/* ==================================================
                COMPTE DE BASE ID
            ================================================== */}

            <div>

              <label
                htmlFor="baseCompteId"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                ID du compte de base

              </label>

              <input
                id="baseCompteId"
                name="baseCompteId"
                type="number"
                min="1"
                value={formData.baseCompteId}
                onChange={handleChange}
                disabled={
                  formData.isBaseCompte
                }
                placeholder="Ex : 1"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-muted focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
              />

            </div>

          </div>


          {/* ====================================================
              FOOTER
          ==================================================== */}

          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >

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

              Compte modifié avec succès

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              Les informations du compte ont été
              enregistrées.

            </p>


            {/* ==================================================
                BOUTON OK
            ================================================== */}

            <Button
              type="button"
              onClick={handleSuccessOk}
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