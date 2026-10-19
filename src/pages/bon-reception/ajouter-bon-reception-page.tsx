
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Hash,
  MessageSquare,
  Package,
  Phone,
  Save,
  User,
  UserRound,
  X,
  CheckCircle2,
  Factory,
  CreditCard,
  Scale,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

const API_BASE_URL = '/olive_app';

// Route de création fournie dans ton code.
const CREATE_RECEPTION_URL = `${API_BASE_URL}/reception/create`;

// À remplacer par les routes exactes de ton backend.
const ACCOUNT_BY_PHONE_URL = `${API_BASE_URL}/compte/telephone`;
const ACCOUNT_HISTORY_URL = `${API_BASE_URL}/reception/historique`;
const CRATES_URL = `${API_BASE_URL}/caisse`;

const RECEPTION_LIST_URL = '/store-admin/reception-vouchers';

interface Account {
  id?: number;
  compteId?: number;
  name?: string;
  mobile?: string;
  telephone?: string;
  email?: string;
  address?: string;
  adresse?: string;
  isBaseCompte?: boolean;
  [key: string]: unknown;
}

interface HistoryItem {
  id?: number;
  reference?: string;
  dateCreation?: string;
  utilisateur?: string;
  userName?: string;
  action?: string;
  details?: string;
  statusLib?: string;
  statut?: string;
  [key: string]: unknown;
}

interface Crate {
  id: number;
  number: number;
  selected: boolean;
}

const INITIAL_FORM = {
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
};

type FormData = typeof INITIAL_FORM;

function unwrapData<T>(responseData: any): T {
  return (responseData?.data ?? responseData?.result ?? responseData) as T;
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value?: string): string {
  if (!value) return '—';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString('fr-FR');
}

function statusLabel(statusId: string): string {
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
}

