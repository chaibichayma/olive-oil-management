import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  Check,
  FileText,
  Hash,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Save,
  User,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
const API_BASE_URL = '/olive_app';
const CREATE_RECEPTION_URL = `${API_BASE_URL}/reception/create`;
export function AjouterBonReceptionPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  /* ============================================================
     FORMULAIRE
  ============================================================ */

  const [formData, setFormData] = useState({
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
    natureId: '',
    priceOil: '',
    observation: '',
    typeHuile: '',
    isBaseCompte: false,
    dateDebProduction: '',
    dateFinProduction: '',
  });

  /* ============================================================
     MODALE SUCCÈS
  ============================================================ */

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  /* ============================================================
     MODIFICATION DES CHAMPS
  ============================================================ */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ============================================================
     COMPTE DE BASE
  ============================================================ */

  const handleToggleBaseCompte = () => {
    setFormData((current) => ({
      ...current,
      isBaseCompte: !current.isBaseCompte,
    }));
  };

  /* ============================================================
     ANNULER
  ============================================================ */

  const handleCancel = () => {
    navigate('/store-admin/reception-vouchers');
  };

  /* ============================================================
     ENREGISTRER
  ============================================================ */

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);
  setApiError('');

const now = new Date().toISOString();

const toNumberOrZero = (value: string): number => {
  if (value.trim() === '') return 0;

  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const toDateOrNull = (value: string): string | null => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
};

const quantityOlive = toNumberOrZero(formData.quantityOlive);
const quantityOil = toNumberOrZero(formData.quantityOil);
const price = toNumberOrZero(formData.price);
const payement = toNumberOrZero(formData.payement);
const acompte = toNumberOrZero(formData.acompte);

const payload = {
  id: 0,
  reference: formData.reference.trim(),
  compteId: Number(formData.compteId),
  name: formData.name.trim(),
  mobile: formData.mobile.trim(),

  quantityOil,
  quantityOlive,
  priceKg: toNumberOrZero(formData.priceKg),
  price,
  payement,
  acompte,

  statusId: formData.statusId,
  statusLib:
    formData.statusId === '1' ? 'En cours' : 'Clôturé',

  caisse: formData.caisse.trim(),
  natureId: toNumberOrZero(formData.natureId),
  priceOil: toNumberOrZero(formData.priceOil),
  observation: formData.observation.trim(),
  typeHuile: toNumberOrZero(formData.typeHuile),
  isBaseCompte: formData.isBaseCompte,

  dateCreation: now,
  dateDebProduction:
    toDateOrNull(formData.dateDebProduction) ?? now,
  dateFinProduction:
    toDateOrNull(formData.dateFinProduction) ?? now,

  solde: price - payement - acompte,

  rendement:
    quantityOlive > 0
      ? (quantityOil / quantityOlive) * 100
      : 0,
};

