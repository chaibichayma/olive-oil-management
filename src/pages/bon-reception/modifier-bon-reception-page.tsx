import { useEffect, useState } from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  Check,
  ClipboardList,
  Droplets,
  FileText,
  Hash,
  Save,
  UserRound,
  Phone,
  CalendarDays,
  Banknote,
  Package,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';


/* ============================================================
   TYPE BON DE RÉCEPTION
============================================================ */

interface BonReception {

  reference: string;

  id: number;

  compteId: number;

  name: string;

  mobile: string;

  quantityOil: number;

  quantityOlive: number;

  priceKg: number;

  price: number;

  payement: number;

  acompte: number;

  statusId: string;

  statusLib: string;

  caisse: string;

  natureId: number;

  priceOil: number;

  observation: string;

  typeHuile: number;

  isBaseCompte: boolean;

  dateCreation: string;

  dateDebProduction: string;

  dateFinProduction: string;
}


/* ============================================================
   DONNÉES STATIQUES
============================================================ */




/* ============================================================
   PAGE
============================================================ */

export function ModifierBonReceptionPage() {

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

    reference: '',

    compteId: '',

    name: '',

    mobile: '',

    quantityOil: '',

    quantityOlive: '',

    priceKg: '',

    price: '',

    payement: '',

    acompte: '',

    statusId: '1',

    caisse: '',

    natureId: '1',

    priceOil: '',

    observation: '',

    typeHuile: '1',

    isBaseCompte: false,

    dateCreation: '',

    dateDebProduction: '',

    dateFinProduction: '',

  });


  /* ==========================================================
     MODALE SUCCÈS
  ========================================================== */

  const [
    showSuccessModal,
    setShowSuccessModal,
  ] = useState(false);


  /* ==========================================================
     CHARGEMENT DU BON
  ========================================================== */

  const API_URL = "/olive_app/reception/getId";

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  if (!id) {
    setError("Identifiant du bon de réception manquant.");
    setLoading(false);
    return;
  }

  const loadBonReception = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
  `${API_URL}/${encodeURIComponent(id)}`,
  {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }
);

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}${
            responseText ? ` : ${responseText}` : ""
          }`
        );
      }

      if (!responseText) {
        throw new Error("Le serveur n'a retourné aucune donnée.");
      }

      const data = JSON.parse(responseText);

      console.log("Réponse API getId du bon :", data);

      // Certains backends renvoient directement l'objet,
      // d'autres l'encapsulent dans data ou result.
      const bon =
        data?.data ??
        data?.result ??
        data;

      if (!bon || typeof bon !== "object" || bon.id == null) {
        throw new Error(
          "Les données retournées ne correspondent pas à un bon de réception."
        );
      }

      setFormData({
        reference: String(bon.reference ?? ""),
        compteId: String(bon.compteId ?? ""),
        name: String(bon.name ?? ""),
        mobile: String(bon.mobile ?? ""),
        quantityOil: String(bon.quantityOil ?? ""),
        quantityOlive: String(bon.quantityOlive ?? ""),
        priceKg: String(bon.priceKg ?? ""),
        price: String(bon.price ?? ""),
        payement: String(bon.payement ?? ""),
        acompte: String(bon.acompte ?? ""),
        statusId: String(bon.statusId ?? "1"),
        caisse: String(bon.caisse ?? ""),
        natureId: String(bon.natureId ?? "1"),
        priceOil: String(bon.priceOil ?? ""),
        observation: String(bon.observation ?? ""),
        typeHuile: String(bon.typeHuile ?? "1"),
        isBaseCompte: Boolean(bon.isBaseCompte),
        dateCreation: convertDateTimeToInput(
          String(bon.dateCreation ?? "")
        ),
        dateDebProduction: convertDateTimeToInput(
          String(bon.dateDebProduction ?? "")
        ),
        dateFinProduction: convertDateTimeToInput(
          String(bon.dateFinProduction ?? "")
        ),
      });
    } catch (err) {
      console.error(
        "Erreur lors du chargement du bon de réception :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le bon de réception."
      );
    } finally {
      setLoading(false);
    }
  };

  void loadBonReception();
}, [id]);


  /* ==========================================================
     DATE + HEURE
     DD/MM/YYYY HH:mm:ss → YYYY-MM-DDTHH:mm
  ========================================================== */

  const convertDateTimeToInput = (
    value: string,
  ) => {

    if (!value) {
      return '';
    }


    const [
      datePart,
      timePart = '00:00:00',
    ] =
      value.split(' ');


    const [
      day,
      month,
      year,
    ] =
      datePart.split('/');


    const time =
      timePart.slice(
        0,
        5,
      );


    return `${year}-${month}-${day}T${time}`;

  };


  /* ==========================================================
     DATE + HEURE
     YYYY-MM-DDTHH:mm → DD/MM/YYYY HH:mm:ss
  ========================================================== */

  const formatDateTimeForBackend = (
    value: string,
  ) => {

    if (!value) {
      return '';
    }


    const [
      datePart,
      timePart,
    ] =
      value.split('T');


    const [
      year,
      month,
      day,
    ] =
      datePart.split('-');


    return `${day}/${month}/${year} ${timePart}:00`;

  };


  /* ==========================================================
     CHANGEMENT INPUT
  ========================================================== */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
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
     COMPTE DE BASE
  ========================================================== */

  const handleBaseCompteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    setFormData(
      (current) => ({

        ...current,

        isBaseCompte:
          event.target.checked,

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


    const modifiedBon: BonReception = {

      id:
        Number(id),

      reference:
        formData.reference,

      compteId:
        Number(
          formData.compteId || 0,
        ),

      name:
        formData.name,

      mobile:
        formData.mobile,

      quantityOil:
        Number(
          formData.quantityOil || 0,
        ),

      quantityOlive:
        Number(
          formData.quantityOlive || 0,
        ),

      priceKg:
        Number(
          formData.priceKg || 0,
        ),

      price:
        Number(
          formData.price || 0,
        ),

      payement:
        Number(
          formData.payement || 0,
        ),

      acompte:
        Number(
          formData.acompte || 0,
        ),

      statusId:
        formData.statusId,

      statusLib:
        getStatusLabel(
          formData.statusId,
        ),

      caisse:
        formData.caisse,

      natureId:
        Number(
          formData.natureId,
        ),

      priceOil:
        Number(
          formData.priceOil || 0,
        ),

      observation:
        formData.observation,

      typeHuile:
        Number(
          formData.typeHuile,
        ),

      isBaseCompte:
        formData.isBaseCompte,

      dateCreation:
        formatDateTimeForBackend(
          formData.dateCreation,
        ),

      dateDebProduction:
        formatDateTimeForBackend(
          formData.dateDebProduction,
        ),

      dateFinProduction:
        formatDateTimeForBackend(
          formData.dateFinProduction,
        ),

    };


    console.log(
      'Bon de réception modifié :',
      modifiedBon,
    );


    setShowSuccessModal(
      true,
    );

  };


  /* ==========================================================
     STATUT
  ========================================================== */

  const getStatusLabel = (
    statusId: string,
  ) => {

    switch (statusId) {

      case '1':
        return 'En cours';

      case '2':
        return 'Terminé';

      case '3':
        return 'En attente';

      case '4':
        return 'Annulé';

      default:
        return 'En cours';

    }

  };


  /* ==========================================================
     ANNULER
  ========================================================== */

  const handleCancel = () => {

    navigate(
      '/store-admin/reception-vouchers',
    );

  };


  /* ==========================================================
     OK
  ========================================================== */

  const handleSuccessOk = () => {

    navigate(
      '/store-admin/reception-vouchers',
    );

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {loading && (
  <p className="py-6 text-center text-sm text-muted-foreground">
    Chargement du bon de réception...
  </p>
)}

{error && (
  <div
    role="alert"
    className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
  >
    {error}
  </div>
)}


      {/* ======================================================
          RETOUR
      ====================================================== */}

      <button
        type="button"
        onClick={handleCancel}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-[#556B2F] transition hover:text-[#3f5124]"
      >

        <ArrowLeft className="size-4" />

        Retour aux bons de réception

      </button>


      {/* ======================================================
          CARD
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-border px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#eef4e6]">

              <FileText className="size-5 text-[#556B2F]" />

            </div>

            <div>

              <h1 className="text-xl font-bold text-foreground">

                Modifier le bon de réception

              </h1>

              <p className="mt-1 text-sm text-muted-foreground">

                Modifiez les informations du bon puis
                enregistrez les changements.

              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            FORMULAIRE
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="px-6 py-6">


            {/* ==================================================
                SECTION IDENTIFICATION
            ================================================== */}

            <div className="mb-6">

              <div className="mb-4 flex items-center gap-2">

                <Hash className="size-4 text-[#556B2F]" />

                <h2 className="text-sm font-bold text-[#172033]">

                  Identification

                </h2>

              </div>


              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">


                {/* RÉFÉRENCE */}

                <div>

                  <label
                    htmlFor="reference"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Référence

                    <span className="text-red-500">
                      {' *'}
                    </span>

                  </label>

                  <div className="relative">

                    <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="reference"
                      name="reference"
                      type="text"
                      value={
                        formData.reference
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* COMPTE ID */}

                <div>

                  <label
                    htmlFor="compteId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    ID du compte

                    <span className="text-red-500">
                      {' *'}
                    </span>

                  </label>

                  <div className="relative">

                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="compteId"
                      name="compteId"
                      type="number"
                      min="1"
                      value={
                        formData.compteId
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* NOM */}

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
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* MOBILE */}

                <div>

                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Téléphone

                  </label>

                  <div className="relative">

                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={
                        formData.mobile
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* STATUT */}

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

                  <select
                    id="statusId"
                    name="statusId"
                    value={
                      formData.statusId
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="1">
                      En cours
                    </option>

                    <option value="2">
                      Terminé
                    </option>

                    <option value="3">
                      En attente
                    </option>

                    <option value="4">
                      Annulé
                    </option>

                  </select>

                </div>


                {/* COMPTE BASE */}

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

                      Compte de base

                    </span>

                  </label>

                </div>

              </div>

            </div>


            {/* ==================================================
                SECTION PRODUCTION
            ================================================== */}

            <div className="mb-6 border-t border-border pt-6">

              <div className="mb-4 flex items-center gap-2">

                <Droplets className="size-4 text-[#556B2F]" />

                <h2 className="text-sm font-bold text-[#172033]">

                  Production

                </h2>

              </div>


              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">


                {/* OLIVES */}

                <div>

                  <label
                    htmlFor="quantityOlive"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Quantité d'olives

                  </label>

                  <div className="relative">

                    <input
                      id="quantityOlive"
                      name="quantityOlive"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.quantityOlive
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      kg

                    </span>

                  </div>

                </div>


                {/* HUILE */}

                <div>

                  <label
                    htmlFor="quantityOil"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Quantité d'huile

                  </label>

                  <div className="relative">

                    <input
                      id="quantityOil"
                      name="quantityOil"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.quantityOil
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      L

                    </span>

                  </div>

                </div>


                {/* CAISSES */}

                <div>

                  <label
                    htmlFor="caisse"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Nombre de caisses

                  </label>

                  <div className="relative">

                    <Package className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="caisse"
                      name="caisse"
                      type="text"
                      value={
                        formData.caisse
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* PRIX KG */}

                <div>

                  <label
                    htmlFor="priceKg"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Prix / kg

                  </label>

                  <div className="relative">

                    <input
                      id="priceKg"
                      name="priceKg"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.priceKg
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      DT

                    </span>

                  </div>

                </div>


                {/* PRIX HUILE */}

                <div>

                  <label
                    htmlFor="priceOil"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Prix huile

                  </label>

                  <div className="relative">

                    <input
                      id="priceOil"
                      name="priceOil"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.priceOil
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      DT/L

                    </span>

                  </div>

                </div>


                {/* TYPE HUILE */}

                <div>

                  <label
                    htmlFor="typeHuile"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Type d'huile

                  </label>

                  <select
                    id="typeHuile"
                    name="typeHuile"
                    value={
                      formData.typeHuile
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="1">
                      Huile standard
                    </option>

                    <option value="2">
                      Huile premium
                    </option>

                  </select>

                </div>


                {/* NATURE */}

                <div>

                  <label
                    htmlFor="natureId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Nature

                  </label>

                  <select
                    id="natureId"
                    name="natureId"
                    value={
                      formData.natureId
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="1">
                      Production
                    </option>

                    <option value="2">
                      Fournisseur
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* ==================================================
                SECTION FINANCIÈRE
            ================================================== */}

            <div className="mb-6 border-t border-border pt-6">

              <div className="mb-4 flex items-center gap-2">

                <Banknote className="size-4 text-[#556B2F]" />

                <h2 className="text-sm font-bold text-[#172033]">

                  Informations financières

                </h2>

              </div>


              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">


                {/* PRIX TOTAL */}

                <div>

                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Prix total

                  </label>

                  <div className="relative">

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.price
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      DT

                    </span>

                  </div>

                </div>


                {/* PAIEMENT */}

                <div>

                  <label
                    htmlFor="payement"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Paiement

                  </label>

                  <div className="relative">

                    <input
                      id="payement"
                      name="payement"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.payement
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      DT

                    </span>

                  </div>

                </div>


                {/* ACOMPTE */}

                <div>

                  <label
                    htmlFor="acompte"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Acompte

                  </label>

                  <div className="relative">

                    <input
                      id="acompte"
                      name="acompte"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.acompte
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">

                      DT

                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================================
                SECTION DATES
            ================================================== */}

            <div className="mb-6 border-t border-border pt-6">

              <div className="mb-4 flex items-center gap-2">

                <CalendarDays className="size-4 text-[#556B2F]" />

                <h2 className="text-sm font-bold text-[#172033]">

                  Dates

                </h2>

              </div>


              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">


                {/* DATE CRÉATION */}

                <div>

                  <label
                    htmlFor="dateCreation"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Date de création

                  </label>

                  <input
                    id="dateCreation"
                    name="dateCreation"
                    type="datetime-local"
                    value={
                      formData.dateCreation
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>


                {/* DÉBUT */}

                <div>

                  <label
                    htmlFor="dateDebProduction"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Début production

                  </label>

                  <input
                    id="dateDebProduction"
                    name="dateDebProduction"
                    type="datetime-local"
                    value={
                      formData.dateDebProduction
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>


                {/* FIN */}

                <div>

                  <label
                    htmlFor="dateFinProduction"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >

                    Fin production

                  </label>

                  <input
                    id="dateFinProduction"
                    name="dateFinProduction"
                    type="datetime-local"
                    value={
                      formData.dateFinProduction
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>

              </div>

            </div>


            {/* ==================================================
                OBSERVATION
            ================================================== */}

            <div className="border-t border-border pt-6">

              <label
                htmlFor="observation"
                className="mb-2 block text-sm font-medium text-foreground"
              >

                Observation

              </label>

              <textarea
                id="observation"
                name="observation"
                value={
                  formData.observation
                }
                onChange={
                  handleChange
                }
                rows={4}
                placeholder="Ajouter une observation..."
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
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
              className="h-11 min-w-[155px] bg-[#556B2F] hover:bg-[#465A27]"
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


            <div className="flex justify-center">

              <div className="flex size-16 items-center justify-center rounded-full bg-[#eef4e6]">

                <Check className="size-9 text-[#556B2F]" />

              </div>

            </div>


            <h2 className="mt-4 text-xl font-bold text-gray-900">

              Bon de réception modifié avec succès

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              Les informations du bon de réception ont
              été enregistrées.

            </p>


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