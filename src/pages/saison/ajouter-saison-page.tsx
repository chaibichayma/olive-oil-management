
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type {
  ChangeEvent,
  FormEvent,
  ReactNode,
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Hash,
  Home,
  Info,
  LoaderCircle,
  Package,
  Save,
  Sprout,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { saveSeason, updateSeason } from '@/api/season.api';

/* =========================================================
   CONFIGURATION
========================================================= */

const GREEN = '#556B2F';
const SEASON_LIST_URL = '/store-admin/saison';

/* =========================================================
   TYPES
========================================================= */

interface Saison {
  id?: number | string;
  beginDate?: string;
  endDate?: string;
  statusId?: number;
  year?: number;
  priceKilo?: number;
  priceAchat?: number;
  priceVente?: number;
  nbreCaisses?: number;
  createdUser?: string;
  createdDate?: string;
  createdTime?: {
    hour?: number;
    minute?: number;
    second?: number;
    nano?: number;
  };
  [key: string]: unknown;
}

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

interface FieldProps {
  label: string;
  htmlFor: string;
  icon?: ReactNode;
  unit?: string;
  hint?: string;
  children: ReactNode;
}

const emptyForm: SaisonFormData = {
  beginDate: '',
  endDate: '',
  statusId: '1',
  year: '',
  priceKilo: '',
  priceAchat: '',
  priceVente: '',
  nbreCaisses: '',
};

/* =========================================================
   CONVERSION DES DONNÉES
========================================================= */

function toFormData(saison?: Saison): SaisonFormData {
  if (!saison) {
    return { ...emptyForm };
  }

  return {
    beginDate: saison.beginDate?.slice(0, 10) ?? '',
    endDate: saison.endDate?.slice(0, 10) ?? '',
    statusId: String(saison.statusId ?? 1),
    year: String(saison.year ?? ''),
    priceKilo: String(saison.priceKilo ?? ''),
    priceAchat: String(saison.priceAchat ?? ''),
    priceVente: String(saison.priceVente ?? ''),
    nbreCaisses: String(saison.nbreCaisses ?? ''),
  };
}

/* =========================================================
   CHAMP DE FORMULAIRE
========================================================= */

function FormField({
  label,
  htmlFor,
  icon,
  unit,
  hint,
  children,
}: FieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.01em] text-[#243047]"
      >
        {label}
        <span className="text-red-500">*</span>
      </label>

      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-[#8A9BB5] transition-colors duration-200 group-focus-within:text-[#556B2F]">
            {icon}
          </span>
        )}

        {children}

        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[#F5F7FA] px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
            {unit}
          </span>
        )}
      </div>

      {hint && (
        <p className="mt-1.5 text-[11px] leading-5 text-[#8998AD]">
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   CLASSES DES CHAMPS
========================================================= */

const inputBase =
  'h-[46px] w-full rounded-[10px] border border-[#DCE4EE] bg-white text-[13px] text-[#263449] outline-none transition-all duration-200 placeholder:text-[#9AA9BD] hover:border-[#C4CFDC] focus:border-[#71864E] focus:ring-[3px] focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-slate-50';

const iconInput = `${inputBase} pl-10 pr-4`;
const unitInput = `${inputBase} pl-10 pr-[78px]`;

const selectInput =
  'h-[46px] w-full appearance-none rounded-[10px] border border-[#DCE4EE] bg-white pl-10 pr-10 text-[13px] font-medium text-[#263449] outline-none transition-all duration-200 hover:border-[#C4CFDC] focus:border-[#71864E] focus:ring-[3px] focus:ring-[#556B2F]/10';

/* =========================================================
   INDICATEUR D'ÉTAPE
========================================================= */

function StepIndicator({
  number,
  title,
  description,
  active,
}: {
  number: number;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold transition-colors ${
          active
            ? 'border-[#556B2F] bg-[#556B2F] text-white shadow-[0_3px_8px_rgba(85,107,47,0.18)]'
            : 'border-[#E4E9EF] bg-[#F2F4F7] text-[#8491A4]'
        }`}
      >
        {active ? (
          <Check className="size-4" strokeWidth={2.5} />
        ) : (
          number
        )}
      </div>

      <div className="min-w-0">
        <p
          className={`truncate text-[12px] font-bold ${
            active ? 'text-[#263449]' : 'text-[#75839A]'
          }`}
        >
          {title}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-[#93A0B2]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EN-TÊTE DE SECTION
========================================================= */

function SectionHeading({
  icon,
  title,
  description,
  color = 'green',
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'green' | 'amber' | 'blue';
}) {
  const colorClasses = {
    green: 'bg-[#F0F4E9] text-[#556B2F]',
    amber: 'bg-[#FFF7E7] text-[#D97706]',
    blue: 'bg-[#EEF5FF] text-[#3478F6]',
  };

  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${colorClasses[color]}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-[14px] font-bold tracking-[-0.02em] text-[#202D43]">
          {title}
        </h3>
        <p className="mt-1 text-[11px] leading-5 text-[#8A98AD]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE : AJOUT / MODIFICATION D'UNE SAISON
========================================================= */

export function AjouterSaisonPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const saison = (
    location.state as { saison?: Saison } | null
  )?.saison;

  const isEdit = saison !== undefined && saison !== null;

  const [formData, setFormData] = useState<SaisonFormData>(
    () => toFormData(saison),
  );

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* Actualiser le formulaire en cas de changement de saison */

  useEffect(() => {
    setFormData(toFormData(saison));
    setErrorMessage('');
    setShowSuccessModal(false);
  }, [saison]);

  /* Modification des champs */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage('');
  };

  /* Annulation */

  const handleCancel = () => {
    if (!isSubmitting) {
      navigate(SEASON_LIST_URL);
    }
  };

  /* =========================================================
     ENREGISTREMENT : LOGIQUE MÉTIER CONSERVÉE
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage('');

    // 1. Vérifier l'identifiant en mode modification.
    if (
      isEdit &&
      (saison?.id === undefined ||
        saison?.id === null ||
        String(saison.id).trim() === '')
    ) {
      setErrorMessage(
        "L'identifiant de la saison est manquant. Impossible de la modifier.",
      );
      return;
    }

    // 2. Vérifier les champs obligatoires.
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

    // 3. Vérifier les dates.
    if (formData.endDate < formData.beginDate) {
      setErrorMessage(
        'La date de fin doit être postérieure ou égale à la date de début.',
      );
      return;
    }

    // 4. Convertir les valeurs numériques.
    const year = Number(formData.year);
    const statusId = Number(formData.statusId);
    const priceKilo = Number(formData.priceKilo);
    const priceAchat = Number(formData.priceAchat);
    const priceVente = Number(formData.priceVente);
    const nbreCaisses = Number(formData.nbreCaisses);

    // 5. Vérifier les types numériques.
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(statusId) ||
      !Number.isFinite(priceKilo) ||
      !Number.isFinite(priceAchat) ||
      !Number.isFinite(priceVente) ||
      !Number.isInteger(nbreCaisses)
    ) {
      setErrorMessage(
        "Vérifiez l'année, le statut, les prix et le nombre de caisses.",
      );
      return;
    }

    // 6. Vérifier les limites.
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

    // 7. Préparer les données destinées à l'API.
    const createdTime = saison?.createdTime;

    const payload = {
      createdUser:
        typeof saison?.createdUser === 'string'
          ? saison.createdUser
          : '',

      createdDate:
        typeof saison?.createdDate === 'string'
          ? saison.createdDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),

      createdTime: {
        hour:
          typeof createdTime?.hour === 'number'
            ? createdTime.hour
            : 0,
        minute:
          typeof createdTime?.minute === 'number'
            ? createdTime.minute
            : 0,
        second:
          typeof createdTime?.second === 'number'
            ? createdTime.second
            : 0,
        nano:
          typeof createdTime?.nano === 'number'
            ? createdTime.nano
            : 0,
      },

      searche: '',
      beginDate: formData.beginDate,
      endDate: formData.endDate,
      statusId,
      year,
      priceKilo,
      priceAchat,
      priceVente,
      nbreCaisses,

      // Même comportement qu'avant :
      // identifiant de la saison en modification,
      // objet vide en création.
      id: isEdit ? saison!.id : {},
    };

    setIsSubmitting(true);

    try {
      if (isEdit) {
        if (saison?.id === undefined || saison.id === null) {
          throw new Error(
            "L'identifiant de la saison est manquant.",
          );
        }

        await updateSeason({
          ...payload,
          id: saison.id,
        });
      } else {
        await saveSeason({
          ...payload,
          id: {},
        });
      }

      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error(
        "Erreur d'enregistrement de la saison :",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Confirmation du succès */

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate(SEASON_LIST_URL);
  };

  /* =========================================================
     AFFICHAGE
  ========================================================= */

  return (
    <>
      <Container>
        <div className="pb-8 pt-5 sm:pt-6">

          {/* EN-TÊTE PREMIUM */}

          <header className="relative mb-5 overflow-hidden rounded-2xl border border-[#E6EBDD] bg-gradient-to-br from-[#F4F7EE] via-white to-[#F8FAF5] px-5 py-5 sm:px-7 sm:py-6">

            {/* Décoration réalisée en CSS, sans image */}

            <div className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border border-[#DDE7D0]/70" />
            <div className="pointer-events-none absolute -right-2 -top-16 size-48 rounded-full border border-[#E5ECD9]/80" />
            <div className="pointer-events-none absolute -bottom-24 right-24 size-40 rounded-full bg-[#E8EFDE]/40 blur-3xl" />

            <div className="relative z-10">

              {/* Fil d'Ariane */}

              <nav
  aria-label="Fil d'Ariane"
  className="mb-6 flex flex-wrap items-center gap-2.5 text-[12px] tracking-[0.01em]"
>
  <button
    type="button"
    onClick={() => navigate('/store-admin')}
    className="flex size-7 items-center justify-center rounded-lg
               text-[#84916F] transition-all duration-200
               hover:bg-[#F0F4E9] hover:text-[#556B2F]"
    aria-label="Accueil"
  >
    <Home className="size-[15px]" strokeWidth={1.9} />
  </button>

  <ChevronRight
    className="size-3.5 shrink-0 text-[#C0C8B8]"
    strokeWidth={1.8}
  />

  <span className="font-medium text-[#7B8798] transition-colors">
    Paramétrage
  </span>

  <ChevronRight
    className="size-3.5 shrink-0 text-[#C0C8B8]"
    strokeWidth={1.8}
  />

  <button
    type="button"
    onClick={handleCancel}
    className="font-medium text-[#7B8798] transition-colors
               duration-200 hover:text-[#556B2F]"
  >
    Saisons
  </button>

  <ChevronRight
    className="size-3.5 shrink-0 text-[#C0C8B8]"
    strokeWidth={1.8}
  />

  <span
    aria-current="page"
    className="inline-flex items-center rounded-md
               border border-[#E1E9D7] bg-[#F4F7EF]
               px-2.5 py-1 text-[11px] font-semibold
               tracking-[0.015em] text-[#4D6429]"
  >
    {isEdit ? 'Modifier une saison' : 'Ajouter une saison'}
  </span>
</nav>

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex size-[58px] shrink-0 items-center justify-center rounded-2xl border border-[#E0E8D5] bg-white/90 text-[#556B2F] shadow-sm">
                    <Sprout
                      className="size-7"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-[25px] font-bold tracking-[-0.045em] text-[#172033] sm:text-[32px]">
                        {isEdit
                          ? 'Modifier la saison'
                          : 'Ajouter une saison'}
                      </h1>

                      
                    </div>

                    <p className="mt-1.5 max-w-2xl text-[12px] leading-6 text-[#64748B] sm:text-[14px]">
                      {isEdit
                        ? 'Modifiez les informations et les paramètres de votre saison oléicole.'
                        : 'Configurez les informations de votre nouvelle saison oléicole.'}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="h-10 shrink-0 gap-2 self-start rounded-xl border-[#DCE8CF] bg-white/85 px-4 text-[12px] font-semibold text-[#556B2F] shadow-sm transition duration-200 hover:border-[#C7D9B3] hover:bg-[#F2F6EC] hover:text-[#435B2B] sm:self-center"
                >
                  <ArrowLeft className="size-4" />
                  Retour aux saisons
                </Button>

              </div>
            </div>
          </header>

          {/* BARRE DE PROGRESSION */}

          <div className="mb-5 rounded-2xl border border-[#E7EBF0] bg-white px-4 py-4 shadow-[0_3px_14px_rgba(15,23,42,0.025)] sm:px-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_40px_1fr_40px_1fr] sm:items-center">

              <StepIndicator
                number={1}
                title="Informations générales"
                description="Période et statut"
                active
              />

              <div className="hidden border-t border-dashed border-[#D6DEE8] sm:block" />

              <StepIndicator
                number={2}
                title="Tarification"
                description="Prix de production et d'achat"
                active={false}
              />

              <div className="hidden border-t border-dashed border-[#D6DEE8] sm:block" />

              <StepIndicator
                number={3}
                title="Capacité de stockage"
                description="Nombre de caisses"
                active={false}
              />

            </div>
          </div>

          {/* FORMULAIRE */}

          <form onSubmit={handleSubmit} noValidate>

            {/* ERREUR */}

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
              >
                <Info className="mt-0.5 size-5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {isEdit
                      ? 'Impossible de modifier la saison'
                      : "Impossible d'ajouter la saison"}
                  </p>

                  <p className="mt-1 break-words text-[12px] leading-5">
                    {errorMessage}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="rounded-lg p-1 text-red-400 transition hover:bg-red-100"
                  aria-label="Fermer le message d'erreur"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-[#E4E9EF] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.035)]">

              {/* EN-TÊTE DE LA CARTE */}

              <div className="relative border-b border-[#EDF0F4] bg-gradient-to-r from-[#F6F8F2] via-white to-white px-5 py-5 sm:px-7 sm:py-6">

                <div className="absolute right-0 top-0 h-full w-[4px] bg-[#556B2F]" />

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div className="flex min-w-0 items-center gap-3.5">

                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#E5EBDD] bg-white text-[#556B2F] shadow-sm">
                      <ClipboardList
                        className="size-5"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[16px] font-bold tracking-[-0.025em] text-[#202D43] sm:text-[18px]">
                          Informations de la saison
                        </h2>

                      </div>

                      <p className="mt-1 text-[11px] leading-5 text-[#8190A5] sm:text-[12px]">
                        Renseignez les dates, le statut, les tarifs et la capacité de stockage.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-medium text-red-600">
                    <span className="font-bold">*</span>
                    Champs obligatoires
                  </span>

                </div>
              </div>

              {/* CONTENU DU FORMULAIRE */}

              <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-7">

                {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}

                <section>
                  <SectionHeading
                    icon={<CalendarRange className="size-[19px]" />}
                    title="Informations générales"
                    description="Identifiez la saison et définissez sa période."
                  />

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                    <FormField
                      label="Année de la saison"
                      htmlFor="year"
                      icon={<Hash className="size-[17px]" />}
                      hint="Exemple : 2026"
                    >
                      <input
                        id="year"
                        name="year"
                        type="number"
                        min="1900"
                        max="2100"
                        step="1"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="Ex. 2026"
                        required
                        className={iconInput}
                      />
                    </FormField>

                    <FormField
                      label="Statut"
                      htmlFor="statusId"
                      icon={
                        <span
                          className={`size-2.5 rounded-full ${
                            formData.statusId === '1'
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                        />
                      }
                      hint="Détermine l'état actuel de la saison."
                    >
                      <select
                        id="statusId"
                        name="statusId"
                        value={formData.statusId}
                        onChange={handleChange}
                        required
                        className={selectInput}
                      >
                        <option value="1">En cours</option>
                        <option value="2">Clôturée</option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8A9BB5]" />
                    </FormField>

                    <FormField
                      label="Date de début"
                      htmlFor="beginDate"
                      icon={<CalendarDays className="size-[17px]" />}
                      hint="Date de début de la saison."
                    >
                      <input
                        id="beginDate"
                        name="beginDate"
                        type="date"
                        value={formData.beginDate}
                        max={formData.endDate || undefined}
                        onChange={handleChange}
                        required
                        className={iconInput}
                      />
                    </FormField>

                    <FormField
                      label="Date de fin"
                      htmlFor="endDate"
                      icon={<CalendarDays className="size-[17px]" />}
                      hint="Doit être égale ou postérieure à la date de début."
                    >
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        min={formData.beginDate || undefined}
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className={iconInput}
                      />
                    </FormField>

                  </div>
                </section>

                <div className="border-t border-dashed border-[#E1E7EE]" />

                {/* SECTION 2 : TARIFICATION */}

                <section>
                  <SectionHeading
                    icon={<CircleDollarSign className="size-[19px]" />}
                    title="Tarification"
                    description="Définissez les prix de production, d'achat et de vente."
                    color="amber"
                  />

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                    <FormField
                      label="Prix de production d'un kilo d'olives"
                      htmlFor="priceKilo"
                      icon={<CircleDollarSign className="size-[17px]" />}
                      unit="DT/kg"
                      hint="Coût de production pour un kilo d'olives."
                    >
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
                        className={unitInput}
                      />
                    </FormField>

                    <FormField
                      label="Prix d'achat d'un litre d'huile"
                      htmlFor="priceAchat"
                      icon={<CircleDollarSign className="size-[17px]" />}
                      unit="DT/L"
                      hint="Prix d'achat pour un litre d'huile."
                    >
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
                        className={unitInput}
                      />
                    </FormField>

                    <FormField
                      label="Prix de vente d'un litre d'huile"
                      htmlFor="priceVente"
                      icon={<CircleDollarSign className="size-[17px]" />}
                      unit="DT/L"
                      hint="Prix de vente pour un litre d'huile."
                    >
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
                        className={unitInput}
                      />
                    </FormField>

                  </div>
                </section>

                <div className="border-t border-dashed border-[#E1E7EE]" />

                {/* SECTION 3 : CAPACITÉ DE STOCKAGE */}

                <section>
                  <SectionHeading
                    icon={<Package className="size-[19px]" />}
                    title="Capacité de stockage"
                    description="Indiquez le nombre de caisses disponibles pour la saison."
                    color="blue"
                  />

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                    <FormField
                      label="Nombre de caisses"
                      htmlFor="nbreCaisses"
                      icon={<Package className="size-[17px]" />}
                      hint="Saisissez un nombre entier positif ou nul."
                    >
                      <input
                        id="nbreCaisses"
                        name="nbreCaisses"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.nbreCaisses}
                        onChange={handleChange}
                        placeholder="Ex. 500"
                        required
                        className={iconInput}
                      />
                    </FormField>

                  </div>
                </section>

              </div>

              {/* PIED DE FORMULAIRE */}

              <footer className="flex flex-col gap-4 border-t border-[#E8EDF2] bg-[#F9FAFC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                <p className="flex items-center gap-2 text-[11px] leading-5 text-[#8795A9]">
                 
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-11 min-w-[120px] gap-2 rounded-xl border-[#DCE4ED] bg-white px-5 text-[12px] font-semibold text-[#59677D] shadow-sm transition duration-200 hover:border-[#C8D2DE] hover:bg-[#F5F7FA] hover:text-[#263449]"
                  >
                    <X className="size-4 text-[#8998AD]" />
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 min-w-[190px] gap-2 rounded-xl border border-[#465A27] bg-[#556B2F] px-5 text-[12px] font-bold tracking-[0.005em] text-white shadow-[0_3px_8px_rgba(85,107,47,0.15)] transition duration-200 hover:bg-[#465A27] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        {isEdit
                          ? 'Enregistrer les modifications'
                          : 'Enregistrer la saison'}
                        <ArrowRight className="ml-1 size-4" />
                      </>
                    )}
                  </Button>

                </div>
              </footer>

            </div>
          </form>
        </div>
      </Container>

      {/* MODALE DE SUCCÈS */}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[3px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/70 bg-white p-7 text-center shadow-[0_25px_80px_rgba(15,23,42,0.22)] sm:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto flex size-[76px] items-center justify-center rounded-full bg-[#556B2F]/10">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#556B2F] shadow-lg shadow-[#556B2F]/20">
                <Check
                  className="size-7 text-white"
                  strokeWidth={3}
                />
              </div>
            </div>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Enregistrement réussi
            </span>

            <h2
              id="success-title"
              className="mt-4 text-xl font-bold tracking-tight text-[#202D43]"
            >
              {isEdit ? 'Saison modifiée !' : 'Saison ajoutée !'}
            </h2>

            <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-6 text-[#7D8A9E]">
              {isEdit
                ? 'Les modifications ont été enregistrées avec succès.'
                : 'La nouvelle saison a été enregistrée avec succès.'}
              {' '}Vous pouvez maintenant consulter la liste des saisons.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleSuccessOk}
                className="h-11 w-full gap-2 rounded-xl bg-[#556B2F] text-[12px] font-bold text-white shadow-sm transition hover:bg-[#465A27]"
              >
                <Check className="size-4" />
                Voir les saisons
                <ArrowRight className="ml-1 size-4" />
              </Button>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="py-2 text-[12px] font-medium text-[#7D8A9E] transition hover:text-[#263449]"
              >
                Rester sur cette page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AjouterSaisonPage;
