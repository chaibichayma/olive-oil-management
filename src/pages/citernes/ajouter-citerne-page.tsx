
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { citerneApi } from "@/services/citerne-api";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Database,
  Droplets,
  Hash,
  Home,
  LoaderCircle,
  Save,
  X,
  AlertCircle,
} from "lucide-react";

interface Citerne {
  citerneId: number;
  reference: string;
  libelle: string;
  capacity: number;
  dateFabrication: string;
}

interface CiterneFormData {
  reference: string;
  name: string;
  capacite: string;
  dateFabrication: string;
}

export function AjouterCiternePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<CiterneFormData>({
    reference: "",
    name: "",
    capacite: "",
    dateFabrication: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const citerne = (
    location.state as { citerne?: Citerne } | null
  )?.citerne;

  const isEdit = Boolean(citerne);

  // Préserver le comportement de modification existant.
  useEffect(() => {
    if (citerne) {
      setFormData({
        reference: citerne.reference ?? "",
        name: citerne.libelle ?? "",
        capacite: String(citerne.capacity ?? ""),
        dateFabrication: citerne.dateFabrication?.slice(0, 10) ?? "",
      });
    } else {
      setFormData({
        reference: "",
        name: "",
        capacite: "",
        dateFabrication: "",
      });
    }
  }, [citerne]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleCancel = () => {
    navigate("/store-admin/tanks");
  };

  // Logique backend conservée.
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const reference = formData.reference.trim();
    const name = formData.name.trim();
    const capacity = Number(formData.capacite);

    if (!reference || !name || !formData.dateFabrication) {
      setErrorMessage(
        "Veuillez remplir tous les champs obligatoires.",
      );
      return;
    }

    if (!Number.isFinite(capacity) || capacity <= 0) {
      setErrorMessage(
        "La capacité doit être supérieure à zéro.",
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...(isEdit && citerne
          ? { citerneId: citerne.citerneId }
          : {}),
        reference,
        libelle: name,
        capacity,
        createdDate: formData.dateFabrication,
        searche: "",
      };

      if (isEdit) {
        await citerneApi.modifier(payload);
      } else {
        await citerneApi.ajouter(payload);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur API citerne :", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la citerne.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    navigate("/store-admin/tanks");
  };

  const formattedCapacity =
    formData.capacite &&
    Number.isFinite(Number(formData.capacite)) &&
    Number(formData.capacite) > 0
      ? Number(formData.capacite).toLocaleString("fr-FR")
      : "";

  const inputClass =
    "h-[47px] w-full rounded-lg border border-[#e1e5eb] bg-white pl-11 pr-3 text-[13px] font-medium text-[#243047] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#9aa4b5] hover:border-[#cbd3c0] focus:border-[#718747] focus:ring-[3px] focus:ring-[#556B2F]/10";

  const labelClass =
    "flex items-center gap-1.5 text-[13px] font-semibold text-[#263247]";

  const helperClass =
    "mt-1.5 text-[11px] leading-[17px] text-[#8490a3]";

  return (
    <>
      <Container>
        <div className="w-full py-4 sm:py-5">
          {/* En-tête : fond discret, sans image */}
          <header className="relative mb-5 overflow-hidden rounded-xl border border-[#e9ecdf] bg-gradient-to-r from-[#f4f6ed] via-[#fafbf7] to-white px-5 py-5 sm:px-7 sm:py-6">
            <div className="relative z-10">
              {/* Fil d'Ariane */}
              <nav
                aria-label="Fil d'Ariane"
                className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#89927e]"
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  aria-label="Retour à la liste des citernes"
                  className="rounded-md p-0.5 transition hover:text-[#556B2F]"
                >
                  <Home size={14} />
                </button>

                <ChevronRight size={12} className="text-[#b4bca9]" />

                <button
                  type="button"
                  onClick={handleCancel}
                  className="transition hover:text-[#556B2F]"
                >
                  Citernes
                </button>

                <ChevronRight size={12} className="text-[#b4bca9]" />

                <span className="font-semibold text-[#4b5e30]">
                  {isEdit
                    ? "Modifier une citerne"
                    : "Ajouter une citerne"}
                </span>
              </nav>

              {/* Titre et bouton de retour */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="h-7 w-1 rounded-full bg-[#657a3e]" />

                    <h1 className="text-[25px] font-bold leading-tight tracking-[-0.04em] text-[#202b3d] sm:text-[30px]">
                      {isEdit
                        ? "Modifier une citerne"
                        : "Ajouter une citerne"}
                    </h1>
                  </div>

                  <p className="mt-2 max-w-xl pl-[14px] text-[13px] leading-5 text-[#748096] sm:text-sm">
                    {isEdit
                      ? "Modifiez les informations de la citerne sélectionnée."
                      : "Renseignez les informations de votre nouvelle citerne pour l’intégrer à votre espace de stockage."}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-10 shrink-0 self-start rounded-lg border-[#dce4d2] bg-white/90 px-4 text-[12px] font-semibold text-[#526832] shadow-sm transition hover:border-[#b9c9a5] hover:bg-[#f2f6eb] sm:self-center"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour aux citernes
                </Button>
              </div>
            </div>
          </header>

          {/* Indicateur de progression */}
          <section
            aria-label="Étapes du formulaire"
            className="mb-4 rounded-xl border border-[#edf0e8] bg-white px-4 py-4 shadow-[0_2px_10px_rgba(24,36,18,0.025)] sm:px-7"
          >
            <div className="mx-auto grid max-w-3xl grid-cols-3">
              {/* Étape 1 */}
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#556B2F] text-xs font-bold text-white shadow-[0_2px_5px_rgba(85,107,47,0.18)]">
                  1
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold text-[#29351f] sm:text-[12px]">
                    Informations générales
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-[#8a9480] sm:block">
                    Données de la citerne
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="absolute left-[-20%] right-[85%] top-4 hidden border-t border-dashed border-[#d9dfd0] sm:block" />

                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e5e8ee] bg-[#f5f6f8] text-xs font-bold text-[#8791a2]">
                  2
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold text-[#68758a] sm:text-[12px]">
                    Vérification
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-[#9aa3b2] sm:block">
                    Contrôle des informations
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e5e8ee] bg-[#f5f6f8] text-xs font-bold text-[#8791a2]">
                  3
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold text-[#68758a] sm:text-[12px]">
                    Enregistrement
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-[#9aa3b2] sm:block">
                    Ajout de la citerne
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Formulaire principal */}
          <form onSubmit={handleSubmit} noValidate>
            <section className="overflow-hidden rounded-xl border border-[#e7eae2] bg-white shadow-[0_4px_18px_rgba(24,36,18,0.035)]">
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6 sm:py-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#e4eadb] bg-[#f0f4e8] text-[#556B2F]">
                    <Database size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-[15px] font-bold tracking-tight text-[#263247] sm:text-[17px]">
                      Informations générales
                    </h2>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#8490a3] sm:text-xs">
                      Saisissez les informations de base de la citerne.
                    </p>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#f5e6e4] bg-[#fff5f4] px-2 py-1.5 text-[9px] font-semibold text-[#b9504b] sm:px-2.5 sm:text-[10px]">
                  <span className="text-red-500">*</span>
                  <span className="hidden sm:inline">
                    Champs obligatoires
                  </span>
                  <span className="sm:hidden">Obligatoires</span>
                </span>
              </div>

              {/* Champs du formulaire */}
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 sm:gap-y-6">
                  {/* Référence */}
                  <div className="min-w-0">
                    <label htmlFor="reference" className={labelClass}>
                      Référence
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative mt-2">
                      <Hash
                        className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#74839a]"
                        strokeWidth={1.8}
                      />

                      <input
                        id="reference"
                        name="reference"
                        type="text"
                        value={formData.reference}
                        onChange={handleChange}
                        placeholder="Ex. CIT-001"
                        autoComplete="off"
                        required
                        aria-describedby="reference-help"
                        className={inputClass}
                      />
                    </div>

                    <p id="reference-help" className={helperClass}>
                      Identifiant unique de la citerne.
                    </p>
                  </div>

                  {/* Nom de la citerne */}
                  <div className="min-w-0">
                    <label htmlFor="name" className={labelClass}>
                      Nom de la citerne
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative mt-2">
                      <Database
                        className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#74839a]"
                        strokeWidth={1.8}
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex. Citerne principale"
                        autoComplete="off"
                        required
                        aria-describedby="name-help"
                        className={inputClass}
                      />
                    </div>

                    <p id="name-help" className={helperClass}>
                      Nom permettant de reconnaître la citerne.
                    </p>
                  </div>

                  {/* Capacité */}
                  <div className="min-w-0">
                    <label htmlFor="capacite" className={labelClass}>
                      Capacité
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative mt-2">
                      <Droplets
                        className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#74839a]"
                        strokeWidth={1.8}
                      />

                      <input
                        id="capacite"
                        name="capacite"
                        type="number"
                        min="0.01"
                        step="any"
                        value={formData.capacite}
                        onChange={handleChange}
                        placeholder="Ex. 3000"
                        required
                        aria-describedby="capacite-help"
                        className={`${inputClass} pr-14`}
                      />

                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-[#f0f3e9] px-2.5 py-1.5 text-[11px] font-bold text-[#526832]">
                        L
                      </span>
                    </div>

                    <p id="capacite-help" className={helperClass}>
                      Capacité de stockage en litres.
                    </p>
                  </div>

                  {/* Date de fabrication */}
                  <div className="min-w-0">
                    <label
                      htmlFor="dateFabrication"
                      className={labelClass}
                    >
                      Date de fabrication
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative mt-2">
                      <CalendarDays
                        className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#74839a]"
                        strokeWidth={1.8}
                      />

                      <input
                        id="dateFabrication"
                        name="dateFabrication"
                        type="date"
                        value={formData.dateFabrication}
                        onChange={handleChange}
                        required
                        aria-describedby="date-help"
                        className={`${inputClass} pl-11 pr-3`}
                      />
                    </div>

                    <p id="date-help" className={helperClass}>
                      Date de fabrication de la citerne.
                    </p>
                  </div>
                </div>

                {/* Aperçu de la capacité */}
                {formattedCapacity && (
                  <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#e6ebde] bg-[#f8faf5] px-3.5 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf2e4] text-[#556B2F]">
                      <Droplets size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-[#87917b]">
                        Capacité renseignée
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-[#344126]">
                        {formattedCapacity} L
                      </p>
                    </div>

                    <CheckCircle2
                      className="ml-auto size-[17px] shrink-0 text-[#718747]"
                    />
                  </div>
                )}
              </div>

              {/* Erreur */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mx-5 mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700 sm:mx-6"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />

                  <p className="min-w-0 flex-1 break-words">
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    aria-label="Fermer le message d'erreur"
                    className="shrink-0 rounded p-0.5 transition hover:bg-red-100"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* Pied de formulaire */}
              <footer className="flex flex-col gap-3 border-t border-[#edf0e9] bg-[#fbfcf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-[10px] leading-4 text-[#929a8a]">
                  <span className="font-semibold text-red-500">*</span>
                  {" "}Tous les champs sont obligatoires.
                </p>

                <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="h-10 rounded-lg border-[#dfe4e9] bg-white px-5 text-[12px] font-semibold text-[#657186] shadow-sm transition hover:border-[#cbd3dc] hover:bg-[#f7f8fa] disabled:opacity-50"
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-10 rounded-lg bg-[#556B2F] px-5 text-[12px] font-semibold text-white shadow-[0_2px_6px_rgba(85,107,47,0.16)] transition hover:bg-[#465925] focus-visible:ring-2 focus-visible:ring-[#556B2F]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 size-4" />
                    )}

                    {loading
                      ? "Enregistrement..."
                      : isEdit
                        ? "Enregistrer les modifications"
                        : "Ajouter la citerne"}

                    {!loading && (
                      <ArrowRight className="ml-2 size-4" />
                    )}
                  </Button>
                </div>
              </footer>
            </section>
          </form>
        </div>
      </Container>

      {/* Modale de succès : comportement conservé */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/35 px-4 py-6 backdrop-blur-[3px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-[#e7ebdf] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="h-1.5 bg-[#556B2F]" />

            <div className="px-6 pb-6 pt-7 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#e3ead8] bg-[#f0f4e9] text-[#556B2F]">
                <Check size={27} strokeWidth={2.2} />
              </div>

              <h2
                id="success-title"
                className="mt-4 text-xl font-bold tracking-tight text-[#263247]"
              >
                {isEdit ? "Citerne modifiée !" : "Citerne ajoutée !"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8490a3]">
                {isEdit
                  ? "Les modifications ont été enregistrées avec succès."
                  : "La nouvelle citerne a été enregistrée avec succès."}
              </p>

              <div className="mt-5 space-y-3 rounded-xl border border-[#e9ede4] bg-[#fafbf8] p-4 text-left">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[#8790a0]">
                    Référence
                  </span>

                  <span className="break-all text-right text-xs font-semibold text-[#29351f]">
                    {formData.reference}
                  </span>
                </div>

                <div className="h-px bg-[#e9ede4]" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[#8790a0]">
                    Capacité
                  </span>

                  <span className="text-sm font-bold text-[#556B2F]">
                    {formattedCapacity || "0"} L
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSuccess}
                className="mt-5 h-11 w-full rounded-lg bg-[#556B2F] text-sm font-semibold text-white transition hover:bg-[#465925]"
              >
                Voir les citernes
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AjouterCiternePage;
