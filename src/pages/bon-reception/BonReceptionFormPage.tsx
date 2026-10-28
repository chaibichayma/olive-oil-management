
import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  FileText,
  Home,
  ChevronRight,
  ClipboardCheck,
} from 'lucide-react';

const API_BASE_URL = '/olive_app';

interface BonReceptionFormPageProps {
  mode: 'add' | 'edit';
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
  caisse: number[];
  natureId: string;
  priceOil: string;
  observation: string;
  typeHuile: string;
  isBaseCompte: boolean;
  dateCreation: string;
  dateDebProduction: string;
  dateFinProduction: string;
}

const createEmptyForm = (): ReceptionForm => ({
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
  caisse: [],
  natureId: '1',
  priceOil: '',
  observation: '',
  typeHuile: '1',
  isBaseCompte: false,
  dateCreation: new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16),
  dateDebProduction: '',
  dateFinProduction: '',
});

function toNumber(value: string | number | undefined): number {
  if (value === undefined || value === '') return 0;

  const result = Number(String(value).replace(',', '.'));
  return Number.isFinite(result) ? result : 0;
}

function toLocalDateTime(value: unknown): string {
  if (!value) return '';

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 16);
  }

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );

  return localDate.toISOString().slice(0, 16);
}

function normalizeResponse(data: any): any {
  if (data?.data !== undefined) return data.data;
  if (data?.result !== undefined) return data.result;
  return data;
}

