import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  Check,
  Hash,
  Save,
  X,
  ChevronRight,
  Sprout,
  CircleDollarSign,
  Package,
  ClipboardList,
  ArrowLeft,
  LoaderCircle,
  Info,
  CalendarRange,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

/* =========================================================
   CONFIGURATION API
========================================================= */

const API_URL = '/olive_app/season/save';

const GREEN = '#556B2F';

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
   COMPOSANT CHAMP
========================================================= */

interface FieldProps {
  label: string;
  htmlFor: string;
  icon?: React.ReactNode;
  unit?: string;
  hint?: string;
  children: React.ReactNode;
}

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
        className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"
      >
        {label}
        <span className="text-red-500">*</span>
      </label>

      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors group-focus-within:text-[#556B2F]">
            {icon}
          </span>
        )}

        {children}

        {unit && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {hint && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

/* =========================================================
   CLASSES DES CHAMPS
========================================================= */

const inputClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-slate-50';

const iconInputClass = `${inputClass} pl-11 pr-4`;

const unitInputClass = `${inputClass} pl-4 pr-20`;

const selectClass =
  'h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10';

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
    if (!isSubmitting) {
      navigate('/store-admin/saison');
    }
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
      statusId,
      year,
      priceKilo,
      priceAchat,
      priceVente,
      nbreCaisses,
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
     MODAL DE SUCCÈS
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
        <div className="pb-5 pt-7">
          {/* EN-TÊTE */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              

              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#556B2F]/10 text-[#556B2F]">
                  <Sprout className="size-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                    Ajouter une saison
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Configurez les informations de votre nouvelle saison oléicole.
                  </p>
                </div>
              </div>
            </div>

            <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  disabled={isSubmitting}
  className="h-10 gap-2 self-start rounded-xl border border-[#DCE8CF] bg-[#F4F8EF] text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
>
  <ArrowLeft className="size-4 text-[#718747]" />
  Retour aux saisons
</Button>
          </div>
        </div>
      </Container>

      <Container>
        <form onSubmit={handleSubmit} className="pb-8">
          {/* MESSAGE D'ERREUR */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
            >
              <Info className="mt-0.5 size-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Impossible d'enregistrer la saison
                </p>

                <p className="mt-1 leading-5">{errorMessage}</p>
              </div>

              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="ml-auto rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
                aria-label="Fermer le message d'erreur"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
            {/* EN-TÊTE DE LA CARTE */}
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-[#f6f8f1] via-white to-white px-5 py-6 sm:px-8">
              <div className="absolute right-0 top-0 h-full w-1 bg-[#556B2F]" />

              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#556B2F]/10 bg-white text-[#556B2F] shadow-sm">
                  <ClipboardList className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-800">
                      Informations de la saison
                    </h2>

                    <span className="rounded-full bg-[#556B2F]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#556B2F]">
                      Nouveau
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Renseignez les dates, le statut, les tarifs et la capacité de stockage.
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Les champs marqués d'un astérisque (
                    <span className="font-bold text-red-500">*</span>
                    ) sont obligatoires.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-8">
              {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#556B2F]/10 text-[#556B2F]">
                    <CalendarRange className="size-[18px]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Informations générales
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Identifiez la saison et définissez sa période.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  {/* ANNÉE */}
                  <FormField
                    label="Année de la saison"
                    htmlFor="year"
                    icon={<Hash className="size-[18px]" />}
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
                      placeholder="Entrez l'année"
                      required
                      className={iconInputClass}
                    />
                  </FormField>

                  {/* STATUT */}
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
                      className={`${iconInputClass} appearance-none pr-10`}
                    >
                      <option value="1">En cours</option>
                      <option value="2">Clôturée</option>
                    </select>
                  </FormField>

                  {/* DATE DÉBUT */}
                  <FormField
                    label="Date de début"
                    htmlFor="beginDate"
                    icon={<CalendarDays className="size-[18px]" />}
                  >
                    <input
                      id="beginDate"
                      name="beginDate"
                      type="date"
                      value={formData.beginDate}
                      max={formData.endDate || undefined}
                      onChange={handleChange}
                      required
                      className={iconInputClass}
                    />
                  </FormField>

                  {/* DATE FIN */}
                  <FormField
                    label="Date de fin"
                    htmlFor="endDate"
                    icon={<CalendarDays className="size-[18px]" />}
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
                      className={iconInputClass}
                    />
                  </FormField>
                </div>
              </section>

              {/* SÉPARATEUR */}
              <div className="border-t border-dashed border-slate-200" />

              {/* SECTION 2 : TARIFICATION */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <CircleDollarSign className="size-[18px]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Tarification
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Définissez les prix de production, d'achat et de vente.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  {/* PRIX KILO */}
                  <FormField
                    label="Prix de production d'un kilo d'olives"
                    htmlFor="priceKilo"
                    icon={<CircleDollarSign className="size-[18px]" />}
                    unit="DT/kg"
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
                      className={`${unitInputClass} pl-11`}
                    />
                  </FormField>

                  {/* PRIX ACHAT */}
                  <FormField
                    label="Prix d'achat d'un litre d'huile"
                    htmlFor="priceAchat"
                    icon={<CircleDollarSign className="size-[18px]" />}
                    unit="DT/L"
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
                      className={`${unitInputClass} pl-11`}
                    />
                  </FormField>

                  {/* PRIX VENTE */}
                  <FormField
                    label="Prix de vente d'un litre d'huile"
                    htmlFor="priceVente"
                    icon={<CircleDollarSign className="size-[18px]" />}
                    unit="DT/L"
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
                      className={`${unitInputClass} pl-11`}
                    />
                  </FormField>
                </div>
              </section>

              {/* SÉPARATEUR */}
              <div className="border-t border-dashed border-slate-200" />

              {/* SECTION 3 : CAPACITÉ */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Package className="size-[18px]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Capacité de stockage
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Indiquez le nombre de caisses disponibles pour la saison.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <FormField
                    label="Nombre de caisses"
                    htmlFor="nbreCaisses"
                    icon={<Package className="size-[18px]" />}
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
                      className={iconInputClass}
                    />
                  </FormField>
                </div>
              </section>
            </div>

            {/* PIED DE FORMULAIRE */}
            <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="size-4 shrink-0" />
                Vérifiez les informations avant l'enregistrement.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="h-11 min-w-[120px] gap-2 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <X className="size-4" />
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 min-w-[155px] gap-2 rounded-xl border border-[#465A27] bg-[#556B2F] px-6 font-semibold text-white shadow-[0_4px_12px_rgba(85,107,47,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#465A27] hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Enregistrer la saison
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Container>

      {/* =====================================================
          MODAL DE SUCCÈS
      ===================================================== */}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[3px]"
          onClick={handleCloseSuccess}
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
              onClick={handleCloseSuccess}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto flex size-[76px] items-center justify-center rounded-full bg-[#556B2F]/10">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#556B2F] shadow-lg shadow-[#556B2F]/20">
                <Check className="size-7 text-white" strokeWidth={3} />
              </div>
            </div>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Check className="size-3.5" />
              Enregistrement réussi
            </span>

            <h2
              id="success-title"
              className="mt-4 text-xl font-bold tracking-tight text-slate-800"
            >
              Saison ajoutée !
            </h2>

            <p className="mx-auto mt-2 max-w-[290px] text-sm leading-6 text-slate-500">
              La nouvelle saison a été enregistrée avec succès. Vous pouvez maintenant consulter la liste des saisons.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleSuccessOk}
                className="h-11 w-full gap-2 rounded-xl bg-[#556B2F] font-semibold text-white shadow-sm transition hover:bg-[#465A27]"
              >
                <Check className="size-4" />
                Voir les saisons
              </Button>

              <button
                type="button"
                onClick={handleCloseSuccess}
                className="py-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
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