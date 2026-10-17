import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Save,
  ShoppingCart,
  X,
  Package,
  Hash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

const API_URL = '/olive_app/season';
const LIST_API_URL = `${API_URL}/getListBean`;

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

/**
 * L'identifiant est conservé tel que renvoyé par le backend.
 * Cela évite de supposer qu'il est toujours numérique.
 */
interface SaisonApi {
  id?: unknown;
  beginDate?: string;
  endDate?: string;
  statusId?: number | string;
  year?: number | string;
  priceKilo?: number | string;
  priceAchat?: number | string;
  priceVente?: number | string;
  nbreCaisses?: number | string;
  createdUser?: string;
  createdDate?: string;
  createdTime?: unknown;
  searche?: string;
  [key: string]: unknown;
}

const initialFormData: SaisonFormData = {
  beginDate: '',
  endDate: '',
  statusId: '1',
  year: '',
  priceKilo: '',
  priceAchat: '',
  priceVente: '',
  nbreCaisses: '',
};

function getErrorMessage(data: unknown): string {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data && typeof data === 'object') {
    const error = data as Record<string, unknown>;

    for (const key of ['message', 'detail', 'error', 'title']) {
      if (typeof error[key] === 'string' && error[key]) {
        return error[key] as string;
      }
    }
  }

  return '';
}

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractSeasons(data: unknown): SaisonApi[] {
  if (Array.isArray(data)) {
    return data as SaisonApi[];
  }

  if (data && typeof data === 'object') {
    const object = data as Record<string, unknown>;

    // Certains contrôleurs renvoient directement une liste,
    // d'autres l'enveloppent dans un objet.
    for (const key of ['data', 'content', 'items', 'list', 'result']) {
      if (Array.isArray(object[key])) {
        return object[key] as SaisonApi[];
      }
    }

    // Une réponse contenant une seule saison.
    if ('beginDate' in object || 'year' in object) {
      return [object as SaisonApi];
    }
  }

  return [];
}

function normalizeDate(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  // Pour un champ HTML input type="date".
  return value.length >= 10 ? value.substring(0, 10) : value;
}

function sameId(a: unknown, b: string): boolean {
  if (a === null || a === undefined) {
    return false;
  }

  if (typeof a === 'object') {
    const obj = a as Record<string, unknown>;

    // Prise en charge de quelques formes courantes d'identifiant objet.
    const nestedId = obj.id ?? obj.value ?? obj.idSaison;

    return nestedId !== undefined && String(nestedId) === b;
  }

  return String(a) === b;
}

function toFormData(saison: SaisonApi): SaisonFormData {
  return {
    beginDate: normalizeDate(saison.beginDate),
    endDate: normalizeDate(saison.endDate),
    statusId: String(saison.statusId ?? '1'),
    year: String(saison.year ?? ''),
    priceKilo: String(saison.priceKilo ?? ''),
    priceAchat: String(saison.priceAchat ?? ''),
    priceVente: String(saison.priceVente ?? ''),
    nbreCaisses: String(saison.nbreCaisses ?? ''),
  };
}

