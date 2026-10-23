import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Banknote, CalendarDays, Check, Droplets, FileText, Hash,
  History, Package, Phone, Save, UserRound, Warehouse, X, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';


const API_BASE_URL = '/olive_app';

const API_GET_URL = `${API_BASE_URL}/reception/getId`;
const API_UPDATE_URL = `${API_BASE_URL}/reception/update`;
const ACCOUNT_HISTORY_URL = `${API_BASE_URL}/reception/getListMvtsCompte`;
  const COMPTE_BASE_FILTER_URL =
  `${API_BASE_URL}/reception/doCompteBaseFilter`;
const CRATES_URL = `${API_BASE_URL}/caisse`;
const GET_COMPTE_URL = `${API_BASE_URL}/reception/getCompte`;
const BASE_COMPTES_URL =
  `${API_BASE_URL}/reception/getListBonByCompteBase`;

const RECEPTION_LIST_URL = '/store-admin/reception-vouchers';

interface BonReception {
  id: number;
  reference: string;
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
  solde?: number;
  rendement?: number;
}

interface CompteBase {
  id?: number;
  compteId?: number;
  name?: string;
  mobile?: string;
  telephone?: string;
}

interface BaseComptesResponse {
  name?: string | null;
  quantityOil?: number;
  quantityOlive?: number;
  stock?: number;
  valueStock?: number;
  rendement?: number;
  nbreComptes?: number | null;
  listBean?: CompteBase[];
}

type FormData = {
  reference: string; compteId: string; name: string; mobile: string;
  quantityOil: string; quantityOlive: string; priceKg: string; price: string;
  payement: string; acompte: string; statusId: string; caisse: string;
  natureId: string; priceOil: string; observation: string; typeHuile: string;
  isBaseCompte: boolean; dateCreation: string; dateDebProduction: string;
  dateFinProduction: string;
};

type HistoryItem = {
  id?: number;
  reference?: string;
  compteId?: number;
  dateCreation?: string;
  date?: string;
  name?: string;
  mobile?: string;
  quantityOlive?: number;
  quantityOil?: number;
  price?: number;
  payement?: number | null;
  acompte?: number | null;
  solde?: number;
  rendement?: number;
  caisse?: string;
  statusLib?: string;
  statut?: string;
};

type BaseCompte = {
  id?: number;
  compteId?: number;
  name?: string;
  mobile?: string;
  telephone?: string;
  isBaseCompte?: boolean;
  [key: string]: unknown;
};

type Caisse = { id: number; number: number; selected: boolean };

const INITIAL_FORM: FormData = {
  reference: '', compteId: '', name: '', mobile: '', quantityOil: '', quantityOlive: '',
  priceKg: '', price: '', payement: '', acompte: '', statusId: '1', caisse: '',
  natureId: '1', priceOil: '', observation: '', typeHuile: '1', isBaseCompte: false,
  dateCreation: '', dateDebProduction: '', dateFinProduction: '',
};

const inputClass = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10';
const labelClass = 'mb-2 block text-sm font-medium text-slate-700';

function unwrapData<T>(data: any): T {
  return (data?.data ?? data?.result ?? data) as T;
}

