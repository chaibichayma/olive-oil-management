
import { useCallback, useEffect, useState } from "react";
import {
  ChevronRight,
  Database,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { Citerne, CiterneTable } from "./citerne-table";

const API_URL = "/olive_app/citerne/getListBean";

type ApiObject = Record<string, unknown>;

function extractList(data: unknown): ApiObject[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is ApiObject =>
        typeof item === "object" && item !== null
    );
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const obj = data as ApiObject;

  for (const key of [
    "data",
    "content",
    "result",
    "results",
    "items",
    "list",
  ]) {
    const value = obj[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is ApiObject =>
          typeof item === "object" && item !== null
      );
    }
  }

  return [];
}

function readValue(
  obj: ApiObject,
  keys: string[]
): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return undefined;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const result = Number(value.replace(",", ".").trim());
    return Number.isFinite(result) ? result : 0;
  }

  return 0;
}

function formatDate(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;

    return `${String(day).padStart(2, "0")}/${String(
      month
    ).padStart(2, "0")}/${year}`;
  }

  const raw = String(value).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    return raw;
  }

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return raw;
}

function normalizeCiterne(
  item: ApiObject
): Citerne | null {
  const rawId = readValue(item, [
    "citerneId",
    "id",
    "idCiterne",
    "id_citerne",
  ]);

  if (rawId === undefined || rawId === "") {
    console.warn("Identifiant absent pour cette citerne :", item);
    return null;
  }

  const citerneId = toNumber(rawId);

  if (citerneId <= 0) {
    console.warn("Identifiant invalide pour cette citerne :", item);
    return null;
  }

  const reference = readValue(item, [
    "reference",
    "ref",
    "referenceCiterne",
    "code",
  ]);

  const libelle = readValue(item, [
    "libelle",
    "name",
    "nom",
    "nomCiterne",
    "designation",
  ]);

  const capacity = readValue(item, [
    "capacity",
    "capacite",
    "capaciteCiterne",
    "volume",
    "contenance",
  ]);

  const dateFabrication = readValue(item, [
    "dateFabrication",
    "date_fabrication",
    "dateFab",
    "dateCreation",
    "createdDate",
    "date",
  ]);

  return {
    citerneId,
    reference: String(reference ?? ""),
    libelle: String(libelle ?? ""),
    capacity: toNumber(capacity),
    dateFabrication: formatDate(dateFabrication),
  };
}

export function CiternePage() {
  const navigate = useNavigate();

  const [citernes, setCiternes] = useState<Citerne[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [citerneToDelete, setCiterneToDelete] =
    useState<Citerne | null>(null);

  const loadCiternes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?searche=`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Erreur HTTP ${response.status}${
            details ? ` : ${details}` : ""
          }`
        );
      }

      const data: unknown = await response.json();

      console.log("Réponse GET citernes :", data);

      const records = extractList(data);
      const normalized = records
        .map(normalizeCiterne)
        .filter((item): item is Citerne => item !== null);

      setCiternes(normalized);

      if (records.length === 0) {
        console.warn(
          "Aucune liste de citernes reconnue dans la réponse."
        );
      }
    } catch (err) {
      console.error("Erreur lors du chargement des citernes :", err);

      setCiternes([]);
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les citernes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCiternes();
  }, [loadCiternes]);

  const handleAdd = () => {
    navigate("/store-admin/tanks/add");
  };

  const handleEdit = (citerne: Citerne) => {
    navigate(
      `/store-admin/tanks/edit/${citerne.citerneId}`
    );
  };

  const handleDelete = (citerne: Citerne) => {
    setCiterneToDelete(citerne);
  };

  const handleCancelDelete = () => {
    setCiterneToDelete(null);
  };

  
const handleConfirmDelete = async () => {
  if (!citerneToDelete) return;

  setError("");

  try {
    const id = citerneToDelete.citerneId;

    const response = await fetch(
      `/olive_app/citerne/delete/${id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      }
    );

    const message = await response.text();

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status}${
          message ? ` : ${message}` : ""
        }`
      );
    }

    // Fermer la fenêtre de confirmation.
    setCiterneToDelete(null);

    // Actualiser la liste depuis le backend.
    await loadCiternes();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);

    setError(
      err instanceof Error
        ? err.message
        : "Impossible de supprimer la citerne."
    );
  }
};


  return (
    <>
      <Container>
        <div className="py-5 lg:py-6">
      
<div className="mb-4 flex items-center gap-2 font-sans text-sm tracking-wide text-[#64748b]">

  <span className="font-medium transition-colors hover:text-[#556B2F]">
    Paramétrage
  </span>

  <ChevronRight className="size-4 text-[#94a3b8]" />

  <span className="font-semibold text-[#334155]">
    Citernes
  </span>

</div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#eef4e6]">
                <Database className="size-7 text-[#556B2F]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
                  Citernes
                </h1>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  Gestion des citernes de stockage
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              className="h-11 rounded-lg bg-[#556B2F] px-5 font-semibold text-white shadow-sm transition-all hover:bg-[#465A27] hover:shadow-md"
            >
              <Plus className="size-4" />
              Ajouter une citerne
            </Button>
          </div>
        </div>
      </Container>

      <Container>
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Fermer le message"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <CiterneTable
          citernes={citernes}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={() => void loadCiternes()}
        />
      </Container>

      {citerneToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="relative w-full max-w-[500px] rounded-xl bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="size-10 text-red-500" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2
                id="delete-title"
                className="text-2xl font-bold text-gray-900"
              >
                Supprimer la citerne
              </h2>

              <p className="mt-3 text-base text-gray-500">
                Voulez-vous vraiment supprimer la citerne
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {citerneToDelete.reference ||
                  citerneToDelete.libelle}{" "}
                ?
              </p>
            </div>

            <div className="mt-7 flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-12 min-w-[125px] rounded-lg"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-12 min-w-[150px] rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-5" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CiternePage;

