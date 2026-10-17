
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  Hash,
  Save,
  X,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

// Endpoint backend Swagger
const API_URL = '/olive_app/citerne/save';

interface CiterneFormData {
  reference: string;
  name: string;
  capacite: string;
  dateFabrication: string;
}

export function AjouterCiternePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CiterneFormData>({
    reference: '',
    name: '',
    capacite: '',
    dateFabrication: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modification des champs
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Annuler
  const handleCancel = () => {
    navigate('/store-admin/tanks');
  };

  // Enregistrer la citerne dans le backend
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage('');

    const capacite = Number(formData.capacite);

    if (!Number.isFinite(capacite) || capacite <= 0) {
      setErrorMessage('La capacité doit être un nombre supérieur à zéro.');
      return;
    }

    const payload = {
      reference: formData.reference.trim(),
      name: formData.name.trim(),
      capacite,
      dateFabrication: formData.dateFabrication,
    };

    setLoading(true);

    try {
      console.log('Données envoyées au backend :', payload);

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
      console.log('Réponse backend :', responseText);

      let responseData: any = null;

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = responseText;
        }
      }

      if (!response.ok) {
        const backendMessage =
          typeof responseData === 'object' && responseData !== null
            ? responseData.message ||
              responseData.detail ||
              responseData.error ||
              responseData.title
            : responseData;

        throw new Error(
          backendMessage
            ? `Erreur HTTP ${response.status} : ${backendMessage}`
            : `Erreur HTTP ${response.status}. Vérifie les données envoyées.`,
        );
      }

      // Succès confirmé par le backend
      console.log('Citerne créée avec succès :', responseData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erreur lors de la création de la citerne :', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Fermer la modale
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  // Retour à la liste des citernes
  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate('/store-admin/tanks');
  };

  return (
    <>
      {/* En-tête */}
      <Container>
        <div className="py-5">
          <h1 className="text-2xl font-bold text-foreground">
            Ajouter une citerne
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Accueil</span>
            <span>/</span>
            <span>Paramétrage</span>
            <span>/</span>
            <span>Citernes</span>
            <span>/</span>
            <span className="font-medium text-foreground">
              Ajouter
            </span>
          </div>
        </div>
      </Container>

      {/* Formulaire */}
      <Container>
        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-border bg-white shadow-sm">
            {/* Titre du formulaire */}
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-bold text-foreground">
                Informations de la citerne
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Veuillez remplir les informations de la citerne.
              </p>
            </div>

            {/* Champs */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                {/* Référence */}
                <div>
                  <label
                    htmlFor="reference"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Référence
                    <span className="ml-1 text-red-500">*</span>
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

                {/* Nom */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Entrez le nom de la citerne"
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                {/* Capacité */}
                <div>
                  <label
                    htmlFor="capacite"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Capacité
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="capacite"
                      name="capacite"
                      type="number"
                      min="0.01"
                      step="any"
                      value={formData.capacite}
                      onChange={handleChange}
                      placeholder="Entrez la capacité"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      L
                    </span>
                  </div>
                </div>

                {/* Date de fabrication */}
                <div>
                  <label
                    htmlFor="dateFabrication"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date de fabrication
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="dateFabrication"
                      name="dateFabrication"
                      type="date"
                      value={formData.dateFabrication}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>
              </div>

              {/* Message d'erreur */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="h-10 min-w-[100px]"
              >
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="h-10 min-w-[125px] bg-[#556B2F] hover:bg-[#465A27]"
              >
                {loading ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}

                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </form>
      </Container>

      {/* Modale de succès */}
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
              Citerne ajoutée
            </h2>

            <p className="mt-2 text-xs text-gray-500">
              La citerne a été enregistrée avec succès.
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