function convertDateTimeToInput(value: unknown): string {
  if (!value) return '';

  const text = String(value).trim();

  const french = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (french) {
    const [, day, month, year, hour = '00', minute = '00'] = french;
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDateTimeForBackend(value: string): string {
  if (!value) return '';
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year} ${timePart.length === 5 ? `${timePart}:00` : timePart}`;
}

function statusLabel(statusId: string): string {
  const labels: Record<string, string> = {
    '1': 'En cours', '2': 'Terminé', '3': 'En attente', '4': 'Annulé',
    '5': 'Non Affecté', '6': 'Non Pesé', '7': 'Fin Prod', '8': 'Non Payé', '9': 'Validé',
  };
  return labels[statusId] ?? 'En cours';
}

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('fr-FR');
}

function Field({ label, name, value, onChange, type = 'text', required = false, min, step, icon, placeholder }: {
  label: string; name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; min?: string; step?: string; icon?: ReactNode; placeholder?: string;
}) {
  return <div>
    <label htmlFor={name} className={labelClass}>{label}{required && <span className="ml-1 text-red-500">*</span>}</label>
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} min={min} step={step} placeholder={placeholder} className={`${inputClass} ${icon ? 'pl-10' : ''}`} />
    </div>
  </div>;
}



export function ModifierBonReceptionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [historique, setHistorique] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [crates, setCrates] = useState<Caisse[]>(Array.from({ length: 91 }, (_, i) => ({ id: i + 1, number: i + 1, selected: false })));
  const [cratesError, setCratesError] = useState('');

  useEffect(() => {
    if (!id) { setError('Identifiant du bon de réception manquant.'); setLoading(false); return; }
    const controller = new AbortController();
    async function loadBon() {
      setLoading(true); setError('');
      try {
        const response = await fetch(`${API_GET_URL}/${encodeURIComponent(id!)}`, { headers: { Accept: 'application/json' }, signal: controller.signal });
        const body = await response.text();
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}${body ? ` : ${body}` : ''}`);
        if (!body) throw new Error('Le serveur n’a retourné aucune donnée.');
        const raw = JSON.parse(body);
        const bon = unwrapData<any>(raw);
        if (!bon || typeof bon !== 'object' || bon.id == null) throw new Error('Les données retournées ne correspondent pas à un bon de réception.');
        const caisseNumbers = String(bon.caisse ?? '').split(/[,;\s]+/).map((v: string) => Number(v)).filter((v: number) => Number.isFinite(v) && v > 0);
        setFormData({
  reference: String(bon.reference ?? ''),
  compteId: String(bon.compteId ?? ''),
  name: String(bon.name ?? ''),
  mobile: String(bon.mobile ?? ''),
  quantityOil: String(bon.quantityOil ?? ''),
  quantityOlive: String(bon.quantityOlive ?? ''),
  priceKg: String(bon.priceKg ?? ''),
  price: String(bon.price ?? ''),
  payement: String(bon.payement ?? '0'),
  acompte: String(bon.acompte ?? '0'),
  statusId: String(bon.statusId ?? '1'),
  caisse: caisseNumbers.join(', '),
  natureId: String(bon.natureId ?? '1'),
  priceOil: String(bon.priceOil ?? '0'),
  observation: String(bon.observation ?? ''),
  typeHuile: String(bon.typeHuile ?? '1'),
  isBaseCompte: bon.isBaseCompte === true ||
    bon.isBaseCompte === 1 ||
    bon.isBaseCompte === 'true',
  dateCreation: convertDateTimeToInput(bon.dateCreation),
  dateDebProduction: convertDateTimeToInput(bon.dateDebProduction),
  dateFinProduction: convertDateTimeToInput(bon.dateFinProduction),
});
        setCrates((current) => {
          const max = Math.max(91, ...caisseNumbers);
          const all = Array.from({ length: max }, (_, i) => i + 1);
          return all.map((number) => ({ id: number, number, selected: caisseNumbers.includes(number) }));
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Impossible de charger le bon de réception.');
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void loadBon();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function loadCrates() {
      try {
        const response = await fetch(CRATES_URL, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const result = unwrapData<any[]>(await response.json());
        if (cancelled || !Array.isArray(result) || result.length === 0) return;
        setCrates((current) => {
          const selected = new Set(current.filter((c) => c.selected).map((c) => c.number));
          const loaded = result.map((item, index) => {
            const number = Number(item.number ?? item.numero ?? item.caisse ?? item.id ?? index + 1);
            return { id: Number(item.id ?? number), number, selected: selected.has(number) || Boolean(item.selected ?? item.isSelected) };
          }).filter((c) => Number.isFinite(c.number) && c.number > 0);
          return loaded.length ? loaded : current;
        });
      } catch (err) { if (!cancelled) setCratesError(err instanceof Error ? `Impossible de charger les caisses depuis l’API : ${err.message}` : 'Impossible de charger les caisses.'); }
    }
    void loadCrates();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
  const controller = new AbortController();

  async function chargerComptesBase() {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const response = await fetch(
        `${COMPTE_BASE_FILTER_URL}?searche=`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        }
      );

      const body = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status} : ${body}`
        );
      }

      const raw = body.trim() ? JSON.parse(body) : [];
      console.log('Réponse doCompteBaseFilter :', raw);

      const result = unwrapData<unknown>(raw);

      const liste = Array.isArray(result)
        ? result
        : result &&
            typeof result === 'object' &&
            Array.isArray(
              (result as Record<string, unknown>).listBean
            )
          ? (result as { listBean: HistoryItem[] }).listBean
          : [];

      setHistorique(liste as HistoryItem[]);
    } catch (err) {
      if (controller.signal.aborted) return;

      setHistorique([]);
      setHistoryError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les comptes de base.'
      );
    } finally {
      if (!controller.signal.aborted) {
        setHistoryLoading(false);
      }
    }
  }

  void chargerComptesBase();

  return () => controller.abort();
}, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };
  const handleBaseCompteChange = (event: ChangeEvent<HTMLInputElement>) => setFormData((current) => ({ ...current, isBaseCompte: event.target.checked }));
  const toggleCaisse = (number: number) => setCrates((current) => current.map((crate) => crate.number === number ? { ...crate, selected: !crate.selected } : crate));
  const selectedCaisses = useMemo(() => crates.filter((c) => c.selected).map((c) => c.number).sort((a, b) => a - b), [crates]);

  useEffect(() => {
    const value = selectedCaisses.join(', ');
    setFormData((current) => current.caisse === value ? current : { ...current, caisse: value });
  }, [selectedCaisses]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) { setError('Identifiant du bon de réception manquant.'); return; }
    setSaving(true); setError('');
    const quantityOlive = Number(formData.quantityOlive || 0);
    const quantityOil = Number(formData.quantityOil || 0);
    const price = Number(formData.price || 0);
    const payement = Number(formData.payement || 0);
    const acompte = Number(formData.acompte || 0);
    const modifiedBon: BonReception = {
      id: Number(id), reference: formData.reference.trim(), compteId: Number(formData.compteId || 0), name: formData.name.trim(), mobile: formData.mobile.trim(),
      quantityOil, quantityOlive, priceKg: Number(formData.priceKg || 0), price, payement, acompte,
      statusId: formData.statusId, statusLib: statusLabel(formData.statusId), caisse: selectedCaisses.join(', '),
      natureId: Number(formData.natureId || 0), priceOil: Number(formData.priceOil || 0), observation: formData.observation.trim(),
      typeHuile: Number(formData.typeHuile || 0), isBaseCompte: formData.isBaseCompte,
      dateCreation: formatDateTimeForBackend(formData.dateCreation), dateDebProduction: formatDateTimeForBackend(formData.dateDebProduction), dateFinProduction: formatDateTimeForBackend(formData.dateFinProduction),
      solde: price - payement - acompte, rendement: quantityOlive > 0 ? (quantityOil / quantityOlive) * 100 : 0,
    };
    try {
      const response = await fetch(`${API_UPDATE_URL}/${encodeURIComponent(id)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(modifiedBon),
      });
      const body = await response.text();
      if (!response.ok) throw new Error(`Échec de la modification (HTTP ${response.status})${body ? ` : ${body}` : ''}`);
      setShowSuccessModal(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Impossible d’enregistrer les modifications.'); }
    finally { setSaving(false); }
  };

  const handleCancel = () => navigate(RECEPTION_LIST_URL);
  const handleSuccessOk = () => navigate(RECEPTION_LIST_URL);
  
const [accountLoading, setAccountLoading] = useState(false);
const [accountError, setAccountError] = useState('');
const [accountMessage, setAccountMessage] = useState('');

const [baseComptes, setBaseComptes] = useState<CompteBase[]>([]);
const [baseComptesLoading, setBaseComptesLoading] = useState(false);
const [baseComptesError, setBaseComptesError] = useState('');

const chargerCaissesDuCompte = async (compteId: string) => {
  try {
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

    const numeros = String(compte.caisse ?? '')
      .split(/[,;\s]+/)
      .map((value: string) => Number(value))
      .filter(
        (value: number) =>
          Number.isFinite(value) && value > 0
      );

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



const rechercherCompte = async (
  phoneInput: string = formData.mobile
) => {
  const phone = phoneInput.trim();

  if (!phone) {
    setAccountError('');
    setAccountMessage('');
    return;
  }

  // Accepter les chiffres et un éventuel + au début.
  if (!/^\+?\d+$/.test(phone)) {
    setAccountError('Le numéro contient des caractères invalides.');
    setAccountMessage('');
    return;
  }

  setAccountLoading(true);
  setAccountError('');
  setAccountMessage('');

  try {
    const response = await fetch(
      `${GET_COMPTE_URL}?phone=${encodeURIComponent(phone)}`,
      {
        headers: { Accept: 'application/json' },
      }
    );

    const body = await response.text();

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status}${body ? ` : ${body}` : ''}`
      );
    }

    if (!body.trim()) {
      setAccountError('Aucun compte trouvé pour ce numéro.');
      return;
    }

    const raw = JSON.parse(body);
    const result = unwrapData<any>(raw);

    const comptes = Array.isArray(result)
      ? result
      : result && typeof result === 'object'
        ? [result]
        : [];

    const normaliserNumero = (value: string) =>
      value.replace(/[\s().-]/g, '');

    const compte = comptes.find((item) => {
      if (!item || typeof item !== 'object') return false;

      const numeroRetourne = String(
        item.phone ?? item.mobile ?? item.telephone ?? ''
      ).trim();

      return (
        numeroRetourne !== '' &&
        normaliserNumero(numeroRetourne) === normaliserNumero(phone) &&
        (item.id != null || item.compteId != null)
      );
    });

    if (!compte) {
      setAccountError('Aucun compte trouvé pour ce numéro.');
      setAccountMessage('');
      return;
    }

    const compteId = String(compte.id ?? compte.compteId);

setFormData((current) => ({
  ...current,
  compteId,
  name: String(
    compte.name ?? compte.nom ?? compte.nomCompte ?? ''
  ),
  mobile: phone,
}));
await chargerCaissesDuCompte(compteId);
setAccountMessage('Compte retrouvé avec succès.');
setAccountError('');
  } catch (err) {
    setAccountError(
      err instanceof SyntaxError
        ? 'La réponse du serveur est invalide.'
        : err instanceof Error
          ? err.message
          : 'Impossible de rechercher le compte.'
    );
    setAccountMessage('');
  } finally {
    setAccountLoading(false);
  }
};



useEffect(() => {
  const phone = formData.mobile.trim();

  if (!phone) {
    setAccountError('');
    setAccountMessage('');
    return;
  }

  if (!/^\+?\d+$/.test(phone)) {
    setAccountError('Le numéro contient des caractères invalides.');
    setAccountMessage('');
    return;
  }

  const timer = setTimeout(() => {
    void rechercherCompte(phone);
  }, 500);

  return () => clearTimeout(timer);
}, [formData.mobile]);

// Charger les comptes de base associés au compte sélectionné.



useEffect(() => {
  const compteId = formData.compteId.trim();

  if (!compteId || Number(compteId) <= 0) {
    setBaseComptes([]);
    setBaseComptesError('');
    setBaseComptesLoading(false);
    return;
  }

  const controller = new AbortController();

  async function loadBaseComptes() {
    setBaseComptesLoading(true);
    setBaseComptesError('');

    try {
      const response = await fetch(
        `${BASE_COMPTES_URL}/${encodeURIComponent(compteId)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        }
      );

      const body = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}${body ? ` : ${body}` : ''}`
        );
      }

      const raw = body.trim() ? JSON.parse(body) : [];
      const result = unwrapData<unknown>(raw);

      let comptes: CompteBase[] = [];

      if (Array.isArray(result)) {
        comptes = result as CompteBase[];
      } else if (result && typeof result === 'object') {
        const data = result as BaseComptesResponse;
        comptes = Array.isArray(data.listBean)
          ? data.listBean
          : [];
      }

      if (!controller.signal.aborted) {
        setBaseComptes(comptes);
      }
    } catch (err) {
      if (controller.signal.aborted) return;

      setBaseComptes([]);
      setBaseComptesError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les données.'
      );
    } finally {
      if (!controller.signal.aborted) {
        setBaseComptesLoading(false);
      }
    }
  }

  void loadBaseComptes();

  return () => controller.abort();
}, [formData.compteId]);



  return <div className="mx-auto w-full max-w-6xl px-4 py-6">
    {loading && <p className="py-6 text-center text-sm text-slate-500">Chargement du bon de réception...</p>}
    {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-xl bg-[#556B2F]/10 text-[#556B2F]"><FileText className="size-6" /></div><div><h1 className="text-2xl font-bold tracking-tight text-slate-800">Modifier le bon de réception</h1><p className="mt-1 text-sm text-slate-500">Modifiez les informations puis enregistrez les changements.</p></div></div>
      <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="gap-2 border-[#A8C686] bg-[#E8F0DD] text-[#556B2F] hover:bg-[#D5E5C3] hover:text-[#3F5123]"
>
  <ArrowLeft className="size-4" />
  Retour à la liste
</Button>
    </div>

    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading || saving} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm disabled:opacity-90">
        <div className="border-b border-slate-100 px-6 py-5"><h2 className="font-bold text-slate-800">Informations du bon</h2><p className="mt-1 text-xs text-slate-500">Les champs marqués d’un astérisque sont obligatoires.</p></div>
        <div className="space-y-7 p-6">
          
<section>
  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
    <Hash className="size-4 text-[#556B2F]" />
    Identification
  </h3>

  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
    <Field
      label="Référence"
      name="reference"
      value={formData.reference}
      onChange={handleChange}
      required
      icon={<Hash className="size-4" />}
    />

    <Field
      label="ID du compte"
      name="compteId"
      value={formData.compteId}
      onChange={handleChange}
      type="number"
      min="1"
      required
      icon={<UserRound className="size-4" />}
    />

    <Field
      label="Nom du compte"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
      icon={<UserRound className="size-4" />}
    />

    {/* Téléphone avec recherche automatique */}
    <div>
      <label htmlFor="mobile" className={labelClass}>
        Téléphone
      </label>

      <Field
        label=""
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        type="tel"
        icon={<Phone className="size-4" />}
        placeholder="Saisir le numéro de téléphone"
      />

      {accountLoading && (
        <p className="mt-2 text-sm text-slate-500">
          Recherche du compte en cours...
        </p>
      )}

      {!accountLoading && accountError && (
        <p className="mt-2 text-sm text-red-600">
          {accountError}
        </p>
      )}

      {!accountLoading && accountMessage && (
        <p className="mt-2 text-sm text-[#556B2F]">
          {accountMessage}
        </p>
      )}
    </div>

    {/* Statut */}
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
        {[
          ['1', 'En cours'],
          ['2', 'Terminé'],
          ['3', 'En attente'],
          ['4', 'Annulé'],
          ['5', 'Non Affecté'],
          ['6', 'Non Pesé'],
          ['7', 'Fin Prod'],
          ['8', 'Non Payé'],
          ['9', 'Validé'],
        ].map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>

    {/* Compte de base */}
    <div className="flex items-end">
      <label className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4">
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


          <section className="border-t border-slate-100 pt-6"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800"><Droplets className="size-4 text-[#556B2F]" />Quantités et production</h3><div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <Field label="Olives (kg)" name="quantityOlive" value={formData.quantityOlive} onChange={handleChange} type="number" min="0" step="0.01" />
            <Field label="Huile (L)" name="quantityOil" value={formData.quantityOil} onChange={handleChange} type="number" min="0" step="0.01" />
            <Field label="Prix/kg (DT)" name="priceKg" value={formData.priceKg} onChange={handleChange} type="number" min="0" step="0.01" />
            <Field label="Prix de l'huile (DT/L)" name="priceOil" value={formData.priceOil} onChange={handleChange} type="number" min="0" step="0.01" />
            <div><label htmlFor="typeHuile" className={labelClass}>Type d'huile</label><select id="typeHuile" name="typeHuile" value={formData.typeHuile} onChange={handleChange} className={inputClass}><option value="1">Huile d'olive</option><option value="2">Huile d'olive extra vierge</option><option value="3">Autre</option></select></div>
            <div><label htmlFor="natureId" className={labelClass}>Nature</label><select id="natureId" name="natureId" value={formData.natureId} onChange={handleChange} className={inputClass}><option value="1">Production</option><option value="2">Fournisseur</option></select></div>
          </div></section>

          <section className="border-t border-slate-100 pt-6"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800"><Banknote className="size-4 text-[#556B2F]" />Prix et paiement</h3><div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <Field label="Prix total (DT)" name="price" value={formData.price} onChange={handleChange} type="number" min="0" step="0.01" />
            <Field label="Paiement (DT)" name="payement" value={formData.payement} onChange={handleChange} type="number" min="0" step="0.01" />
            <Field label="Acompte (DT)" name="acompte" value={formData.acompte} onChange={handleChange} type="number" min="0" step="0.01" />
            <div className="rounded-lg border border-[#e2e9d9] bg-[#f7f9f3] p-3"><span className="block text-xs text-slate-500">Solde calculé</span><strong className="mt-1 block text-lg text-[#556B2F]">{(Number(formData.price || 0) - Number(formData.payement || 0) - Number(formData.acompte || 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DT</strong></div>
          </div></section>

          <section className="border-t border-slate-100 pt-6"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800"><CalendarDays className="size-4 text-[#556B2F]" />Dates de production</h3><div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <Field label="Date de création" name="dateCreation" value={formData.dateCreation} onChange={handleChange} type="datetime-local" />
            <Field label="Début de production" name="dateDebProduction" value={formData.dateDebProduction} onChange={handleChange} type="datetime-local" />
            <Field label="Fin de production" name="dateFinProduction" value={formData.dateFinProduction} onChange={handleChange} type="datetime-local" />
          </div></section>

          <section className="border-t border-slate-100 pt-6"><label htmlFor="observation" className={labelClass}>Observation</label><div className="relative"><MessageSquare className="absolute left-3 top-3 size-4 text-slate-400" /><textarea id="observation" name="observation" value={formData.observation} onChange={handleChange} rows={3} placeholder="Ajoutez une observation..." className="w-full resize-y rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10" /></div></section>

          <section className="border-t border-slate-100 pt-6"><div className="mb-3 flex items-center gap-2"><Package className="size-4 text-[#556B2F]" /><h3 className="text-sm font-semibold text-slate-800">Caisses sélectionnées</h3><span className="ml-auto rounded-lg bg-[#556B2F]/10 px-3 py-1.5 text-xs font-semibold text-[#556B2F]">{selectedCaisses.length} sélectionnée(s)</span></div><input aria-label="Caisses sélectionnées" value={selectedCaisses.join(', ')} readOnly placeholder="Aucune caisse sélectionnée" className={`${inputClass} bg-slate-50`} /><div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-14">{crates.map((crate) => <button key={crate.id} type="button" aria-pressed={crate.selected} onClick={() => toggleCaisse(crate.number)} className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold transition ${crate.selected ? 'border-[#556B2F] bg-[#556B2F] text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#8DA56A] hover:bg-[#F4F8EF] hover:text-[#556B2F]'}`}>{crate.number}</button>)}</div><div className="mt-4 flex justify-end">
            <Button
  type="button"
  variant="outline"
  onClick={() =>
    setCrates((current) =>
      current.map((c) => ({ ...c, selected: false }))
    )
  }
  className="h-9 border-orange-300 bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800"
