
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CalendarDays,
  Check,
  Database,
  Save,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

interface Citerne {
  id?: number | string;
  citerneId?: number | string;
  reference?: string;
  libelle?: string;
  capacity?: number | string;
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

    // Prend également en charge { data: { ... } }.
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

function toText(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function toInputDate(
  value: string | number[] | null | undefined
): string {
  if (!value) {
    return "";
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;

    return `${String(year).padStart(4, "0")}-${String(
      month
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const raw = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const dateMatch = raw.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

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
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data: unknown = await response.json();

        console.log("Réponse GET citernes :", data);

        const citernes = extractCiternes(data);

        const citerne = citernes.find(
          (item) => getCiterneId(item) === id
        );

        if (!citerne) {
          throw new Error(
            `Citerne ${id} introuvable dans la liste retournée par le backend.`
          );
        }

        if (cancelled) return;

        console.log("Citerne sélectionnée :", citerne);

        setFormData({
          reference: toText(citerne.reference),
          libelle: toText(citerne.libelle),
          capacity: toText(citerne.capacity),
          dateFabrication: toInputDate(citerne.dateFabrication),
        });
      } catch (error) {
        if (cancelled) return;

        console.error("Erreur de chargement :", error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger la citerne."
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
  };

  const handleCancel = () => {
    navigate("/store-admin/tanks");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!id || !Number.isSafeInteger(Number(id))) {
      setErrorMessage("Identifiant de citerne invalide.");
      return;
    }

    if (
      !formData.reference.trim() ||
      !formData.libelle.trim() ||
      formData.capacity.trim() === "" ||
      !Number.isFinite(Number(formData.capacity)) ||
      Number(formData.capacity) <= 0
    ) {
      setErrorMessage(
        "Veuillez saisir une référence, un nom et une capacité supérieure à zéro."
      );
      return;
    }

    // Payload minimal : vérifier les propriétés attendues dans Swagger.
    const payload = {
      citerneId: Number(id),
      reference: formData.reference.trim(),
      libelle: formData.libelle.trim(),
      capacity: Number(formData.capacity),
    };

    console.log("Payload envoyé à /citerne/update :", payload);

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

      console.log("Statut update :", response.status);
      console.log("Réponse update :", responseText);

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${
            responseText || "Le serveur a refusé les données."
          }`
        );
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur de modification :", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la modification."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Container>
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-[#172033]">
            Modifier une citerne
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#64748b]">
            <span>Accueil</span>
            <span>/</span>
            <span>Paramétrage</span>
            <span>/</span>
            <span>Citernes</span>
            <span>/</span>
            <span className="font-medium text-[#556B2F]">
              Modifier
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#eef4e6]">
                <Database className="size-5 text-[#556B2F]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#172033]">
                  Informations de la citerne
                </h2>
                <p className="mt-0.5 text-sm text-[#64748b]">
                  Modifiez les informations de la citerne sélectionnée.
                </p>
              </div>
            </div>
          </div>

          {loadingData ? (
            <div className="px-6 py-10 text-center text-sm text-[#64748b]">
              Chargement des informations de la citerne...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="reference"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Référence
                  </label>

                  <div className="relative">
                    <Database className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="reference"
                      name="reference"
                      type="text"
                      value={formData.reference}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="libelle"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Nom de la citerne
                  </label>

                  <div className="relative">
                    <Database className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="libelle"
                      name="libelle"
                      type="text"
                      value={formData.libelle}
                      onChange={handleChange}
                      required
                      placeholder="Ex : Citerne 1"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="capacity"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Capacité
                  </label>

                  <div className="relative">
                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      placeholder="Ex : 5000"
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748b]">
                      L
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dateFabrication"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Date de fabrication
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      id="dateFabrication"
                      name="dateFabrication"
                      type="date"
                      value={formData.dateFabrication}
                      onChange={handleChange}
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>

                  <p className="mt-1 text-xs text-[#64748b]">
                    La date sera enregistrée uniquement si l’API
                    de modification prend ce champ en charge.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-border px-3 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="h-11 w-full rounded-md sm:w-auto"
                >
                  <X className="size-4" />
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={saving || loadingData}
                  className="h-11 w-full rounded-md bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27] sm:w-auto"
                >
                  <Save className="size-4" />
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#eef4e6]">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#556B2F]">
                  <Check className="size-5 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#172033]">
                Citerne modifiée
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Le serveur a accepté la requête de modification.
              </p>

              <Button
                type="button"
                onClick={() => navigate("/store-admin/tanks")}
                className="mt-5 h-10 min-w-[100px] rounded-md bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27]"
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

export default ModifierCiternePage;
