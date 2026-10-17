
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  Check,
  Hash,
  Save,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

/* =========================================================
   CONFIGURATION API
========================================================= */

const API_URL = '/olive_app/season/save';

/* =========================================================
   TYPE DU FORMULAIRE
========================================================= */

interface SaisonFormData {
  beginDate: string;
  endDate: string;
  statusId: string;
  year: string;
  priceKilo: string;
  priceAchat: string;
  priceVente: string;
  nbreCaisses: string;
}

/* =========================================================
   COMPOSANT AJOUTER SAISON
========================================================= */

export function AjouterSaisonPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SaisonFormData>({
    beginDate: '',
    endDate: '',
    statusId: '1',
    year: '',
    priceKilo: '',
    priceAchat: '',
    priceVente: '',
    nbreCaisses: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* =========================================================
     MODIFICATION DES CHAMPS
  ========================================================= */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage('');
  };

  /* =========================================================
     ANNULATION
  ========================================================= */

  const handleCancel = () => {
    navigate('/store-admin/saison');
  };

  /* =========================================================
     ENREGISTREMENT API
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage('');

    // 1. Vérifier les champs obligatoires
    const requiredFields = [
      formData.beginDate,
      formData.endDate,
      formData.statusId,
      formData.year,
      formData.priceKilo,
      formData.priceAchat,
      formData.priceVente,
      formData.nbreCaisses,
    ];

    if (requiredFields.some((value) => !value.trim())) {
      setErrorMessage(
        'Veuillez remplir tous les champs obligatoires.',
      );
      return;
    }

    // 2. Vérifier les dates
    if (formData.endDate < formData.beginDate) {
      setErrorMessage(
        'La date de fin doit être postérieure ou égale à la date de début.',
      );
      return;
    }

    // 3. Convertir les valeurs selon les types du backend
    const year = Number(formData.year);
    const statusId = Number(formData.statusId);
    const priceKilo = Number(formData.priceKilo);
    const priceAchat = Number(formData.priceAchat);
    const priceVente = Number(formData.priceVente);
    const nbreCaisses = Number(formData.nbreCaisses);

    // 4. Valider les nombres
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(statusId) ||
      !Number.isFinite(priceKilo) ||
      !Number.isFinite(priceAchat) ||
      !Number.isFinite(priceVente) ||
      !Number.isInteger(nbreCaisses)
    ) {
      setErrorMessage(
        'Vérifiez l’année, le statut, les prix et le nombre de caisses.',
      );
      return;
    }

    if (
      year < 1900 ||
      year > 2100 ||
      statusId < 0 ||
      priceKilo < 0 ||
      priceAchat < 0 ||
      priceVente < 0 ||
      nbreCaisses < 0
    ) {
      setErrorMessage(
        'Les valeurs saisies doivent respecter les limites autorisées.',
      );
      return;
    }

    /*
     * 5. Payload conforme aux champs métier du modèle Swagger.
     *
     * Les champs générés par le backend, comme createdDate,
     * createdTime et createdUser, ne sont pas envoyés ici.
     * L'identifiant id n'est pas fourni lors de la création.
     */
    const payload = {
  createdUser: '',
  createdDate: new Date().toISOString().slice(0, 10),
  createdTime: {
    hour: 0,
    minute: 0,
    second: 0,
    nano: 0,
  },
  searche: '',
  beginDate: formData.beginDate,
  endDate: formData.endDate,
  statusId: Number(formData.statusId),
  year: Number(formData.year),
  priceKilo: Number(formData.priceKilo),
  priceAchat: Number(formData.priceAchat),
  priceVente: Number(formData.priceVente),
  nbreCaisses: Number(formData.nbreCaisses),
  id: {},
};

    console.log('URL API :', API_URL);
    console.log(
      'Payload envoyé :',
      JSON.stringify(payload, null, 2),
    );

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      console.log('Statut HTTP :', response.status);
      console.log('Réponse serveur :', responseText);

      let responseData: unknown = null;

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = responseText;
        }
      }

      if (!response.ok) {
        let serverMessage = '';

        if (
          responseData !== null &&
          typeof responseData === 'object'
        ) {
          const data = responseData as {
            message?: unknown;
            error?: unknown;
            detail?: unknown;
            title?: unknown;
          };

          serverMessage = String(
            data.message ??
              data.detail ??
              data.error ??
              data.title ??
              '',
          );
        } else if (typeof responseData === 'string') {
          serverMessage = responseData;
        }

        throw new Error(
          serverMessage ||
            `Erreur HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Succès uniquement après une réponse HTTP positive.
      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        'Erreur lors de la création de la saison :',
        error,
      );

      if (error instanceof TypeError) {
        setErrorMessage(
          "Impossible de joindre l'API. Vérifiez le proxy Vite, l'accès au serveur et la configuration CORS.",
        );
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Une erreur inattendue est survenue.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     FERMETURE DU MODAL
  ========================================================= */

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate('/store-admin/saison');
  };

  /* =========================================================
     AFFICHAGE
  ========================================================= */

  return (
    <>
      <Container>
        <div className="py-5">
          <h1 className="text-2xl font-bold text-foreground">
            Ajouter une saison
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Accueil</span>
            <span>/</span>
            <span>Paramétrage</span>
            <span>/</span>
            <span>Saison</span>
            <span>/</span>
            <span className="font-medium text-foreground">
              Ajouter
            </span>
          </div>
        </div>
      </Container>

      <Container>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-bold text-foreground">
                Informations de la saison
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Veuillez remplir les informations de la saison.
              </p>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                {/* Année */}
                <div>
                  <label
                    htmlFor="year"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Année de la saison
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="year"
                      name="year"
                      type="number"
                      min="1900"
                      max="2100"
                      step="1"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="Entrez l'année"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label
                    htmlFor="statusId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Statut
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    id="statusId"
                    name="statusId"
                    value={formData.statusId}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >
                    <option value="1">En cours</option>
                    <option value="2">Clôturée</option>
                  </select>
                </div>

                {/* Date de début */}
                <div>
                  <label
                    htmlFor="beginDate"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date début saison
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="beginDate"
                      name="beginDate"
                      type="date"
                      value={formData.beginDate}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* Date de fin */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date fin saison
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      min={formData.beginDate || undefined}
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* Prix du kilo */}
                <div>
                  <label
                    htmlFor="priceKilo"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Prix production d'un kilo d'olives
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="priceKilo"
                      name="priceKilo"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceKilo}
                      onChange={handleChange}
                      placeholder="Ex. 0.80"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-14 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT/kg
                    </span>
                  </div>
                </div>

                {/* Prix d'achat */}
                <div>
                  <label
                    htmlFor="priceAchat"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Prix d'achat d'un litre d'huile
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="priceAchat"
                      name="priceAchat"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceAchat}
                      onChange={handleChange}
                      placeholder="Ex. 18.00"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT/L
                    </span>
                  </div>
                </div>

                {/* Prix de vente */}
                <div>
                  <label
                    htmlFor="priceVente"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Prix de vente d'un litre d'huile
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="priceVente"
                      name="priceVente"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceVente}
                      onChange={handleChange}
                      placeholder="Ex. 20.00"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT/L
                    </span>
                  </div>
                </div>

                {/* Nombre de caisses */}
                <div>
                  <label
                    htmlFor="nbreCaisses"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nombre de caisses
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="nbreCaisses"
                    name="nbreCaisses"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.nbreCaisses}
                    onChange={handleChange}
                    placeholder="Entrez le nombre de caisses"
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="h-10 min-w-[100px]"
              >
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 min-w-[125px] bg-[#556B2F] hover:bg-[#465A27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="size-4" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </form>
      </Container>

      {/* Modal de confirmation */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={handleCloseSuccess}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="relative w-full max-w-[380px] rounded-lg bg-white px-7 py-5 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseSuccess}
              className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-700"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-50">
                <Check className="size-6 text-[#556B2F]" />
              </div>
            </div>

            <h2
              id="success-title"
              className="mt-3 text-sm font-bold text-gray-900"
            >
              Saison ajoutée
            </h2>

            <p className="mt-2 text-xs text-gray-500">
              La saison a été ajoutée avec succès.
            </p>

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
