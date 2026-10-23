
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Database,
  Droplets,
  Hash,
  LoaderCircle,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

interface Citerne {
  id?: number | string;
  citerneId?: number | string;
  reference?: string;
  libelle?: string;
  name?: string;
  capacity?: number | string;
  capacite?: number | string;
  dateFabrication?: string | number[] | null;
  [key: string]: unknown;
}

interface CiterneFormData {
  reference: string;
  libelle: string;
  capacity: string;
  dateFabrication: string;
}

const API_LIST = "/olive_app/citerne/getListBean?searche=";
const API_UPDATE = "/olive_app/citerne/update";
const LIST_PAGE = "/store-admin/tanks";

function extractCiternes(data: unknown): Citerne[] {
  if (Array.isArray(data)) {
    return data as Citerne[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const obj = data as Record<string, unknown>;

  for (const key of [
    "data",
    "content",
    "result",
    "results",
    "list",
    "items",
  ]) {
    const value = obj[key];

    if (Array.isArray(value)) {
      return value as Citerne[];
    }

    if (value && typeof value === "object") {
      const nested = extractCiternes(value);

      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

function getCiterneId(citerne: Citerne): string {
  return String(citerne.citerneId ?? citerne.id ?? "");
}

function toInputDate(
  value: string | number[] | null | undefined,
): string {
  if (!value) return "";

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;

    return `${String(year).padStart(4, "0")}-${String(
      month,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const raw = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const dateMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (dateMatch) {
    return `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
  }

  if (raw.includes("T")) {
    return raw.split("T")[0];
  }

  return "";
}

export function ModifierCiternePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<CiterneFormData>({
    reference: "",
    libelle: "",
    capacity: "",
    dateFabrication: "",
  });

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Charger les données de la citerne sélectionnée.
  useEffect(() => {
    let cancelled = false;

    async function loadCiterne() {
      if (!id || !Number.isSafeInteger(Number(id))) {
        setErrorMessage("Identifiant de citerne invalide.");
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setErrorMessage("");

      try {
        const response = await fetch(API_LIST, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}.`);
        }

        const data: unknown = await response.json();
        const citernes = extractCiternes(data);

        const citerne = citernes.find(
          (item) => getCiterneId(item) === id,
        );

        if (!citerne) {
          throw new Error(`La citerne ${id} est introuvable.`);
        }

        if (cancelled) return;

        setFormData({
          reference: String(citerne.reference ?? ""),
          libelle: String(citerne.libelle ?? citerne.name ?? ""),
          capacity: String(citerne.capacity ?? citerne.capacite ?? ""),
          dateFabrication: toInputDate(citerne.dateFabrication),
        });
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger la citerne.",
        );
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    }

    void loadCiterne();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleCancel = () => {
    navigate(LIST_PAGE);
  };

  // Envoyer les modifications au backend.
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    if (!id || !Number.isSafeInteger(Number(id))) {
      setErrorMessage("Identifiant de citerne invalide.");
      return;
    }

    const reference = formData.reference.trim();
    const libelle = formData.libelle.trim();
    const capacity = Number(formData.capacity);

    if (!reference || !libelle || !formData.dateFabrication) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (
      formData.capacity.trim() === "" ||
      !Number.isFinite(capacity) ||
      capacity <= 0
    ) {
      setErrorMessage(
        "La capacité doit être un nombre supérieur à zéro.",
      );
      return;
    }

    const payload = {
      citerneId: Number(id),
      reference,
      libelle,
      capacity,
      dateFabrication: formData.dateFabrication,
    };

    setSaving(true);

    try {
      const response = await fetch(API_UPDATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let responseData: unknown = null;

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = responseText;
        }
      }

      if (!response.ok) {
        let message = `Erreur HTTP ${response.status}.`;

        if (typeof responseData === "string" && responseData.trim()) {
          message += ` ${responseData}`;
        } else if (
          typeof responseData === "object" &&
          responseData !== null
        ) {
          const data = responseData as Record<string, unknown>;
          const backendMessage =
            data.message ?? data.detail ?? data.error ?? data.title;

          if (backendMessage) {
            message += ` ${String(backendMessage)}`;
          }
        }

        throw new Error(message);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Erreur lors de la modification de la citerne :",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la modification.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    navigate(LIST_PAGE);
  };

  return (
    <>
      <Container>
        <div className="w-full py-5 lg:py-6">
          {/* Fil d'Ariane */}
          

          {/* En-tête minimaliste */}
          <div className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                Modifier une citerne
              </h1>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:text-base">
                Modifiez les informations de votre citerne de stockage
                d'huile d'olive.
              </p>
            </div>

            <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="h-11 shrink-0 self-start rounded-xl border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] shadow-sm transition-all hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
>
  <ArrowLeft className="mr-2 size-4 text-[#718747]" />
  Retour aux citernes
</Button>
          </div>

          {/* Chargement */}
          {loadingData ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white">
              <LoaderCircle className="size-8 animate-spin text-[#556B2F]" />

              <p className="mt-4 text-sm font-medium text-slate-600">
                Chargement des informations de la citerne...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informations générales */}
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                  <h2 className="text-lg font-bold tracking-tight text-[#172033]">
                    Informations générales
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Modifiez les informations de base de la citerne.
                  </p>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-7">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Informations de la citerne
                    </p>

                    <p className="text-xs text-slate-400">
                      <span className="text-red-500">*</span>{" "}
                      Champs obligatoires
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-x-7 gap-y-6 md:grid-cols-2">
                    {/* Référence */}
                    <div className="space-y-2">
                      <label
                        htmlFor="reference"
                        className="flex items-center gap-2 text-sm font-semibold text-[#172033]"
                      >
                        <Hash className="size-4 text-[#71864e]" />
                        Référence
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="reference"
                        name="reference"
                        type="text"
                        value={formData.reference}
                        onChange={handleChange}
                        placeholder="Ex. CIT-001"
                        autoComplete="off"
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#71864e] focus:ring-4 focus:ring-[#556B2F]/10"
                      />

                      <p className="text-xs leading-5 text-slate-500">
                        Identifiant unique de la citerne.
                      </p>
                    </div>

                    {/* Nom */}
                    <div className="space-y-2">
                      <label
                        htmlFor="libelle"
                        className="flex items-center gap-2 text-sm font-semibold text-[#172033]"
                      >
                        <Database className="size-4 text-[#71864e]" />
                        Nom de la citerne
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="libelle"
                        name="libelle"
                        type="text"
                        value={formData.libelle}
                        onChange={handleChange}
                        placeholder="Ex. Citerne principale"
                        autoComplete="off"
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#71864e] focus:ring-4 focus:ring-[#556B2F]/10"
                      />

                      <p className="text-xs leading-5 text-slate-500">
                        Nom permettant de reconnaître la citerne.
                      </p>
                    </div>

                    {/* Capacité */}
                    <div className="space-y-2">
                      <label
                        htmlFor="capacity"
                        className="flex items-center gap-2 text-sm font-semibold text-[#172033]"
                      >
                        <Droplets className="size-4 text-[#71864e]" />
                        Capacité
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <input
                          id="capacity"
                          name="capacity"
                          type="number"
                          min="0.01"
                          step="any"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="Ex. 3000"
                          required
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#71864e] focus:ring-4 focus:ring-[#556B2F]/10"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-[#edf3e5] px-2.5 py-1 text-xs font-bold text-[#556B2F]">
                          L
                        </span>
                      </div>

                      <p className="text-xs leading-5 text-slate-500">
                        Capacité maximale de stockage en litres.
                      </p>
                    </div>

                    {/* Date de fabrication */}
                    <div className="space-y-2">
                      <label
                        htmlFor="dateFabrication"
                        className="flex items-center gap-2 text-sm font-semibold text-[#172033]"
                      >
                        <CalendarDays className="size-4 text-[#71864e]" />
                        Date de fabrication
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="dateFabrication"
                        name="dateFabrication"
                        type="date"
                        value={formData.dateFabrication}
                        onChange={handleChange}
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#71864e] focus:ring-4 focus:ring-[#556B2F]/10"
                      />

                      <p className="text-xs leading-5 text-slate-500">
                        Date de fabrication de l'équipement.
                      </p>
                    </div>
                  </div>

                  {/* Aperçu de la capacité */}
                  {formData.capacity &&
                    Number.isFinite(Number(formData.capacity)) &&
                    Number(formData.capacity) > 0 && (
                      <div className="mt-7 flex items-center gap-3 rounded-xl border border-[#e1e9d6] bg-[#f7f9f3] p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#556B2F]">
                          <Droplets className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500">
                            Capacité maximale
                          </p>

                          <p className="mt-0.5 text-lg font-bold text-[#405322]">
                            {Number(formData.capacity).toLocaleString(
                              "fr-FR",
                            )}{" "}
                            L
                          </p>
                        </div>

                        <CheckCircle2 className="ml-auto size-5 shrink-0 text-[#71864e]" />
                      </div>
                    )}
                </div>
              </section>

              {/* Erreur */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0" />

                  <p className="break-words">{errorMessage}</p>

                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    className="ml-auto shrink-0 rounded-md p-1 transition hover:bg-red-100"
                    aria-label="Fermer le message d'erreur"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end">
  <div className="flex flex-col-reverse gap-3 sm:flex-row">
    <Button
      type="button"
      variant="outline"
      onClick={handleCancel}
      disabled={saving}
      className="h-11 rounded-xl border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
    >
      <X className="mr-2 size-4" />
      Annuler
    </Button>

    <Button
      type="submit"
      disabled={saving}
      className="h-11 rounded-xl bg-[#556B2F] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465A27] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? (
        <LoaderCircle className="mr-2 size-4 animate-spin" />
      ) : (
        <Save className="mr-2 size-4" />
      )}

      {saving
        ? "Enregistrement..."
        : "Enregistrer les modifications"}
    </Button>
  </div>
              </div>
            </form>
          )}
        </div>
      </Container>

      {/* Modale de succès */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[3px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#edf4e5]">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#556B2F] text-white">
                <Check className="size-5" />
              </div>
            </div>

            <h2
              id="success-title"
              className="mt-5 text-xl font-bold text-[#172033]"
            >
              Modifications enregistrées !
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Les informations de la citerne ont été mises à jour avec succès.
            </p>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Référence</span>
                <span className="break-all text-right font-semibold text-slate-800">
                  {formData.reference}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Nom</span>
                <span className="break-all text-right font-semibold text-slate-800">
                  {formData.libelle}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Capacité</span>
                <span className="font-semibold text-[#556B2F]">
                  {Number(formData.capacity).toLocaleString("fr-FR")} L
                </span>
              </div>
            </div>

            <button
  type="button"
  onClick={handleSuccess}
  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#F5C58B] bg-[#FFF4E5] px-4 text-sm font-semibold text-[#C46A12] shadow-sm transition-colors duration-200 hover:bg-[#FFE8CC] focus:outline-none focus:ring-2 focus:ring-[#F5C58B] focus:ring-offset-2"
>
  Retour aux citernes
  <ChevronRight className="size-4" />
</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModifierCiternePage;