export function ModifierSaisonPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] =
    useState<SaisonFormData>(initialFormData);

  const [originalSaison, setOriginalSaison] =
    useState<SaisonApi | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**
   * Charger la liste et retrouver la saison sélectionnée.
   *
   * L'endpoint de liste est à adapter si le contrôleur
   * expose un chemin différent dans Swagger.
   */
  const loadSaison = useCallback(async () => {
    if (!id) {
      setErrorMessage('Identifiant de saison absent dans l’URL.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `${LIST_API_URL}?searche=`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const responseData = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(responseData) ||
            `Erreur HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const seasons = extractSeasons(responseData);

      const selected = seasons.find((item) => sameId(item.id, id));

      if (!selected) {
        throw new Error(
          `La saison portant l’identifiant ${id} est introuvable dans la liste retournée par le backend.`,
        );
      }

      setOriginalSaison(selected);
      setFormData(toFormData(selected));
    } catch (error) {
      console.error('Erreur de chargement de la saison :', error);

      setErrorMessage(
        error instanceof TypeError
          ? 'Impossible de joindre le serveur. Vérifiez le proxy Vite et la disponibilité de l’API.'
          : error instanceof Error
            ? error.message
            : 'Erreur lors du chargement de la saison.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadSaison();
  }, [loadSaison]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleCancel = () => {
    navigate('/store-admin/saison');
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage('');

    if (!id || !originalSaison) {
      setErrorMessage(
        'La saison n’a pas été chargée correctement. Veuillez réessayer.',
      );
      return;
    }

    if (
      !formData.year.trim() ||
      !formData.beginDate ||
      !formData.endDate ||
      !formData.statusId.trim() ||
      !formData.priceKilo.trim() ||
      !formData.priceAchat.trim() ||
      !formData.priceVente.trim() ||
      !formData.nbreCaisses.trim()
    ) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (formData.endDate < formData.beginDate) {
      setErrorMessage(
        'La date de fin doit être postérieure ou égale à la date de début.',
      );
      return;
    }

    const year = Number(formData.year);
    const statusId = Number(formData.statusId);
    const priceKilo = Number(formData.priceKilo);
    const priceAchat = Number(formData.priceAchat);
    const priceVente = Number(formData.priceVente);
    const nbreCaisses = Number(formData.nbreCaisses);

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
     * On conserve les propriétés originales renvoyées par l'API,
     * notamment l'identifiant et les éventuels champs de création.
     * Les champs modifiables sont ensuite remplacés par les valeurs
     * du formulaire.
     */
    const payload: SaisonApi = {
      ...originalSaison,
      beginDate: formData.beginDate,
      endDate: formData.endDate,
      statusId,
      year,
      priceKilo,
      priceAchat,
      priceVente,
      nbreCaisses,
    };

    console.log('URL API :', `${API_URL}/update`);
    console.log('JSON envoyé :', JSON.stringify(payload, null, 2));

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await readResponse(response);

      console.log('Statut HTTP :', response.status);
      console.log('Réponse du serveur :', responseData);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(responseData) ||
            `Erreur HTTP ${response.status}: ${response.statusText}`,
        );
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erreur lors de la modification :', error);

      setErrorMessage(
        error instanceof TypeError
          ? 'Impossible de joindre l’API. Vérifiez le proxy, le serveur et la configuration CORS.'
          : error instanceof Error
            ? error.message
            : 'Une erreur inattendue est survenue.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Container>
        <div className="mb-6 py-5">
          <h1 className="text-2xl font-bold text-foreground">
            Modifier une saison
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Accueil</span>
            <span>/</span>
            <span>Paramétrage</span>
            <span>/</span>
            <span>Saison</span>
            <span>/</span>
            <span className="font-medium text-foreground">Modifier</span>
          </div>
        </div>
      </Container>

      <Container>
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
            {!isLoading && !originalSaison && (
              <button
                type="button"
                onClick={() => void loadSaison()}
                className="ml-2 font-semibold underline"
              >
                Réessayer
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
            Chargement des informations de la saison...
          </div>
        ) : originalSaison ? (
          <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#eef4e6]">
                  <CalendarDays className="size-5 text-[#556B2F]" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#172033]">
                    Informations de la saison
                  </h2>
                  <p className="mt-0.5 text-sm text-[#64748b]">
                    Modifiez les informations puis enregistrez.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="year"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Année de la saison *
                  </label>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min="1900"
                      max="2100"
                      step="1"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="statusId"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Statut *
                  </label>
                  <select
                    id="statusId"
                    name="statusId"
                    value={formData.statusId}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >
                    <option value="1">En cours</option>
                    <option value="2">Clôturé</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="beginDate"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Date début saison *
                  </label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="beginDate"
                      name="beginDate"
                      type="date"
                      value={formData.beginDate}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Date fin saison *
                  </label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      min={formData.beginDate || undefined}
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="priceKilo"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Prix de production par kg *
                  </label>
                  <div className="relative">
                    <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="priceKilo"
                      name="priceKilo"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceKilo}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-14 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b]">
                      DT/kg
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="priceAchat"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Prix d’achat par litre *
                  </label>
                  <div className="relative">
                    <ShoppingCart className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="priceAchat"
                      name="priceAchat"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceAchat}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b]">
                      DT/L
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="priceVente"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Prix de vente par litre *
                  </label>
                  <div className="relative">
                    <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="priceVente"
                      name="priceVente"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.priceVente}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b]">
                      DT/L
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nbreCaisses"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Nombre de caisses *
                  </label>
                  <div className="relative">
                    <Package className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="nbreCaisses"
                      name="nbreCaisses"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.nbreCaisses}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="h-11 w-full sm:w-auto"
                >
                  <X className="size-4" />
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full bg-[#556B2F] font-semibold text-white hover:bg-[#465A27] disabled:opacity-60 sm:w-auto"
                >
                  <Save className="size-4" />
                  {isSubmitting
                    ? 'Enregistrement...'
                    : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white p-6 text-sm text-muted-foreground">
            Aucune saison à modifier. Vérifiez l’identifiant et l’API de liste.
          </div>
        )}
      </Container>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-[380px] rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#eef4e6]">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#556B2F]">
                  <Check className="size-5 text-white" />
                </div>
              </div>

              <h3
                id="success-title"
                className="text-lg font-semibold text-[#172033]"
              >
                Saison modifiée
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Le serveur a accepté la modification de la saison.
              </p>

              <Button
                type="button"
                onClick={() => navigate('/store-admin/saison')}
                className="mt-5 h-10 min-w-[100px] bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27]"
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