async function readResponse(response: Response): Promise<any> {
  const text = await response.text();
  let data: any = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Erreur HTTP ${response.status}`,
    );
  }

  return normalizeResponse(data);
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#71823c] focus:ring-2 focus:ring-[#71823c]/20"
      />
    </label>
  );
}

export default function BonReceptionFormPage({
  mode,
}: BonReceptionFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState<ReceptionForm>(createEmptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [accountSearchLoading, setAccountSearchLoading] = useState(false);
  const [accountSearchMessage, setAccountSearchMessage] = useState('');
  const [accountFound, setAccountFound] = useState(false);

  // Empêche une ancienne réponse de remplacer le résultat de la saisie actuelle.
  const accountRequestRef = useRef(0);
  const phoneToCheckRef = useRef('');

  

  const updateField = <K extends keyof ReceptionForm>(
    field: K,
    value: ReceptionForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Charger le bon en mode modification.
  useEffect(() => {
    if (!isEdit) {
      setForm(createEmptyForm());
      setLoading(false);
      setError('');
      return;
    }

    if (!id) {
      setError("L'identifiant du bon de réception est manquant.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadReception() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `${API_BASE_URL}/reception/getId/${encodeURIComponent(id!)}`,
          {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          },
        );

        const result = await readResponse(response);
        const bon = Array.isArray(result) ? result[0] : result;

        if (!bon || typeof bon !== 'object') {
          throw new Error('Bon de réception introuvable.');
        }

        const rawCrates =
          bon.caisse ?? bon.caisses ?? bon.crates ?? '';

        const selectedCrates: number[] = Array.isArray(rawCrates)
          ? rawCrates.map((item: any) =>
              typeof item === 'object'
                ? Number(item.number ?? item.id)
                : Number(item),
            )
          : String(rawCrates)
              .split(/[,;\s]+/)
              .filter(Boolean)
              .map(Number);

        const mobile = String(bon.mobile ?? bon.phone ?? '');

        phoneToCheckRef.current = mobile;

        setForm({
          ...createEmptyForm(),
          reference: String(bon.reference ?? ''),
          compteId: String(bon.compteId ?? bon.compte_id ?? ''),
          name: String(bon.name ?? bon.nom ?? ''),
          mobile,
          quantityOlive: String(bon.quantityOlive ?? ''),
          quantityOil: String(bon.quantityOil ?? ''),
          priceKg: String(bon.priceKg ?? ''),
          price: String(bon.price ?? ''),
          payement: String(bon.payement ?? bon.payment ?? ''),
          acompte: String(bon.acompte ?? ''),
          statusId: String(bon.statusId ?? bon.status?.id ?? '1'),
          caisse: selectedCrates.filter(
            (number) => Number.isFinite(number) && number > 0,
          ),
          natureId: String(bon.natureId ?? '1'),
          priceOil: String(bon.priceOil ?? ''),
          observation: String(bon.observation ?? ''),
          typeHuile: String(bon.typeHuile ?? '1'),
          isBaseCompte: Boolean(bon.isBaseCompte),
          dateCreation: toLocalDateTime(bon.dateCreation),
          dateDebProduction: toLocalDateTime(bon.dateDebProduction),
          dateFinProduction: toLocalDateTime(bon.dateFinProduction),
        });

        // En édition, les informations du compte déjà chargées sont conservées.
        setAccountFound(Boolean(bon.compteId ?? bon.compte_id));
        setAccountSearchMessage('');
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Erreur lors du chargement du bon.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadReception();

    return () => controller.abort();
  }, [id, isEdit]);

  // Vérification automatique du compte après la saisie du téléphone.
  useEffect(() => {
    const phone = form.mobile.trim();
    const requestId = ++accountRequestRef.current;

    if (!phone) {
      setAccountSearchLoading(false);
      setAccountSearchMessage('');
      setAccountFound(false);

      // Ne pas effacer les données du compte pendant le chargement initial
      // d'un bon en mode modification.
      if (!isEdit || !loading) {
        setForm((current) => ({
          ...current,
          compteId: '',
          name: '',
        }));
      }

      return;
    }

    // En mode édition, conserver le compte déjà chargé tant que
    // le téléphone n'a pas été modifié par l'utilisateur.
    if (isEdit && phone === phoneToCheckRef.current) {
      return;
    }

    setAccountSearchMessage('');
    setAccountFound(false);

    const timeoutId = window.setTimeout(async () => {
      setAccountSearchLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/reception/getCompte?phone=${encodeURIComponent(phone)}`,
          { headers: { Accept: 'application/json' } },
        );

        const result = await readResponse(response);
        const account = Array.isArray(result) ? result[0] : result;

        // Ignorer les réponses d'anciennes saisies.
        if (requestId !== accountRequestRef.current) return;

        if (!account) {
          setForm((current) => ({
            ...current,
            compteId: '',
            name: '',
          }));

          setAccountFound(false);
          setAccountSearchMessage(
            'Aucun compte trouvé pour ce numéro.',
          );
          return;
        }

        const compteId = String(account.id ?? account.compteId ?? '');
        const name = String(account.name ?? account.nom ?? '');

        if (!compteId) {
          setForm((current) => ({
            ...current,
            compteId: '',
            name: '',
          }));

          setAccountFound(false);
          setAccountSearchMessage(
            'Le compte trouvé ne possède pas d’identifiant valide.',
          );
          return;
        }

        setForm((current) => ({
          ...current,
          compteId,
          name,
          mobile: String(account.mobile ?? account.phone ?? phone),
        }));

        phoneToCheckRef.current = phone;
        setAccountFound(true);
        setAccountSearchMessage('Compte vérifié avec succès.');
      } catch (err) {
        if (requestId !== accountRequestRef.current) return;

        setForm((current) => ({
          ...current,
          compteId: '',
          name: '',
        }));

        setAccountFound(false);
        setAccountSearchMessage(
          err instanceof Error
            ? `Vérification impossible : ${err.message}`
            : 'Erreur lors de la vérification du compte.',
        );
      } finally {
        if (requestId === accountRequestRef.current) {
          setAccountSearchLoading(false);
        }
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [form.mobile, isEdit, loading]);

  function toggleCrate(crateNumber: number) {
    setForm((current) => ({
      ...current,
      caisse: current.caisse.includes(crateNumber)
        ? current.caisse.filter((number) => number !== crateNumber)
        : [...current.caisse, crateNumber].sort((a, b) => a - b),
    }));
  }

  const totalPaid = toNumber(form.payement) + toNumber(form.acompte);
  const remainingBalance = toNumber(form.price) - totalPaid;

  const yieldPercentage =
    toNumber(form.quantityOlive) > 0
      ? (toNumber(form.quantityOil) /
          toNumber(form.quantityOlive)) *
        100
      : 0;

  
