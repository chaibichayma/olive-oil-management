
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Database,
  Droplets,
  Hash,
  Home,
  LoaderCircle,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

const API_URL = "/olive_app/citerne/save";

interface CiterneFormData {
  reference: string;
  name: string;
  capacite: string;
  dateFabrication: string;
}

export function AjouterCiternePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CiterneFormData>({
    reference: "",
    name: "",
    capacite: "",
    dateFabrication: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const reference = formData.reference.trim();
    const name = formData.name.trim();
    const capacite = Number(formData.capacite);

    if (!reference || !name || !formData.dateFabrication) {
      setErrorMessage(
        "Veuillez remplir tous les champs obligatoires."
      );
      return;
    }

    if (!Number.isFinite(capacite) || capacite <= 0) {
      setErrorMessage(
        "La capacité doit être un nombre supérieur à zéro."
      );
      return;
    }

    const payload = {
      reference,
      name,
      capacite,
      dateFabrication: formData.dateFabrication,
    };

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
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

        if (
          typeof responseData === "string" &&
          responseData.trim()
        ) {
          message += ` ${responseData}`;
        } else if (
          typeof responseData === "object" &&
          responseData !== null
        ) {
          const data = responseData as Record<string, unknown>;
          const backendMessage =
            data.message ??
            data.detail ??
            data.error ??
            data.title;

          if (backendMessage) {
            message += ` ${String(backendMessage)}`;
          }
        }

        throw new Error(message);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de la citerne :",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    navigate("/store-admin/tanks");
  };

  return (
    <>
      <Container>
        <div className="w-full py-5 sm:py-6 lg:py-7">
          {/* Fil d'Ariane */}
          
          {/* En-tête minimaliste */}
          <header className="mb-8 border-b border-slate-200 pb-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-[34px]">
                  Ajouter une citerne
                </h1>

                <p className="mt-1.5 text-base leading-6 text-slate-500">
                  Renseignez les informations de la nouvelle citerne.
                </p>
              </div>

              
<Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="h-11 shrink-0 self-start rounded-xl border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] shadow-sm transition-all duration-200 hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
>
  <ArrowLeft className="mr-2 size-4 text-[#718747]" />
  Retour aux citernes
</Button>

            </div>
          </header>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate>
  <div className="space-y-4">
    {/* Informations générales */}
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.025)]">
      {/* En-tête de section */}
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033]">
            Informations générales
          </h2>

          <p className="mt-1 text-base text-slate-500">
            Saisissez les informations de base de la citerne.
          </p>
        </div>

        <p className="shrink-0 text-sm text-slate-500">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </div>
                {/* Champs */}
                <div className="px-6 py-6 sm:px-8 sm:py-7">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                    {/* Référence */}
                    <div className="min-w-0 space-y-2.5">
                      <label
                        htmlFor="reference"
                        className="flex items-center gap-2 text-base font-semibold text-[#172033]"
                      >
                        <span>Référence</span>
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Hash className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />

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
                          className="h-[60px] w-full rounded-xl border border-slate-200 bg-white pl-[60px] pr-4 text-base text-[#172033] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#71864e] focus:ring-2 focus:ring-[#556B2F]/10"
                        />
                      </div>

                      <p
                        id="reference-help"
                        className="text-sm leading-5 text-slate-500"
                      >
                        Identifiant unique de la citerne.
                      </p>
                    </div>

                    {/* Nom de la citerne */}
                    <div className="min-w-0 space-y-2.5">
                      <label
                        htmlFor="name"
                        className="flex items-center gap-2 text-base font-semibold text-[#172033]"
                      >
                        <span>Nom de la citerne</span>
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Database className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />

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
                          className="h-[60px] w-full rounded-xl border border-slate-200 bg-white pl-[60px] pr-4 text-base text-[#172033] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#71864e] focus:ring-2 focus:ring-[#556B2F]/10"
                        />
                      </div>

                      <p
                        id="name-help"
                        className="text-sm leading-5 text-slate-500"
                      >
                        Nom permettant de reconnaître la citerne.
                      </p>
                    </div>

                    {/* Capacité */}
                    <div className="min-w-0 space-y-2.5">
                      <label
                        htmlFor="capacite"
                        className="flex items-center gap-2 text-base font-semibold text-[#172033]"
                      >
                        <span>Capacité</span>
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Droplets className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />

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
                          className="h-[60px] w-full rounded-xl border border-slate-200 bg-white pl-[60px] pr-16 text-base text-[#172033] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#71864e] focus:ring-2 focus:ring-[#556B2F]/10"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                          L
                        </span>
                      </div>

                      <p
                        id="capacite-help"
                        className="text-sm leading-5 text-slate-500"
                      >
                        Capacité de stockage en litres.
                      </p>
                    </div>

                    {/* Date de fabrication */}
                    <div className="min-w-0 space-y-2.5">
                      <label
                        htmlFor="dateFabrication"
                        className="flex items-center gap-2 text-base font-semibold text-[#172033]"
                      >
                        <span>Date de fabrication</span>
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />

                        <input
                          id="dateFabrication"
                          name="dateFabrication"
                          type="date"
                          value={formData.dateFabrication}
                          onChange={handleChange}
                          required
                          aria-describedby="date-help"
                          className="h-[60px] w-full rounded-xl border border-slate-200 bg-white pl-[60px] pr-4 text-base text-[#172033] outline-none transition hover:border-slate-300 focus:border-[#71864e] focus:ring-2 focus:ring-[#556B2F]/10"
                        />
                      </div>

                      <p
                        id="date-help"
                        className="text-sm leading-5 text-slate-500"
                      >
                        Date de fabrication de la citerne.
                      </p>
                    </div>
                  </div>

                  {/* Aperçu de la capacité */}
                  {formData.capacite &&
                    Number.isFinite(Number(formData.capacite)) &&
                    Number(formData.capacite) > 0 && (
                      <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f4e9] text-[#556B2F]">
                          <Droplets className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm text-slate-500">
                            Capacité de stockage renseignée
                          </p>

                          <p className="mt-0.5 text-lg font-bold text-[#172033]">
                            {Number(
                              formData.capacite
                            ).toLocaleString("fr-FR")}{" "}
                            L
                          </p>
                        </div>

                        <CheckCircle2 className="ml-auto size-5 shrink-0 text-[#556B2F]" />
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

                  <p className="min-w-0 flex-1 break-words">
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    className="shrink-0 rounded-md p-1 transition hover:bg-red-100"
                    aria-label="Fermer le message d'erreur"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Actions */}
<div className="flex justify-end border-t border-slate-200 pt-5">
  <div className="flex flex-col-reverse gap-3 sm:flex-row">
    <Button
      type="button"
      variant="outline"
      onClick={handleCancel}
      disabled={loading}
      className="h-11 rounded-xl border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
    >
      Annuler
    </Button>

    <Button
      type="submit"
      disabled={loading}
      className="h-11 rounded-xl bg-[#556B2F] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465A27] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <LoaderCircle className="mr-2 size-4 animate-spin" />
      ) : (
        <Save className="mr-2 size-4" />
      )}

      {loading ? "Enregistrement..." : "Ajouter la citerne"}
    </Button>
  </div>
</div>
            </div>
          </form>
        </div>
      </Container>

      {/* Modale de succès */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f0f4e9] text-[#556B2F]">
              <Check className="size-7" />
            </div>

            <h2
              id="success-title"
              className="mt-5 text-xl font-bold text-[#172033]"
            >
              Citerne ajoutée !
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              La nouvelle citerne a été enregistrée avec succès.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">
                  Référence
                </span>

                <span className="font-semibold text-[#172033]">
                  {formData.reference}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">
                  Capacité
                </span>

                <span className="font-semibold text-[#556B2F]">
                  {Number(
                    formData.capacite
                  ).toLocaleString("fr-FR")}{" "}
                  L
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSuccess}
              className="mt-6 h-11 w-full rounded-xl bg-[#556B2F] font-semibold text-white hover:bg-[#465A27]"
            >
              Voir les citernes
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default AjouterCiternePage;
