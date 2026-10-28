
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Database,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Droplet, ChartPie, Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { Citerne, CiterneTable } from "./citerne-table";

const API_URL = "/olive_app/citerne/getListBean";

type ApiObject = Record<string, unknown>;

type CiterneWithVolume = Citerne & {
  currentVolume?: number;
  fillPercentage?: number;
};

function extractList(data: unknown): ApiObject[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is ApiObject =>
        typeof item === "object" && item !== null,
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
          typeof item === "object" && item !== null,
      );
    }
  }

  return [];
}

function readValue(
  obj: ApiObject,
  keys: string[],
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
      month,
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
  item: ApiObject,
): CiterneWithVolume | null {
  const rawId = readValue(item, [
    "citerneId",
    "id",
    "idCiterne",
    "id_citerne",
  ]);

  if (rawId === undefined || rawId === "") {
    return null;
  }

  const citerneId = toNumber(rawId);

  if (citerneId <= 0) {
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

  const rawCurrentVolume = readValue(item, [
    "volumeActuel",
    "volumeCourant",
    "volumeStocke",
    "volumeUtilise",
    "quantiteActuelle",
    "quantiteHuile",
    "currentVolume",
  ]);

  const rawFillPercentage = readValue(item, [
    "pourcentageRemplissage",
    "tauxRemplissage",
    "niveauRemplissage",
    "fillPercentage",
  ]);

  const parsedCapacity = Math.max(0, toNumber(capacity));

  const parsedVolume =
    rawCurrentVolume !== undefined
      ? Math.max(0, toNumber(rawCurrentVolume))
      : undefined;

  const parsedPercentage =
    rawFillPercentage !== undefined
      ? Math.min(100, Math.max(0, toNumber(rawFillPercentage)))
      : undefined;

  return {
    citerneId,
    reference: String(reference ?? ""),
    libelle: String(libelle ?? ""),
    capacity: parsedCapacity,
    dateFabrication: formatDate(dateFabrication),
    currentVolume: parsedVolume,
    fillPercentage: parsedPercentage,
  };
}

function formatLiters(value: number): string {
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} L`;
}

export function CiternePage() {
  const navigate = useNavigate();

  const [citernes, setCiternes] = useState<CiterneWithVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [citerneToDelete, setCiterneToDelete] =
    useState<CiterneWithVolume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCiternes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}?searche=`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Erreur HTTP ${response.status}${
            details ? ` : ${details}` : ""
          }`,
        );
      }

      const data: unknown = await response.json();
      const records = extractList(data);

      const normalized = records
        .map(normalizeCiterne)
        .filter(
          (item): item is CiterneWithVolume => item !== null,
        );

      setCiternes(normalized);
    } catch (err) {
      console.error("Erreur lors du chargement des citernes :", err);

      setCiternes([]);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les citernes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCiternes();
  }, [loadCiternes]);

  const statistics = useMemo(() => {
    const totalCapacity = citernes.reduce(
      (sum, citerne) => sum + Math.max(0, citerne.capacity),
      0,
    );

    const hasAllVolumeData = citernes.every(
      (citerne) =>
        citerne.currentVolume !== undefined ||
        citerne.fillPercentage !== undefined,
    );

    const usedCapacity = hasAllVolumeData
      ? citernes.reduce((sum, citerne) => {
          const volume =
            citerne.currentVolume ??
            (citerne.capacity * (citerne.fillPercentage ?? 0)) / 100;

          return (
            sum +
            Math.min(
              Math.max(0, citerne.capacity),
              Math.max(0, volume),
            )
          );
        }, 0)
      : null;

    const availableCapacity =
      usedCapacity === null
        ? null
        : Math.max(0, totalCapacity - usedCapacity);

    const usagePercentage =
      usedCapacity === null || totalCapacity <= 0
        ? 0
        : Math.min(
            100,
            Math.round((usedCapacity / totalCapacity) * 100),
          );

    return {
      totalCapacity,
      usedCapacity,
      availableCapacity,
      usagePercentage,
    };
  }, [citernes]);

  const handleAdd = () => {
  navigate("/store-admin/tanks/ajouter");
};

  const handleEdit = (citerne: Citerne) => {
  navigate("/store-admin/tanks/ajouter", {
    state: { citerne },
  });
};

  const handleDelete = (citerne: Citerne) => {
    setCiterneToDelete(citerne as CiterneWithVolume);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setCiterneToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!citerneToDelete || isDeleting) return;

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/olive_app/citerne/delete/${citerneToDelete.citerneId}`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
          },
        },
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}${
            message ? ` : ${message}` : ""
          }`,
        );
      }

      setCiterneToDelete(null);
      await loadCiternes();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer la citerne.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Container>
        <div className="py-4 sm:py-5">
          {/* Header conforme à la maquette */}
          <header className="w-full">
            {/* Fil d'Ariane */}
            

            {/* Titre et action */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
  {/* Icône des citernes */}
  <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#556B2F]">
  <Warehouse className="size-7" strokeWidth={1.8} />
</div>

  {/* Titre et description */}
  <div className="min-w-0">
    <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[28px]">
      Citernes
    </h1>

    <p className="mt-1 text-[13px] font-medium leading-relaxed tracking-[0.015em] text-slate-500 sm:text-[14px]">
  Gestion des citernes de stockage d’huile d’olive
</p>
  </div>
</div>
              <Button
                type="button"
                onClick={handleAdd}
                className="h-9 shrink-0 rounded-md bg-[#556B2F] px-3 text-xs font-semibold text-white shadow-sm hover:bg-[#465A27] sm:px-4 sm:text-sm"
              >
                <Plus className="mr-1.5 size-4" />
                Ajouter une citerne
              </Button>
            </div>

            {/* Indicateurs horizontaux de capacité */}
<section
  aria-label="Capacité de stockage"
  className="mt-3 grid grid-cols-1 items-center gap-3 rounded-lg border border-slate-200/70 bg-white px-3 py-2 shadow-sm sm:grid-cols-3 sm:gap-0"
>
  {/* Capacité totale */}
  <div className="flex min-w-0 items-center gap-3 sm:pr-4">
    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#f0f4e9] text-[#556B2F]">
      <Database className="size-5" strokeWidth={1.8} />
    </div>

    <div className="min-w-0">
      <p className="text-[11px] font-medium leading-4 text-slate-500">
        Capacité totale
      </p>

      <p className="text-lg font-bold leading-5 tracking-tight text-slate-900">
        {formatLiters(statistics.totalCapacity)}
      </p>
    </div>
  </div>

  {/* Capacité utilisée */}
  <div className="flex min-w-0 items-center gap-3 border-y border-slate-100 py-2 sm:border-y-0 sm:border-x sm:px-4 sm:py-0">
    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#fff6e6] text-[#a66b08]">
      <Droplet className="size-5" strokeWidth={1.8} />
    </div>

    <div className="min-w-0">
      <p className="text-[11px] font-medium leading-4 text-slate-500">
        Capacité utilisée
      </p>

      <p className="text-lg font-bold leading-5 tracking-tight text-slate-900">
        {statistics.usedCapacity === null
          ? "—"
          : formatLiters(statistics.usedCapacity)}
      </p>
    </div>
  </div>

  {/* Capacité disponible */}
  <div className="flex min-w-0 items-center gap-3 sm:pl-4">
    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#f0f4e9] text-[#556B2F]">
      <ChartPie className="size-5" strokeWidth={1.8} />
    </div>

    <div className="min-w-0">
      <p className="text-[11px] font-medium leading-4 text-slate-500">
        Capacité disponible
      </p>

      <p className="text-lg font-bold leading-5 tracking-tight text-slate-900">
        {statistics.availableCapacity === null
          ? "—"
          : formatLiters(statistics.availableCapacity)}
      </p>
    </div>
  </div>
</section>
          </header>
        </div>
      </Container>

      <Container>
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Fermer le message"
              className="rounded-md p-1 hover:bg-red-100"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <CiterneTable
  citernes={citernes}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
      </Container>

      {/* Confirmation de suppression */}
      {citerneToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[3px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="relative w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-7 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-50"
            >
              <X className="size-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50">
                <Trash2 className="size-8 text-rose-500" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2
                id="delete-title"
                className="text-xl font-bold text-slate-900"
              >
                Supprimer la citerne ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Cette action supprimera la citerne sélectionnée.
                Voulez-vous continuer ?
              </p>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  {citerneToDelete.reference ||
                    citerneToDelete.libelle ||
                    `Citerne ${citerneToDelete.citerneId}`}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Capacité : {citerneToDelete.capacity} L
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="h-11 rounded-lg px-5"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting}
                className="h-11 rounded-lg bg-rose-500 px-5 font-semibold text-white hover:bg-rose-600 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 size-4" />
                    Confirmer la suppression
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CiternePage;