async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault();
  setError('');
  setSuccess('');

  if (isEdit && !id) {
    setError("L'identifiant du bon est manquant.");
    return;
  }

  if (!form.compteId.trim() || !accountFound) {
    setError(
      'Veuillez saisir un numéro de téléphone associé à un compte valide.',
    );
    return;
  }

  setSubmitting(true);

  try {
    const payload = {
      id: isEdit ? Number(id) : 0,
      reference: form.reference.trim(),
      compteId: Number(form.compteId),
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      quantityOlive: toNumber(form.quantityOlive),
      quantityOil: toNumber(form.quantityOil),
      priceKg: toNumber(form.priceKg),
      price: toNumber(form.price),
      payement: toNumber(form.payement),
      acompte: toNumber(form.acompte),
      statusId: form.statusId,
      caisse: form.caisse.join(', '),
      natureId: toNumber(form.natureId),
      priceOil: toNumber(form.priceOil),
      observation: form.observation.trim(),
      typeHuile: toNumber(form.typeHuile),
      isBaseCompte: form.isBaseCompte,
      dateCreation: form.dateCreation
        ? new Date(form.dateCreation).toISOString()
        : new Date().toISOString(),
      dateDebProduction: form.dateDebProduction
        ? new Date(form.dateDebProduction).toISOString()
        : '',
      dateFinProduction: form.dateFinProduction
        ? new Date(form.dateFinProduction).toISOString()
        : '',
      solde: remainingBalance,
      rendement: yieldPercentage,
    };

    const url = isEdit
      ? `${API_BASE_URL}/reception/update/${encodeURIComponent(id!)}`
      : `${API_BASE_URL}/reception/create`;

    const method = isEdit ? 'PUT' : 'POST';

    console.log('Requête envoyée :', method, url);
    console.log('Payload envoyé :', payload);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await readResponse(response);

    setSuccess(
      isEdit
        ? 'Le bon de réception a été modifié avec succès.'
        : 'Le bon de réception a été créé avec succès.',
    );
  } catch (err) {
    console.error(
      "Erreur lors de l'enregistrement du bon :",
      err,
    );

    setError(
      err instanceof Error
        ? err.message
        : "Erreur lors de l'enregistrement du bon.",
    );
  } finally {
    setSubmitting(false);
  }
}


  function resetForm() {
    if (isEdit) return;

    accountRequestRef.current += 1;
    phoneToCheckRef.current = '';

    setForm(createEmptyForm());
    setError('');
    setSuccess('');
    setAccountSearchMessage('');
    setAccountFound(false);
    setAccountSearchLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-slate-600">
        <LoaderCircle className="size-5 animate-spin" />
        Chargement du bon de réception...
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-white p-4 md:px-8 md:py-8">
      <header className="relative mb-5 overflow-hidden rounded-2xl border border-[#e8ecdf] bg-gradient-to-br from-white via-white to-[#f1f5e9] px-5 py-5 sm:px-7 sm:py-6">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border border-[#e3ead8] opacity-60"
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-5 -top-12 size-48 rounded-full border border-[#e3ead8] opacity-60"
  />

  <div className="relative">
    {/* Fil d'Ariane */}
    <nav
      aria-label="Fil d'Ariane"
      className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#87927c]"
    >
      <button
        type="button"
        onClick={() => navigate("/store-admin")}
        aria-label="Accueil"
        className="transition hover:text-[#556B2F]"
      >
        <Home className="size-3.5" />
      </button>

      <ChevronRight className="size-3" />

      <button
        type="button"
        className="transition hover:text-[#556B2F]"
      >
        Bons de réception
      </button>

      <ChevronRight className="size-3" />

      <span className="font-semibold text-[#33412b]">
        {isEdit
          ? "Modifier un bon de réception"
          : "Ajouter un bon de réception"}
      </span>
    </nav>

    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        {/* Icône alignée avec le titre */}
        <div className="flex size-[58px] shrink-0 items-center justify-center rounded-2xl border border-[#dfe8d3] bg-gradient-to-br from-[#f5f8ef] to-[#eaf0df] text-[#556B2F] shadow-[0_3px_10px_rgba(85,107,47,0.07)]">
          <ClipboardCheck
            className="size-7"
            strokeWidth={1.9}
          />
        </div>

        {/* Titre et description */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[25px] font-bold leading-tight tracking-[-0.035em] text-[#172033] sm:text-[32px]">
              {isEdit
                ? "Modifier un bon de réception"
                : "Ajouter un bon de réception"}
            </h1>
          </div>

          <p className="mt-2.5 max-w-2xl text-[14px] font-normal leading-[1.8] tracking-[0.01em] text-[#64748b] sm:text-[15px]">
            {isEdit
              ? "Modifiez les informations et les détails du bon de réception."
              : "Enregistrez un bon de réception et renseignez les informations relatives aux produits réceptionnés."}
          </p>
        </div>
      </div>

      {/* Bouton retour */}
      
    </div>
  </div>
</header>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-6 md:px-8">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef1e8]">
              <FileText className="size-5 text-[#556b2f]" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Informations du bon
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Les champs marqués d’un astérisque sont obligatoires.
              </p>
            </div>
          </div>

          <div className="space-y-8 px-6 py-7 md:px-8">
            {/* Identification */}
            <section>
              <h3 className="mb-5 text-base font-medium text-slate-800">
                Identification
              </h3>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <Field
                  label="Référence"
                  value={form.reference}
                  onChange={(value) =>
                    updateField('reference', value)
                  }
                  required
                  placeholder="Ex. BR-2026-001"
                />

                <div>
                  <Field
                    label="Téléphone du compte"
                    value={form.mobile}
                    onChange={(value) => {
                      phoneToCheckRef.current = '';
                      setAccountFound(false);
                      setAccountSearchMessage('');
                      updateField('mobile', value);
                      setForm((current) => ({
                        ...current,
                        mobile: value,
                        compteId: '',
                        name: '',
                      }));
                    }}
                    required
                    placeholder="Saisissez le numéro de téléphone"
                  />

                  {accountSearchLoading && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <LoaderCircle className="size-4 animate-spin" />
                      Vérification du compte...
                    </p>
                  )}

                  {!accountSearchLoading && accountSearchMessage && (
                    <p
                      className={`mt-2 text-sm ${
                        accountFound ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {accountSearchMessage}
                    </p>
                  )}
                </div>

                <Field
                  label="ID du compte"
                  value={form.compteId}
                  onChange={(value) =>
                    updateField('compteId', value)
                  }
                  required
                  placeholder="Identifiant du compte"
                />

                <Field
                  label="Compte"
                  value={form.name}
                  onChange={(value) => updateField('name', value)}
                  required
                  placeholder="Nom du compte"
                />

                <label className="inline-flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-5 py-4 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isBaseCompte}
                    onChange={(event) =>
                      updateField(
                        'isBaseCompte',
                        event.target.checked,
                      )
                    }
                    className="size-5 accent-[#556b2f]"
                  />
                  Compte de base
                </label>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Quantités réceptionnées */}
            <section>
              <h3 className="mb-5 flex items-center gap-3 text-base font-semibold text-slate-900">
                <span className="text-[#556b2f]">⚖</span>
                Quantités réceptionnées
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Quantité d'olives (kg)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.quantityOlive}
                  onChange={(value) =>
                    updateField('quantityOlive', value)
                  }
                  required
                />

                <Field
                  label="Quantité d'huile"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.quantityOil}
                  onChange={(value) =>
                    updateField('quantityOil', value)
                  }
                />

                <Field
                  label="Date de création"
                  type="datetime-local"
                  value={form.dateCreation}
                  onChange={(value) =>
                    updateField('dateCreation', value)
                  }
                  required
                />

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Statut
                  </span>

                  <select
                    value={form.statusId}
                    onChange={(event) =>
                      updateField('statusId', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#71823c] focus:ring-2 focus:ring-[#71823c]/20"
                  >
                    <option value="1">En cours</option>
                    <option value="2">Terminé</option>
                    <option value="3">Annulé</option>
                  </select>
                </label>

                <Field
                  label="Prix par kg d'olives"
                  type="number"
                  min="0"
                  step="0.001"
                  value={form.priceKg}
                  onChange={(value) =>
                    updateField('priceKg', value)
                  }
                />

                <Field
                  label="Prix total"
                  type="number"
                  min="0"
                  step="0.001"
                  value={form.price}
                  onChange={(value) =>
                    updateField('price', value)
                  }
                />

                <Field
                  label="Prix de l'huile"
                  type="number"
                  min="0"
                  step="0.001"
                  value={form.priceOil}
                  onChange={(value) =>
                    updateField('priceOil', value)
                  }
                />

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nature de la réception
                  </span>

                  <select
                    value={form.natureId}
                    onChange={(event) =>
                      updateField('natureId', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#71823c] focus:ring-2 focus:ring-[#71823c]/20"
                  >
                    <option value="1">Olives</option>
                    <option value="2">Huile</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Type d'huile
                  </span>

                  <select
                    value={form.typeHuile}
                    onChange={(event) =>
                      updateField('typeHuile', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#71823c] focus:ring-2 focus:ring-[#71823c]/20"
                  >
                    <option value="1">Huile d'olive</option>
                    <option value="2">Huile biologique</option>
                  </select>
                </label>

                <Field
                  label="Début de production"
                  type="datetime-local"
                  value={form.dateDebProduction}
                  onChange={(value) =>
                    updateField('dateDebProduction', value)
                  }
                />

                <Field
                  label="Fin de production"
                  type="datetime-local"
                  value={form.dateFinProduction}
                  onChange={(value) =>
                    updateField('dateFinProduction', value)
                  }
                />
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Caisses associées */}
            <section>
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Caisses associées
              </h3>

              <p className="mb-4 text-sm text-slate-500">
                Sélectionnez les caisses associées à ce bon.
              </p>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 md:grid-cols-10 xl:grid-cols-13">
                {Array.from({ length: 91 }, (_, index) => {
                  const number = index + 1;
                  const checked = form.caisse.includes(number);

                  return (
                    <button
                      key={number}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleCrate(number)}
                      className={`rounded-lg border px-2 py-3 text-sm font-medium transition ${
                        checked
                          ? 'border-[#556b2f] bg-[#556b2f] text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#9ba97a] hover:bg-[#f5f7ef]'
                      }`}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-sm font-medium text-slate-600">
                Caisses sélectionnées : {form.caisse.length}
              </p>
            </section>

            {/* Observations */}
            <section>
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Observations
              </h3>

              <label className="block">

                <textarea
                  value={form.observation}
                  onChange={(event) =>
                    updateField('observation', event.target.value)
                  }
                  rows={4}
                  placeholder="Ajouter une observation..."
                  className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#71823c] focus:ring-2 focus:ring-[#71823c]/20"
                />
              </label>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              {!isEdit && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                  Réinitialiser
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate('/store-admin/reception-vouchers')
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={submitting || accountSearchLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#556b2f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#435525] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                {submitting
                  ? 'Enregistrement...'
                  : isEdit
                    ? 'Enregistrer les modifications'
                    : 'Créer le bon'}
              </button>
            </div>
          </div>
        </form>
      </div>

  );
}