console.log(
  'Payload envoyé :',
  JSON.stringify(payload, null, 2),
);
  try {
  console.log(
    'JSON envoyé :',
    JSON.stringify(payload, null, 2),
  );

  const response = await fetch(CREATE_RECEPTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  console.log('Statut HTTP :', response.status);
  console.log('Réponse backend :', responseText);

  if (!response.ok) {
    throw new Error(
      `Erreur HTTP ${response.status}: ${
        responseText || 'Le serveur a refusé les données.'
      }`,
    );
  }

  setShowSuccessModal(true);
} catch (error) {
  console.error('Erreur lors de la création :', error);

  setApiError(
    error instanceof Error
      ? error.message
      : "Impossible d'ajouter le bon de réception.",
  );
} finally {
  setIsSubmitting(false);
}
};

  /* ============================================================
     FERMER MODALE SUCCÈS
  ============================================================ */

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  /* ============================================================
     BOUTON OK
  ============================================================ */

  const handleSuccessOk = () => {
    setShowSuccessModal(false);

    navigate('/store-admin/reception-vouchers');
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* ========================================================
          HEADER DE PAGE
      ======================================================== */}

      <Container>

        <div className="py-5">

          <h1 className="text-2xl font-bold text-foreground">
            Ajouter un bon de réception
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">

            <span>
              Accueil
            </span>

            <span>
              /
            </span>

            <span>
              Bon de réception
            </span>

            <span>
              /
            </span>

            <span className="font-medium text-foreground">
              Ajouter
            </span>

          </div>

        </div>

      </Container>


      {/* ========================================================
          FORMULAIRE
      ======================================================== */}

      <Container>

        <form onSubmit={handleSubmit}>

          <div className="mx-auto w-full max-w-6xl rounded-xl border border-border bg-white shadow-sm">

            {/* ==================================================
                HEADER CARD
            ================================================== */}

            <div className="border-b border-border px-6 py-5">

              <h2 className="text-lg font-bold text-foreground">
                Informations du bon de réception
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Veuillez remplir les informations du bon de réception.
              </p>

            </div>


            {/* ==================================================
                CHAMPS
            ================================================== */}

            <div className="px-6 py-6">
              {apiError && (
  <div
    role="alert"
    className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
  >
    {apiError}
  </div>
)}

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                {/* ==================================================
                    RÉFÉRENCE
                ================================================== */}

                <div>

                  <label
                    htmlFor="reference"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Référence

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="reference"
                      name="reference"
                      type="text"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="Entrez la référence"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    ID COMPTE
                ================================================== */}

                <div>

                  <label
                    htmlFor="compteId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    ID compte

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="compteId"
                      name="compteId"
                      type="number"
                      min="1"
                      value={formData.compteId}
                      onChange={handleChange}
                      placeholder="Entrez l'ID du compte"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    NOM
                ================================================== */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom

                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Entrez le nom"
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
                    Mobile

                  </label>

                  <div className="relative">

                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Entrez le numéro de mobile"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    QUANTITÉ OLIVES
                ================================================== */}

                <div>

                  <label
                    htmlFor="quantityOlive"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Quantité olives

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <input
                      id="quantityOlive"
                      name="quantityOlive"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.quantityOlive}
                      onChange={handleChange}
                      placeholder="Entrez la quantité"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      kg
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    QUANTITÉ HUILE
                ================================================== */}

                <div>

                  <label
                    htmlFor="quantityOil"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Quantité huile

                  </label>

                  <div className="relative">

                    <input
                      id="quantityOil"
                      name="quantityOil"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.quantityOil}
                      onChange={handleChange}
                      placeholder="Entrez la quantité"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      L
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    PRIX KG
                ================================================== */}

                <div>

                  <label
                    htmlFor="priceKg"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Prix / kg

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <input
                      id="priceKg"
                      name="priceKg"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceKg}
                      onChange={handleChange}
                      placeholder="Entrez le prix"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    PRIX TOTAL
                ================================================== */}

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
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Entrez le prix total"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    PAIEMENT
                ================================================== */}

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
                      value={formData.payement}
                      onChange={handleChange}
                      placeholder="Entrez le paiement"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    ACOMPTE
                ================================================== */}

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
                      value={formData.acompte}
                      onChange={handleChange}
                      placeholder="Entrez l'acompte"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

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

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="statusId"
                    name="statusId"
                    value={formData.statusId}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="1">
                      En cours
                    </option>

                    <option value="2">
                      Clôturé
                    </option>

                  </select>

                </div>


                {/* ==================================================
                    CAISSE
                ================================================== */}

                <div>

                  <label
                    htmlFor="caisse"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Caisse
                  </label>

                  <div className="relative">

                    <Package className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="caisse"
                      name="caisse"
                      type="text"
                      value={formData.caisse}
                      onChange={handleChange}
                      placeholder="Entrez la caisse"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    NATURE
                ================================================== */}

                <div>

                  <label
                    htmlFor="natureId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    ID nature
                  </label>

                  <input
                    id="natureId"
                    name="natureId"
                    type="number"
                    min="1"
                    value={formData.natureId}
                    onChange={handleChange}
                    placeholder="Entrez l'ID de la nature"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>


                {/* ==================================================
                    PRIX HUILE
                ================================================== */}

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
                      value={formData.priceOil}
                      onChange={handleChange}
                      placeholder="Entrez le prix de l'huile"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    TYPE HUILE
                ================================================== */}

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
                    value={formData.typeHuile}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="">
                      Sélectionnez le type d'huile
                    </option>

                    <option value="1">
                      Huile d'olive
                    </option>

                    <option value="2">
                      Huile d'olive extra vierge
                    </option>

                    <option value="3">
                      Autre
                    </option>

                  </select>

                </div>


                {/* ==================================================
                    DATE DÉBUT PRODUCTION
                ================================================== */}

                <div>

                  <label
                    htmlFor="dateDebProduction"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date début production
                  </label>

                  <div className="relative">

                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="dateDebProduction"
                      name="dateDebProduction"
                      type="datetime-local"
                      value={formData.dateDebProduction}
                      onChange={handleChange}
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    DATE FIN PRODUCTION
                ================================================== */}

                <div>

                  <label
                    htmlFor="dateFinProduction"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date fin production
                  </label>

                  <div className="relative">

                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="dateFinProduction"
                      name="dateFinProduction"
                      type="datetime-local"
                      value={formData.dateFinProduction}
                      onChange={handleChange}
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    COMPTE DE BASE
                ================================================== */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Compte de base

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleToggleBaseCompte}
                    className="flex items-center gap-3"
                  >

                    <span
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isBaseCompte
                          ? 'bg-[#556B2F]'
                          : 'bg-gray-300'
                      }`}
                    >

                      <span
                        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                          formData.isBaseCompte
                            ? 'translate-x-5'
                            : 'translate-x-0.5'
                        }`}
                      />

                    </span>

                    <span className="text-sm font-medium text-foreground">
                      {formData.isBaseCompte
                        ? 'Oui'
                        : 'Non'}
                    </span>

                  </button>

                </div>


                {/* ==================================================
                    OBSERVATION
                ================================================== */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="observation"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Observation
                  </label>

                  <div className="relative">

                    <MessageSquare className="absolute left-3 top-3 size-4 text-muted-foreground" />

                    <textarea
                      id="observation"
                      name="observation"
                      value={formData.observation}
                      onChange={handleChange}
                      placeholder="Ajoutez une observation..."
                      rows={4}
                      className="w-full resize-none rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">

              {/* ANNULER */}

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[100px]"
              >
                Annuler
              </Button>


              {/* ENREGISTRER */}

              <Button
  type="submit"
  disabled={isSubmitting}
  className="h-10 min-w-[125px] bg-[#556B2F] hover:bg-[#465A27]"
>
  <Save className="size-4" />
  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
</Button>

            </div>

          </div>

        </form>

      </Container>


      {/* ========================================================
          MODALE SUCCÈS
      ======================================================== */}

      {showSuccessModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={handleCloseSuccess}
        >

          {/* ==================================================
              CONTENU MODALE
          ================================================== */}

          <div
            className="relative w-full max-w-[380px] rounded-lg bg-white px-7 py-5 text-center shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================
                FERMER
            ================================================== */}

            <button
              type="button"
              onClick={handleCloseSuccess}
              className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-700"
              aria-label="Fermer"
            >

              <X className="size-4" />

            </button>


            {/* ==================================================
                ICÔNE SUCCÈS
            ================================================== */}

            <div className="flex justify-center">

              <div className="flex size-12 items-center justify-center rounded-full bg-green-50">

                <Check className="size-6 text-[#556B2F]" />

              </div>

            </div>


            {/* ==================================================
                TITRE
            ================================================== */}

            <h2 className="mt-3 text-sm font-bold text-gray-900">
              Bon de réception ajouté
            </h2>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            <p className="mt-2 text-xs text-gray-500">
              Le bon de réception a été ajouté avec succès.
            </p>


            {/* ==================================================
                BOUTON OK
            ================================================== */}

            <div className="mt-4 flex justify-center">

              <Button
                type="button"
                onClick={handleSuccessOk}
                className="h-9 min-w-[70px] bg-[#556B2F] text-xs text-white hover:bg-[#465A27]"
              >
                OK
              </Button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}