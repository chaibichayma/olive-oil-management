
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Droplet,
  FileText,
  Hash,
  MessageSquare,
  Package,
  Phone,
  Save,
  Scale,
  UserRound,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

const API_BASE_URL = '/olive_app';
const API_GET_URL = `${API_BASE_URL}/reception/getId`;
const BASE_BONS_URL =
  `${API_BASE_URL}/reception/getListBonByCompteBase`;

const CREATE_RECEPTION_URL = `${API_BASE_URL}/reception/create`;
const ACCOUNT_BY_PHONE_URL = `${API_BASE_URL}/reception/getCompte`;
const ACCOUNT_HISTORY_URL = `${API_BASE_URL}/reception/historique`;
const CRATES_URL = `${API_BASE_URL}/caisse`;

const RECEPTION_LIST_URL = '/store-admin/reception-vouchers';

const OLIVE = '#556B2F';

interface Account {
  id?: number;
  compteId?: number;
  name?: string;
  mobile?: string;
  telephone?: string;
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
}

interface BonBase {
  id?: number;
  reference?: string;
  name?: string;
  mobile?: string;
  dateCreation?: string;
  quantityOlive?: number;
  quantityOil?: number;
  price?: number;
  statusLib?: string;
  statut?: string;
  status?: string;
  [key: string]: unknown;
}

interface Crate {
  id: number;
  number: number;
  selected: boolean;
}

interface ReceptionForm {
  reference: string;
  compteId: string;
  name: string;
  mobile: string;
  quantityOlive: string;
  quantityOil: string;
  priceKg: string;
  price: string;
  payement: string;
  acompte: string;
  statusId: string;
  caisse: string;
  natureId: string;
  priceOil: string;
  observation: string;
  typeHuile: string;
  isBaseCompte: boolean;
  dateCreation: string;
  dateDebProduction: string;
  dateFinProduction: string;
}

const INITIAL_FORM: ReceptionForm = {
  reference: '',
  compteId: '',
  name: '',
  mobile: '',
  quantityOlive: '',
  quantityOil: '',
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

function unwrapData<T>(data: any): T {
  return (data?.data ?? data?.result ?? data) as T;
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isFinite(parsed) ? parsed : 0;
}

function toLocalDateTime(value?: string): string {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDate(value?: string): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('fr-FR');
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

function statusStyle(status?: string): string {
  const value = (status ?? '').toLowerCase();

  if (value.includes('termin') || value.includes('valid')) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  }

  if (value.includes('attente')) {
    return 'bg-violet-50 text-violet-700 ring-violet-200';
  }

  if (value.includes('annul')) {
    return 'bg-red-50 text-red-700 ring-red-200';
  }

  if (value.includes('cours')) {
    return 'bg-cyan-50 text-cyan-700 ring-cyan-200';
  }

  if (value.includes('pay')) {
    return 'bg-rose-50 text-rose-700 ring-rose-200';
  }

  return 'bg-slate-100 text-slate-600 ring-slate-200';
}

const inputClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10';

const labelClass =
  'mb-2 block text-sm font-medium text-slate-700';

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  min,
  step,
  readOnly = false,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
  readOnly?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={min}
          step={step}
          readOnly={readOnly}
          className={`${inputClass} ${icon ? 'pl-10' : ''} ${
            readOnly ? 'cursor-not-allowed bg-slate-50 text-slate-500' : ''
          }`}
        />
      </div>
    </div>
  );
}

export function AjouterBonReceptionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ReceptionForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [account, setAccount] = useState<Account | null>(null);
  const [accountMessage, setAccountMessage] = useState('');
  const [searchingAccount, setSearchingAccount] = useState(false);
  const [accountSearchError, setAccountSearchError] = useState('');
  const [bonsBase, setBonsBase] = useState<BonBase[]>([]);
  const [bonsBaseLoading, setBonsBaseLoading] = useState(false);
  const [bonsBaseError, setBonsBaseError] = useState('');

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedReception, setSavedReception] = useState<any>(null);

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
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleBaseCompteChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      isBaseCompte: event.target.checked,
    }));
  };

  // Recherche automatique du compte à partir du téléphone.
  