function statusStyle(status?: string) {
  const value = (status ?? '').toLowerCase();

  if (value.includes('valid') || value.includes('termin')) {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (value.includes('attente')) {
    return 'bg-violet-50 text-violet-700';
  }

  if (value.includes('pay')) {
    return 'bg-rose-50 text-rose-700';
  }

  if (value.includes('cours')) {
    return 'bg-cyan-50 text-cyan-700';
  }

  return 'bg-slate-100 text-slate-600';
}

export function AjouterBonReceptionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Recherche du compte par téléphone.
  const [account, setAccount] = useState<Account | null>(null);
  const [accountMessage, setAccountMessage] = useState('');
  const [searchingAccount, setSearchingAccount] = useState(false);
  const [accountSearchError, setAccountSearchError] = useState('');

  // Historique et caisses.
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [crates, setCrates] = useState<Crate[]>(
    Array.from({ length: 91 }, (_, index) => ({
      id: index + 1,
      number: index + 1,
      selected: false,
    })),
  );
  const [cratesLoading, setCratesLoading] = useState(false);
  const [cratesError, setCratesError] = useState('');

  const searchSequence = useRef(0);

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

  const handleBaseCompteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      isBaseCompte: event.target.checked,
    }));
  };

  // Recherche du compte dès que le numéro est suffisamment complet.
  useEffect(() => {
    const phone = formData.mobile.trim();
    const sequence = ++searchSequence.current;

    setAccount(null);
    setAccountMessage('');
    setAccountSearchError('');
    setHistory([]);
    setHistoryError('');

    if (phone.length < 6) {
      setSearchingAccount(false);
      setFormData((current) => ({
        ...current,
        compteId: '',
        name: '',
      }));
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setSearchingAccount(true);

      try {
        const response = await fetch(
          `${ACCOUNT_BY_PHONE_URL}/${encodeURIComponent(phone)}`,
          {
            headers: { Accept: 'application/json' },
          },
        );

        if (sequence !== searchSequence.current) return;

        if (response.status === 404) {
          setAccount(null);
          setAccountMessage(
            'Aucun compte trouvé pour ce numéro. Vérifie le téléphone ou crée le compte dans la page appropriée.',
          );
          setFormData((current) => ({
            ...current,
            compteId: '',
            name: '',
          }));
          return;
        }

        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}${text ? ` : ${text}` : ''}`,
          );
        }

        const raw = text ? JSON.parse(text) : null;
        const result = unwrapData<Account | null>(raw);

        if (!result || typeof result !== 'object') {
          setAccount(null);
          setAccountMessage('Aucun compte trouvé pour ce numéro.');
          return;
        }

        setAccount(result);
        setAccountMessage('Compte déjà enregistré : informations récupérées.');

        setFormData((current) => ({
          ...current,
          compteId: String(result.compteId ?? result.id ?? ''),
          name: String(result.name ?? ''),
          mobile: String(result.mobile ?? result.telephone ?? phone),
          isBaseCompte: Boolean(result.isBaseCompte ?? current.isBaseCompte),
        }));
      } catch (error) {
        if (sequence !== searchSequence.current) return;

        setAccountSearchError(
          error instanceof Error
            ? error.message
            : 'Impossible de rechercher ce numéro.',
        );
      } finally {
        if (sequence === searchSequence.current) {
          setSearchingAccount(false);
        }
      }
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [formData.mobile]);

  // Historique du compte trouvé.
  useEffect(() => {
    if (!account) {
      setHistory([]);
      return;
    }

    const accountId = account.compteId ?? account.id;
    if (accountId == null) return;

    let cancelled = false;

    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError('');

      try {
        const response = await fetch(
          `${ACCOUNT_HISTORY_URL}/${encodeURIComponent(String(accountId))}`,
          { headers: { Accept: 'application/json' } },
        );

        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}${text ? ` : ${text}` : ''}`,
          );
        }

        const raw = text ? JSON.parse(text) : [];
        const result = unwrapData<HistoryItem[]>(raw);

        if (!cancelled) {
          setHistory(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        if (!cancelled) {
          setHistoryError(
            error instanceof Error
              ? error.message
              : "Impossible de charger l'historique.",
          );
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [account]);

  // Chargement des caisses depuis le backend.
  // Si l'API n'est pas encore configurée, les 91 cases restent visibles.
  useEffect(() => {
    let cancelled = false;

    async function loadCrates() {
      setCratesLoading(true);
      setCratesError('');

      try {
        const response = await fetch(CRATES_URL, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const raw = await response.json();
        const result = unwrapData<any[]>(raw);

        if (!Array.isArray(result) || cancelled) return;

        const loaded = result
          .map((item, index) => {
            const number = Number(
              item.number ?? item.numero ?? item.caisse ?? item.id ?? index + 1,
            );

            return {
              id: Number(item.id ?? number),
              number,
              selected: Boolean(item.selected ?? item.isSelected),
            };
          })
          .filter((item) => Number.isFinite(item.number));

        if (loaded.length > 0) {
          setCrates(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setCratesError(
            error instanceof Error
              ? `Caisses affichées en mode local : ${error.message}`
              : 'Impossible de charger les caisses.',
          );
        }
      } finally {
        if (!cancelled) setCratesLoading(false);
      }
    }

    void loadCrates();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCrate = (number: number) => {
    setCrates((current) =>
      current.map((crate) =>
        crate.number === number
          ? { ...crate, selected: !crate.selected }
          : crate,
      ),
    );
  };

  const selectedCrates = crates.filter((crate) => crate.selected);

  // Enregistre les numéros de caisses dans le champ caisse.
  useEffect(() => {
    setFormData((current) => ({
      ...current,
      caisse: selectedCrates.map((crate) => crate.number).join(', '),
    }));
    // La sélection seule déclenche cette synchronisation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crates]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setApiError('');

    if (!formData.compteId) {
      setApiError(
        'Le compte doit être identifié par son numéro de téléphone avant la création du bon.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();

      const toDateOrNow = (value: string) => {
        if (!value) return now;

        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? now : date.toISOString();
      };

      const quantityOlive = toNumber(formData.quantityOlive);
      const quantityOil = toNumber(formData.quantityOil);
      const price = toNumber(formData.price);
      const payement = toNumber(formData.payement);
      const acompte = toNumber(formData.acompte);

      const payload = {
        id: 0,
        reference: formData.reference.trim(),
        compteId: Number(formData.compteId),
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        quantityOil,
        quantityOlive,
        priceKg: toNumber(formData.priceKg),
        price,
        payement,
        acompte,
        statusId: formData.statusId,
        statusLib: statusLabel(formData.statusId),
        caisse: selectedCrates.map((crate) => crate.number).join(', '),
        natureId: toNumber(formData.natureId),
        priceOil: toNumber(formData.priceOil),
        observation: formData.observation.trim(),
        typeHuile: toNumber(formData.typeHuile),
        isBaseCompte: formData.isBaseCompte,
        dateCreation: now,
        dateDebProduction: toDateOrNow(formData.dateDebProduction),
        dateFinProduction: toDateOrNow(formData.dateFinProduction),
        solde: price - payement - acompte,
        rendement: quantityOlive > 0 ? (quantityOil / quantityOlive) * 100 : 0,
      };

      const response = await fetch(CREATE_RECEPTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${
            responseText || "Le serveur a refusé la création."
          }`,
        );
      }

      setShowSuccessModal(true);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter le bon de réception.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate(RECEPTION_LIST_URL);

  return (
    <>
      <Container>
        <div className="py-5">
          <h1 className="text-2xl font-bold text-foreground">
            Ajouter un bon de réception
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Accueil</span>
            <span>/</span>
            <span>Bon de réception</span>
            <span>/</span>
            <span className="font-medium text-foreground">Ajouter</span>
          </div>
        </div>
      </Container>

      <Container>
        <form onSubmit={handleSubmit}>
          <div className="mx-auto w-full max-w-6xl rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-bold text-foreground">
                Informations du bon de réception
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Remplissez les informations du bon de réception.
              </p>
            </div>

            <div className="px-6 py-6">
              {apiError && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {apiError}
                </div>
              )}

              <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <div>
                  <label htmlFor="reference" className="mb-2 block text-sm font-medium text-foreground">
                    Référence *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      required
                      placeholder="Entrez la référence"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobile" className="mb-2 block text-sm font-medium text-foreground">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="Saisissez le numéro de téléphone"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                  {searchingAccount && (
                    <p className="mt-1 text-xs text-slate-500">Recherche du compte...</p>
                  )}
                  {accountMessage && (
                    <p className="mt-1 text-xs font-medium text-emerald-700">{accountMessage}</p>
                  )}
                  {accountSearchError && (
                    <p className="mt-1 text-xs text-red-600">{accountSearchError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="compteId" className="mb-2 block text-sm font-medium text-foreground">
                    ID du compte *
                  </label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="compteId"
                      name="compteId"
                      type="number"
                      min="1"
                      value={formData.compteId}
                      readOnly={Boolean(account)}
                      onChange={handleChange}
                      required
                      placeholder="Identifiant du compte"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Nom du compte
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nom du compte"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantityOlive" className="mb-2 block text-sm font-medium text-foreground">
                    Quantité d'olives (kg) *
                  </label>
                  <input
                    id="quantityOlive"
                    name="quantityOlive"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantityOlive}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="quantityOil" className="mb-2 block text-sm font-medium text-foreground">
                    Quantité d'huile (L)
                  </label>
                  <input
                    id="quantityOil"
                    name="quantityOil"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantityOil}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="priceKg" className="mb-2 block text-sm font-medium text-foreground">
                    Prix / kg (DT) *
                  </label>
                  <input
                    id="priceKg"
                    name="priceKg"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceKg}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="mb-2 block text-sm font-medium text-foreground">
                    Prix total (DT)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="payement" className="mb-2 block text-sm font-medium text-foreground">
                    Paiement (DT)
                  </label>
                  <input
                    id="payement"
                    name="payement"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.payement}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="acompte" className="mb-2 block text-sm font-medium text-foreground">
                    Acompte (DT)
                  </label>
                  <input
                    id="acompte"
                    name="acompte"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.acompte}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="statusId" className="mb-2 block text-sm font-medium text-foreground">
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
                    <option value="2">Terminé</option>
                    <option value="3">En attente</option>
                    <option value="4">Annulé</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="caisse" className="mb-2 block text-sm font-medium text-foreground">
                    Caisses sélectionnées
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="caisse"
                      name="caisse"
                      value={formData.caisse}
                      readOnly
                      placeholder="Sélectionnez les caisses ci-dessous"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="natureId" className="mb-2 block text-sm font-medium text-foreground">
                    Nature
                  </label>
                  <select
                    id="natureId"
                    name="natureId"
                    value={formData.natureId}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >
                    <option value="1">Production</option>
                    <option value="2">Fournisseur</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priceOil" className="mb-2 block text-sm font-medium text-foreground">
                    Prix de l'huile (DT/L)
                  </label>
                  <input
                    id="priceOil"
                    name="priceOil"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceOil}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="typeHuile" className="mb-2 block text-sm font-medium text-foreground">
                    Type d'huile
                  </label>
                  <select
                    id="typeHuile"
                    name="typeHuile"
                    value={formData.typeHuile}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >
                    <option value="1">Huile d'olive</option>
                    <option value="2">Huile d'olive extra vierge</option>
                    <option value="3">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateCreation" className="mb-2 block text-sm font-medium text-foreground">
                    Date de création
                  </label>
                  <input
                    id="dateCreation"
                    name="dateCreation"
                    type="datetime-local"
                    value={formData.dateCreation}
                    onChange={handleChange}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                <div>
                  <label htmlFor="dateDebProduction" className="mb-2 block text-sm font-medium text-foreground">
                    Début de production
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="dateDebProduction"
                      name="dateDebProduction"
                      type="datetime-local"
                      value={formData.dateDebProduction}
                      onChange={handleChange}
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dateFinProduction" className="mb-2 block text-sm font-medium text-foreground">
                    Fin de production
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="dateFinProduction"
                      name="dateFinProduction"
                      type="datetime-local"
                      value={formData.dateFinProduction}
                      onChange={handleChange}
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div className="flex items-center md:col-span-2">
                  <label className="flex h-11 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isBaseCompte}
                      onChange={handleBaseCompteChange}
                      className="size-4 accent-[#556B2F]"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Compte de base
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="observation" className="mb-2 block text-sm font-medium text-foreground">
                    Observation
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <textarea
                      id="observation"
                      name="observation"
                      value={formData.observation}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Ajoutez une observation..."
                      className="w-full resize-none rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[100px]"
              >
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || searchingAccount}
                className="h-10 min-w-[125px] bg-[#556B2F] hover:bg-[#465A27]"
              >
                <Save className="size-4" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </form>
      </Container>

      {/* HISTORIQUE DU COMPTE */}
      <Container>
        <div className="mx-auto mt-6 w-full max-w-6xl overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Clock3 className="size-4 text-[#556B2F]" />
            <h2 className="text-sm font-bold text-foreground">
              Historique du compte
            </h2>
          </div>

          {!account && (
            <p className="px-5 py-5 text-sm text-muted-foreground">
              Saisissez un numéro de téléphone correspondant à un compte pour afficher son historique.
            </p>
          )}

          {account && historyLoading && (
            <p className="px-5 py-5 text-sm text-muted-foreground">
              Chargement de l'historique...
            </p>
          )}

          {account && historyError && (
            <p className="px-5 py-4 text-sm text-red-600">{historyError}</p>
          )}

          {account && !historyLoading && !historyError && (
            <div className="overflow-x-auto p-4">
              {history.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Aucun historique disponible pour ce compte.
                </p>
              ) : (
                <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="border-b px-3 py-3">Date</th>
                      <th className="border-b px-3 py-3">Utilisateur</th>
                      <th className="border-b px-3 py-3">Action</th>
                      <th className="border-b px-3 py-3">Détails</th>
                      <th className="border-b px-3 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => {
                      const status = item.statusLib ?? item.statut ?? '';

                      return (
                        <tr key={item.id ?? index} className="hover:bg-slate-50">
                          <td className="border-b px-3 py-3">
                            {formatDate(item.dateCreation)}
                          </td>
                          <td className="border-b px-3 py-3">
                            {item.utilisateur ?? item.userName ?? '—'}
                          </td>
                          <td className="border-b px-3 py-3">
                            {item.action ?? '—'}
                          </td>
                          <td className="border-b px-3 py-3">
                            {item.details ?? item.reference ?? '—'}
                          </td>
                          <td className="border-b px-3 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${statusStyle(status)}`}>
                              {status || '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* SÉLECTION DES CAISSES */}
      <Container>
        <div className="mx-auto mt-6 mb-8 w-full max-w-6xl overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-[#556B2F]" />
              <h2 className="text-sm font-bold text-foreground">
                Sélectionnez les caisses
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {selectedCrates.length} sélectionnée(s)
            </span>
          </div>

          <div className="p-4">
            {cratesLoading && (
              <p className="mb-3 text-xs text-muted-foreground">
                Vérification des caisses...
              </p>
            )}

            {cratesError && (
              <p className="mb-3 text-xs text-amber-700">{cratesError}</p>
            )}

            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-14">
              {crates.map((crate) => (
                <button
                  key={crate.id}
                  type="button"
                  aria-pressed={crate.selected}
                  onClick={() => toggleCrate(crate.number)}
                  className={`flex h-7 items-center justify-center rounded-sm border text-xs font-semibold transition ${
                    crate.selected
                      ? 'border-[#3568d4] bg-[#3568d4] text-white shadow-sm'
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100'
                  }`}
                >
                  {crate.number}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Les numéros sélectionnés sont ajoutés au champ « Caisses sélectionnées » du formulaire.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setCrates((current) =>
                    current.map((crate) => ({ ...crate, selected: false })),
                  )
                }
                className="h-9"
              >
                Désélectionner tout
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* MODALE DE SUCCÈS */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="relative w-full max-w-[380px] rounded-lg bg-white px-7 py-5 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
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

            <h2 className="mt-3 text-sm font-bold text-gray-900">
              Bon de réception ajouté
            </h2>

            <p className="mt-2 text-xs text-gray-500">
              Le bon de réception a été ajouté avec succès.
            </p>

            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                onClick={() => navigate(RECEPTION_LIST_URL)}
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