>
  Désélectionner tout
</Button>
            </div></section>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={handleCancel} disabled={saving} className="gap-2"><X className="size-4" />Annuler</Button><Button type="submit" disabled={loading || saving} className="gap-2 bg-[#556B2F] text-white hover:bg-[#465A27]"><Save className="size-4" />{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</Button></div>
      </fieldset>
    </form>
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
  <div className="border-b border-slate-100 px-6 py-5">
    <h2 className="text-sm font-bold text-slate-800">
      Comptes de base associés
    </h2>

    <p className="mt-1 text-xs text-slate-500">
      Comptes de base liés au compte {formData.compteId || '—'}.
    </p>
  </div>

  {baseComptesLoading && (
    <p className="p-5 text-sm text-slate-500">
      Chargement des comptes de base...
    </p>
  )}

  {!baseComptesLoading && baseComptesError && (
    <p role="alert" className="p-5 text-sm text-red-600">
      {baseComptesError}
    </p>
  )}

  {!baseComptesLoading &&
    !baseComptesError &&
    baseComptes.length === 0 && (
      <p className="p-5 text-sm text-slate-500">
        Aucun compte de base associé à ce compte.
      </p>
    )}

  {!baseComptesLoading &&
    !baseComptesError &&
    baseComptes.length > 0 && (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">ID</th>
              <th className="px-5 py-3 font-semibold">Nom du compte</th>
              <th className="px-5 py-3 font-semibold">Téléphone</th>
              <th className="px-5 py-3 font-semibold">Type</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {baseComptes.map((compte, index) => (
              <tr
                key={compte.compteId ?? compte.id ?? index}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-3 text-slate-600">
                  {compte.compteId ?? compte.id ?? '—'}
                </td>

                <td className="px-5 py-3 font-medium text-slate-700">
                  {compte.name ?? '—'}
                </td>

                <td className="px-5 py-3 text-slate-600">
                  {compte.mobile ?? compte.telephone ?? '—'}
                </td>

                <td className="px-5 py-3">
                  <span className="rounded-full bg-[#556B2F]/10 px-2.5 py-1 text-xs font-semibold text-[#556B2F]">
                    Compte de base
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
</section>

    
<section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
  <div className="border-b border-slate-100 px-6 py-5">
    <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
      <History className="size-4 text-[#556B2F]" />
      Historique du compte
    </h2>
    <p className="mt-1 text-xs text-slate-500">
      Bons de réception du compte {formData.name || formData.compteId || '—'}.
    </p>
  </div>

  {historyLoading && (
    <p className="p-5 text-sm text-slate-500">
      Chargement de l'historique...
    </p>
  )}

  {!historyLoading && historyError && (
    <p role="alert" className="p-5 text-sm text-red-600">
      {historyError}
    </p>
  )}

  {!historyLoading && !historyError && historique.length === 0 && (
    <p className="p-5 text-sm text-slate-500">
      Aucun bon de réception trouvé pour ce compte.
    </p>
  )}

  {!historyLoading && !historyError && historique.length > 0 && (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {[
              'Date',
              'Référence',
              'Olives (kg)',
              'Huile (L)',
              'Prix total',
              'Paiement',
              'Acompte',
              'Solde',
              'Rendement',
              'Caisses',
              'Statut',
            ].map((label) => (
              <th key={label} className="whitespace-nowrap px-4 py-3 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {historique.map((item, index) => (
            <tr
              key={item.id ?? item.reference ?? index}
              className="hover:bg-slate-50"
            >
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {item.dateCreation || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                {item.reference || '—'}
              </td>
              <td className="px-4 py-3">
                {item.quantityOlive ?? '—'}
              </td>
              <td className="px-4 py-3">
                {item.quantityOil ?? '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {item.price != null ? `${item.price} DT` : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {item.payement != null ? `${item.payement} DT` : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {item.acompte != null ? `${item.acompte} DT` : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#556B2F]">
                {item.solde != null ? `${item.solde} DT` : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {item.rendement != null ? `${item.rendement} %` : '—'}
              </td>
              <td className="px-4 py-3">
                {item.caisse || '—'}
              </td>
              <td className="px-4 py-3">
                {item.statusLib || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

    {showSuccessModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white px-7 py-7 text-center shadow-2xl"><div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#556B2F]/10"><Check className="size-7 text-[#556B2F]" /></div><h2 className="mt-4 text-base font-bold text-slate-800">Bon de réception modifié avec succès</h2><p className="mt-2 text-sm leading-6 text-slate-500">Les informations du bon ont été enregistrées.</p><Button type="button" onClick={handleSuccessOk} className="mt-6 h-10 w-full bg-[#556B2F] text-white hover:bg-[#465A27]">Retour à la liste</Button></div></div>}
  </div>;
}