useEffect(() => {
  const phone = formData.mobile.trim();
  const sequence = ++searchSequence.current;

  setAccount(null);
  setAccountMessage('');
  setAccountSearchError('');
  setHistory([]);
  setHistoryError('');

  if (!phone) {
    setSearchingAccount(false);
    setFormData((current) => ({
      ...current,
      compteId: '',
      name: '',
    }));
    return;
  }

  if (!/^\+?\d+$/.test(phone)) {
    setSearchingAccount(false);
    setAccountSearchError(
      'Le numéro contient des caractères invalides.'
    );
    setFormData((current) => ({
      ...current,
      compteId: '',
      name: '',
    }));
    return;
  }

  if (phone.replace(/\D/g, '').length < 6) {
    setSearchingAccount(false);
    return;
  }

  const timeoutId = window.setTimeout(async () => {
    setSearchingAccount(true);

    try {
      const response = await fetch(
        `${ACCOUNT_BY_PHONE_URL}?phone=${encodeURIComponent(phone)}`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      if (sequence !== searchSequence.current) return;

      const responseText = await response.text();

      if (!response.ok) {
        if (response.status === 404) {
          setAccount(null);
          setAccountMessage(
            'Aucun compte trouvé pour ce numéro.'
          );
          setFormData((current) => ({
            ...current,
            compteId: '',
            name: '',
          }));
          return;
        }

        throw new Error(
          `Erreur HTTP ${response.status}${
            responseText ? ` : ${responseText}` : ''
          }`
        );
      }

      if (!responseText.trim()) {
        setAccount(null);
        setAccountMessage(
          'Aucun compte trouvé pour ce numéro.'
        );
        return;
      }

      const raw = JSON.parse(responseText);
      const result = unwrapData<any>(raw);

      const comptes = Array.isArray(result)
        ? result
        : result && typeof result === 'object'
          ? [result]
          : [];

      const normaliserNumero = (value: string) =>
        value.replace(/[\s().-]/g, '');

      const found = comptes.find((item: any) => {
        if (!item || typeof item !== 'object') return false;

        const returnedPhone = String(
          item.phone ?? item.mobile ?? item.telephone ?? ''
        ).trim();

        const id = item.id ?? item.compteId;

        return (
          returnedPhone !== '' &&
          normaliserNumero(returnedPhone) === normaliserNumero(phone) &&
          id != null
        );
      });

      if (!found) {
        setAccount(null);
        setAccountMessage(
          'Aucun compte trouvé pour ce numéro.'
        );
        setFormData((current) => ({
          ...current,
          compteId: '',
          name: '',
        }));
        return;
      }

      const accountId = found.compteId ?? found.id;

      const matchedAccount: Account = {
        ...found,
        id: found.id ?? accountId,
        compteId: accountId,
        name: found.name ?? found.nom ?? found.nomCompte ?? '',
        mobile:
          found.phone ?? found.mobile ?? found.telephone ?? phone,
      };

      setAccount(matchedAccount);

setFormData((current) => ({
  ...current,
  compteId: String(accountId),
  name: String(matchedAccount.name ?? ''),
  isBaseCompte: Boolean(
    found.isBaseCompte ?? current.isBaseCompte
  ),
}));

// Récupérer et sélectionner les caisses du compte trouvé.
await chargerCaissesDuCompte(String(accountId));

setAccountMessage('Compte retrouvé avec succès.');
setAccountSearchError('');
    } catch (error) {
      if (sequence !== searchSequence.current) return;

      setAccount(null);
      setAccountSearchError(
        error instanceof SyntaxError
          ? 'La réponse du serveur est invalide.'
          : error instanceof Error
            ? error.message
            : 'Impossible de rechercher ce numéro.'
      );
      setAccountMessage('');
    } finally {
      if (sequence === searchSequence.current) {
        setSearchingAccount(false);
      }
    }
  }, 500);

  return () => window.clearTimeout(timeoutId);
}, [formData.mobile]);


  // Historique du compte.
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

        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}${
              responseText ? ` : ${responseText}` : ''
            }`,
          );
        }

        const raw = responseText ? JSON.parse(responseText) : [];
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

  // Chargement des caisses.
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
              item.number ??
                item.numero ??
                item.caisse ??
                item.id ??
                index + 1,
            );

            return {
              id: Number(item.id ?? number),
              number,
              selected: Boolean(item.selected ?? item.isSelected),
            };
          })
          .filter((item) => Number.isFinite(item.number));

        if (loaded.length > 0) setCrates(loaded);
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

  
const chargerCaissesDuCompte = async (compteId: string) => {
  try {
    // Récupérer les informations du compte
    const response = await fetch(
      `${API_GET_URL}/${encodeURIComponent(compteId)}`,
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const raw = await response.json();
    const compte = unwrapData<any>(raw);

    // Récupérer les numéros des caisses, comme dans Modifier
    const numeros = String(compte.caisse ?? '')
      .split(/[,;\s]+/)
      .map((value: string) => Number(value))
      .filter(
        (value: number) =>
          Number.isFinite(value) && value > 0
      );

    // Sélectionner les caisses correspondantes
    setCrates((current) => {
      const max = Math.max(
        91,
        ...current.map((c) => c.number),
        ...numeros
      );

      const numerosSelectionnes = new Set(numeros);

      return Array.from({ length: max }, (_, index) => {
        const number = index + 1;

        return {
          id: number,
          number,
          selected: numerosSelectionnes.has(number),
        };
      });
    });
  } catch (err) {
    console.error(
      'Erreur lors du chargement des caisses du compte :',
      err
    );
  }
};


  const selectedCrates = crates.filter((crate) => crate.selected);

  useEffect(() => {
    const caisse = selectedCrates
      .map((crate) => crate.number)
      .join(', ');

    setFormData((current) =>
      current.caisse === caisse ? current : { ...current, caisse },
    );
    // La synchronisation dépend de la sélection des caisses.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crates]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (isSubmitting) return;

  setApiError('');

  if (!formData.compteId) {
    setApiError(
      'Le compte doit être identifié par son numéro de téléphone avant la création du bon.',
    );
    return;
  }

  setShowConfirmModal(true);
};

const handleConfirmSave = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  setApiError('');

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
      quantityOlive,
      quantityOil,
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
      dateCreation: toDateOrNow(formData.dateCreation),
      dateDebProduction: toDateOrNow(formData.dateDebProduction),
      dateFinProduction: toDateOrNow(formData.dateFinProduction),
      solde: price - payement - acompte,
      rendement:
        quantityOlive > 0 ? (quantityOil / quantityOlive) * 100 : 0,
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

    setSavedReception(payload);
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  } catch (error) {
    setShowConfirmModal(false);
    setApiError(
      error instanceof Error
        ? error.message
        : "Impossible d'ajouter le bon de réception.",
    );
  } finally {
    setIsSubmitting(false);
  }
};

const handlePrintReception = () => {
  if (!savedReception) return;

  const receipt = savedReception;

  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    setApiError(
      "L'impression a été bloquée par le navigateur. Autorisez les fenêtres contextuelles puis réessayez.",
    );
    return;
  }

  const escapeHtml = (value: unknown) =>
    String(value ?? '—').replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };

      return entities[char];
    });

  const money = (value: number) =>
    `${Number(value || 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} DT`;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Bon de réception ${escapeHtml(receipt.reference)}</title>
        <style>
          @page { size: A4; margin: 18mm; }

          * { box-sizing: border-box; }

          body {
            font-family: Arial, sans-serif;
            color: #273126;
            font-size: 12px;
            line-height: 1.5;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #556B2F;
            padding-bottom: 18px;
            margin-bottom: 25px;
          }

          .brand {
            color: #556B2F;
            font-size: 25px;
            font-weight: 700;
          }

          .subtitle { color: #64705d; margin-top: 4px; }

          h1 {
            font-size: 21px;
            margin: 0;
            color: #33421f;
          }

          h2 {
            font-size: 13px;
            color: #556B2F;
            margin: 22px 0 9px;
            text-transform: uppercase;
          }

          .reference {
            text-align: right;
            font-size: 12px;
          }

          .reference strong {
            display: block;
            font-size: 16px;
            margin-top: 5px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .item {
            border: 1px solid #e1e6db;
            border-radius: 6px;
            padding: 10px;
          }

          .label {
            display: block;
            color: #71806a;
            font-size: 10px;
            margin-bottom: 4px;
          }

          .value { font-weight: 600; }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }

          th, td {
            border: 1px solid #dce3d5;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #f2f6ed;
            color: #43552b;
          }

          .total {
            margin-top: 18px;
            margin-left: auto;
            width: 260px;
          }

          .total div {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
          }

          .balance {
            border-top: 2px solid #556B2F;
            color: #43552b;
            font-weight: 700;
            font-size: 14px;
          }

          .observation {
            border: 1px solid #e1e6db;
            padding: 12px;
            min-height: 45px;
            white-space: pre-wrap;
          }

          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 55px;
          }

          .signature {
            border-top: 1px solid #9aa58f;
            padding-top: 8px;
            text-align: center;
          }

          footer {
            position: fixed;
            bottom: -8mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #7b8574;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <div>
            <div class="brand">OLIVA</div>
            <div class="subtitle">Gestion de la production oléicole</div>
          </div>

          <div class="reference">
            <h1>BON DE RÉCEPTION</h1>
            Référence
            <strong>${escapeHtml(receipt.reference)}</strong>
          </div>
        </div>

        <h2>Identification du compte</h2>

        <div class="grid">
          <div class="item">
            <span class="label">Nom du compte</span>
            <span class="value">${escapeHtml(receipt.name)}</span>
          </div>

          <div class="item">
            <span class="label">Téléphone</span>
            <span class="value">${escapeHtml(receipt.mobile)}</span>
          </div>

          <div class="item">
            <span class="label">Identifiant du compte</span>
            <span class="value">${escapeHtml(receipt.compteId)}</span>
          </div>

          <div class="item">
            <span class="label">Date de création</span>
            <span class="value">${escapeHtml(formatDate(receipt.dateCreation))}</span>
          </div>
        </div>

        <h2>Quantités réceptionnées</h2>

        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Montant</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Olives</td>
              <td>${escapeHtml(receipt.quantityOlive)} kg</td>
              <td>${escapeHtml(money(receipt.priceKg))}</td>
              <td>${escapeHtml(money(receipt.price))}</td>
            </tr>

            <tr>
              <td>Huile d'olive</td>
              <td>${escapeHtml(receipt.quantityOil)} L</td>
              <td>${escapeHtml(money(receipt.priceOil))}</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <h2>Production et logistique</h2>

        <div class="grid">
          <div class="item">
            <span class="label">Statut</span>
            <span class="value">${escapeHtml(statusLabel(String(receipt.statusId)))}</span>
          </div>

          <div class="item">
            <span class="label">Caisses sélectionnées</span>
            <span class="value">${escapeHtml(receipt.caisse || 'Aucune')}</span>
          </div>

          <div class="item">
            <span class="label">Début de production</span>
            <span class="value">${escapeHtml(formatDate(receipt.dateDebProduction))}</span>
          </div>

          <div class="item">
            <span class="label">Fin de production</span>
            <span class="value">${escapeHtml(formatDate(receipt.dateFinProduction))}</span>
          </div>
        </div>

        <div class="total">
          <div><span>Prix total</span><strong>${escapeHtml(money(receipt.price))}</strong></div>
          <div><span>Paiement</span><strong>${escapeHtml(money(receipt.payement))}</strong></div>
          <div><span>Acompte</span><strong>${escapeHtml(money(receipt.acompte))}</strong></div>
          <div class="balance"><span>Solde</span><strong>${escapeHtml(money(receipt.solde))}</strong></div>
        </div>

        <h2>Observation</h2>
        <div class="observation">${escapeHtml(receipt.observation || 'Aucune observation')}</div>

        <div class="signatures">
          <div class="signature">Signature du réceptionnaire</div>
          <div class="signature">Signature du client</div>
        </div>

        <footer>OLIVA — Bon de réception · Document généré le ${escapeHtml(new Date().toLocaleString('fr-FR'))}</footer>

        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
          window.onafterprint = function () {
            window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

// Récupérer les bons associés au compte de base.
useEffect(() => {
  const compteId = account?.compteId ?? account?.id;

  if (compteId == null) {
    setBonsBase([]);
    setBonsBaseError('');
    setBonsBaseLoading(false);
    return;
  }

  let cancelled = false;

  async function chargerBonsBase() {
    setBonsBaseLoading(true);
    setBonsBaseError('');

    try {
      const response = await fetch(
        `${BASE_BONS_URL}/${encodeURIComponent(String(compteId))}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}${
            responseText ? ` : ${responseText}` : ''
          }`,
        );
      }

      const raw = responseText.trim()
        ? JSON.parse(responseText)
        : [];

      const result = unwrapData<any>(raw);

      let liste: BonBase[] = [];

      if (Array.isArray(result)) {
        liste = result;
      } else if (result && typeof result === 'object') {
        if (Array.isArray(result.listBean)) {
          liste = result.listBean;
        } else if (Array.isArray(result.content)) {
          liste = result.content;
        } else if (Array.isArray(result.data)) {
          liste = result.data;
        } else if (
          result.id != null ||
          result.reference != null
        ) {
          liste = [result];
        }
      }

      if (!cancelled) {
        setBonsBase(liste);
      }
    } catch (error) {
      if (!cancelled) {
        setBonsBase([]);
        setBonsBaseError(
          error instanceof Error
            ? error.message
            : 'Impossible de récupérer les bons associés.',
        );
      }
    } finally {
      if (!cancelled) {
        setBonsBaseLoading(false);
      }
    }
  }

  void chargerBonsBase();

  return () => {
    cancelled = true;
  };
}, [account]);

  const handleCancel = () => navigate(RECEPTION_LIST_URL);

  return (
    <>
      {/* HEADER */}
      <Container>
        <div className="pb-6 pt-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>

              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#556B2F]/10 text-[#556B2F]">
                  <FileText className="size-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                    Ajouter un bon de réception
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Créez un bon et renseignez les informations de réception.
                  </p>
                </div>
              </div>
            </div>

            <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="h-10 gap-2 self-start rounded-lg border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-medium text-[#556B2F] transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
>
  <ArrowLeft className="size-4" />
  Retour à la liste
</Button>
          </div>

          <div className="mt-6 h-px bg-slate-200" />
        </div>
      </Container>

      {/* FORMULAIRE */}
      <Container>
        <form onSubmit={handleSubmit} className="pb-6">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#556B2F]/10 text-[#556B2F]">
                <FileText className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Informations du bon
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Les champs marqués d’un astérisque sont obligatoires.
                </p>
              </div>
            </div>

            <div className="space-y-7 p-6">
              {apiError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {apiError}
                </div>
              )}

              {/* Référence et compte */}
              <section>
                <h3 className="mb-4 text-sm font-semibold text-slate-800">
                  Identification
                </h3>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <Field
                    label="Référence"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    required
                    placeholder="Ex. BR-2026-001"
                    icon={<Hash className="size-4" />}
                  />

                  <div>
                    <Field
                      label="Téléphone du compte"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      type="tel"
                      required
                      placeholder="Saisissez le numéro de téléphone"
                      icon={<Phone className="size-4" />}
                    />

                    {searchingAccount && (
                      <p className="mt-1.5 text-xs text-slate-500">
                        Recherche du compte...
                      </p>
                    )}

                    {accountMessage && (
                      <p className="mt-1.5 text-xs font-medium text-emerald-700">
                        {accountMessage}
                      </p>
                    )}

                    {accountSearchError && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {accountSearchError}
                      </p>
                    )}
                  </div>

                  <Field
                    label="ID du compte"
                    name="compteId"
                    value={formData.compteId}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    required
                    readOnly={Boolean(account)}
                    placeholder="Identifiant du compte"
                    icon={<UserRound className="size-4" />}
                  />

                  <Field
                    label="Compte"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom du compte"
                    icon={<UserRound className="size-4" />}
                  />

                  <div className="flex items-center md:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={formData.isBaseCompte}
                        onChange={handleBaseCompteChange}
                        className="size-4 accent-[#556B2F]"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Compte de base
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              <div className="h-px bg-slate-100" />

              {/* Quantités */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Scale className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Quantités réceptionnées
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <Field
                    label="Olives (kg)"
                    name="quantityOlive"
                    value={formData.quantityOlive}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0,00"
                  />

                  <Field
                    label="Huile (L)"
                    name="quantityOil"
                    value={formData.quantityOil}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                  />
                </div>
              </section>

              <div className="h-px bg-slate-100" />

              {/* Prix et paiement */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Prix et paiement
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <Field
                    label="Prix/kg (DT)"
                    name="priceKg"
                    value={formData.priceKg}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0,00"
                  />

                  <Field
                    label="Prix total (DT)"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                  />

                  <Field
                    label="Paiement (DT)"
                    name="payement"
                    value={formData.payement}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                  />

                  <Field
                    label="Acompte (DT)"
                    name="acompte"
                    value={formData.acompte}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                  />

                  <Field
                    label="Prix de l'huile (DT/L)"
                    name="priceOil"
                    value={formData.priceOil}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                  />
                </div>
              </section>

              <div className="h-px bg-slate-100" />

              {/* Informations de production */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Droplet className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Production et statut
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="statusId" className={labelClass}>
                      Statut <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="statusId"
                      name="statusId"
                      value={formData.statusId}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="1">En cours</option>
                      <option value="2">Terminé</option>
                      <option value="3">En attente</option>
                      <option value="4">Annulé</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="natureId" className={labelClass}>
                      Nature
                    </label>
                    <select
                      id="natureId"
                      name="natureId"
                      value={formData.natureId}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="1">Production</option>
                      <option value="2">Fournisseur</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="typeHuile" className={labelClass}>
                      Type d'huile
                    </label>
                    <select
                      id="typeHuile"
                      name="typeHuile"
                      value={formData.typeHuile}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="1">Huile d'olive</option>
                      <option value="2">Huile d'olive extra vierge</option>
                      <option value="3">Autre</option>
                    </select>
                  </div>

                  <Field
                    label="Date de création"
                    name="dateCreation"
                    value={formData.dateCreation}
                    onChange={handleChange}
                    type="datetime-local"
                    icon={<CalendarDays className="size-4" />}
                  />

                  <Field
                    label="Début de production"
                    name="dateDebProduction"
                    value={formData.dateDebProduction}
                    onChange={handleChange}
                    type="datetime-local"
                    icon={<CalendarDays className="size-4" />}
                  />

                  <Field
                    label="Fin de production"
                    name="dateFinProduction"
                    value={formData.dateFinProduction}
                    onChange={handleChange}
                    type="datetime-local"
                    icon={<CalendarDays className="size-4" />}
                  />

                  <div className="md:col-span-2">
                    <label htmlFor="observation" className={labelClass}>
                      Observation
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 size-4 text-slate-400" />
                      <textarea
                        id="observation"
                        name="observation"
                        value={formData.observation}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Ajoutez une observation..."
                        className="w-full resize-y rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Caisses sélectionnées */}
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Package className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Caisses sélectionnées
                  </h3>
                </div>

                <input
                  id="caisse"
                  name="caisse"
                  value={formData.caisse}
                  readOnly
                  placeholder="Sélectionnez les caisses dans la section ci-dessous"
                  className={`${inputClass} cursor-not-allowed bg-slate-50`}
                />
              </section>
              {/* BONS ASSOCIÉS AU COMPTE DE BASE */}
<section className="rounded-xl border border-slate-200 bg-white p-5">
  <div className="mb-4 flex items-center justify-between gap-3">
    <div>
      <h3 className="text-sm font-semibold text-slate-800">
        Bons associés au compte de base
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Bons récupérés depuis le compte identifié.
      </p>
    </div>

    <span className="rounded-lg bg-[#556B2F]/10 px-3 py-1.5 text-xs font-semibold text-[#556B2F]">
      {bonsBase.length} bon(s)
    </span>
  </div>

  {!account && (
    <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
      Saisissez un numéro de téléphone correspondant à un compte
      pour afficher ses bons associés.
    </p>
  )}

  {account && bonsBaseLoading && (
    <p className="py-4 text-sm text-slate-500">
      Chargement des bons associés...
    </p>
  )}

  {account && bonsBaseError && (
    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {bonsBaseError}
    </p>
  )}

  {account &&
    !bonsBaseLoading &&
    !bonsBaseError &&
    bonsBase.length === 0 && (
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Aucun bon associé trouvé pour ce compte.
      </p>
    )}

  {account && bonsBase.length > 0 && (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Référence</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Olives (kg)</th>
            <th className="px-4 py-3 font-semibold">Huile (L)</th>
            <th className="px-4 py-3 font-semibold">Prix (DT)</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {bonsBase.map((bon, index) => (
            <tr
              key={bon.id ?? bon.reference ?? index}
              className="transition hover:bg-slate-50"
            >
              <td className="px-4 py-3 text-slate-600">
                {bon.id ?? '—'}
              </td>

              <td className="px-4 py-3 font-medium text-slate-800">
                {bon.reference ?? '—'}
              </td>

              <td className="px-4 py-3 text-slate-600">
                {formatDate(bon.dateCreation)}
              </td>

              <td className="px-4 py-3 text-slate-600">
                {bon.quantityOlive ?? '—'}
              </td>

              <td className="px-4 py-3 text-slate-600">
                {bon.quantityOil ?? '—'}
              </td>

              <td className="px-4 py-3 text-slate-600">
                {bon.price ?? '—'}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle(
                    String(
                      bon.statusLib ??
                        bon.statut ??
                        bon.status ??
                        '',
                    ),
                  )}`}
                >
                  {String(
                    bon.statusLib ??
                      bon.statut ??
                      bon.status ??
                      'Non renseigné',
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 gap-2 rounded-lg border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <X className="size-4" />
                Annuler
              </Button>

              <Button
  type="submit"
  disabled={isSubmitting || searchingAccount}
  className="h-10 gap-2 rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#465A27] disabled:opacity-60"
>
  <Save className="size-4" />
  Enregistrer le bon
</Button>
            </div>
          </div>
        </form>
      </Container>

      
      {/* SÉLECTION DES CAISSES */}
      <Container>
        <section className="mx-auto mb-8 w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#556B2F]/10 text-[#556B2F]">
                <Package className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Sélection des caisses
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Cliquez sur les numéros à associer au bon.
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-[#556B2F]/10 px-3 py-1.5 text-xs font-semibold text-[#556B2F]">
              {selectedCrates.length} sélectionnée(s)
            </span>
          </div>

          <div className="p-4">
            

            <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-14">
              {crates.map((crate) => (
                <button
                  key={crate.id}
                  type="button"
                  aria-pressed={crate.selected}
                  onClick={() => toggleCrate(crate.number)}
                  className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold transition ${
                    crate.selected
                      ? 'border-[#556B2F] bg-[#556B2F] text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#8DA56A] hover:bg-[#F4F8EF] hover:text-[#556B2F]'
                  }`}
                >
                  {crate.number}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Les numéros sélectionnés sont automatiquement ajoutés au formulaire.
              </p>

              <Button
  type="button"
  variant="outline"
  onClick={() =>
    setCrates((current) =>
      current.map((crate) => ({
        ...crate,
        selected: false,
      })),
    )
  }
  className="h-9 rounded-lg border-[#F2D5B8] bg-[#FFF5EB] px-4 text-xs font-medium text-[#C76B20] transition-colors hover:border-[#EBC49B] hover:bg-[#FCE8D5] hover:text-[#A95616]"
>
  Désélectionner tout
</Button>
            </div>
          </div>
        </section>
      </Container>

      {/* MODALE DE SUCCÈS */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="relative w-full max-w-sm rounded-2xl border border-slate-100 bg-white px-7 py-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#556B2F]/10">
              <CheckCircle2 className="size-7 text-[#556B2F]" />
            </div>

            <h2 id="success-title" className="mt-4 text-base font-bold text-slate-800">
              Bon de réception ajouté
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Le bon de réception a été enregistré avec succès.
            </p>

            <Button
              type="button"
              onClick={() => navigate(RECEPTION_LIST_URL)}
              className="mt-6 h-10 w-full rounded-lg bg-[#556B2F] text-sm font-semibold text-white hover:bg-[#465A27]"
            >
              Retour à la liste
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
