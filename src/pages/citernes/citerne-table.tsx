
import { useMemo, useRef, useState } from "react";

import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type ICellRendererParams,
  themeQuartz,
} from "ag-grid-community";

import { AgGridProvider, AgGridReact } from "ag-grid-react";

import {
  CalendarDays,
  Database,
  Download,
  Filter,
  Pencil,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([AllCommunityModule]);

/* =========================================================
   TYPE CITERNE : NOMS DU BACKEND
========================================================= */

export interface Citerne {
  citerneId: number;
  reference: string;
  libelle: string;
  capacity: number;
  dateFabrication: string;
}

/* =========================================================
   PROPS
========================================================= */

interface CiterneTableProps {
  citernes: Citerne[];
  loading?: boolean;
  onEdit?: (citerne: Citerne) => void;
  onDelete?: (citerne: Citerne) => void;
  onRefresh?: () => void;
}

/* =========================================================
   THÈME AG GRID
========================================================= */

const citerneTheme = themeQuartz.withParams({
  accentColor: "#556B2F",
  backgroundColor: "#ffffff",
  foregroundColor: "#172033",
  headerBackgroundColor: "#f8fafc",
  headerTextColor: "#172033",
  headerFontWeight: 600,
  borderColor: "#e5e7eb",
  rowBorder: {
    style: "solid",
    width: 1,
    color: "#edf0f2",
  },
  fontSize: 13,
  cellHorizontalPadding: 14,
  spacing: 8,
});

/* =========================================================
   FORMATAGE DES DONNÉES
========================================================= */

function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

function formatDate(value?: string): string {
  if (!value) return "—";

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  // Format DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  // Format ISO avec heure
  if (value.includes("T")) {
    const date = value.split("T")[0];
    const [year, month, day] = date.split("-");

    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
  }

  return value;
}

/* =========================================================
   TABLE DES CITERNES
========================================================= */

export function CiterneTable({
  citernes,
  loading = false,
  onEdit,
  onDelete,
  onRefresh,
}: CiterneTableProps) {
  const gridApiRef = useRef<GridApi<Citerne> | null>(null);

  const [search, setSearch] = useState("");

  const [capacityFilter, setCapacityFilter] = useState(
    "Toutes les capacités"
  );

  /* =======================================================
     INITIALISATION AG GRID
  ======================================================= */

  const handleGridReady = (event: GridReadyEvent<Citerne>) => {
    gridApiRef.current = event.api;
  };

  /* =======================================================
     RECHERCHE ET FILTRES
  ======================================================= */

  const filteredCiternes = useMemo(() => {
    let result = [...citernes];

    if (search.trim()) {
      const value = search.trim().toLowerCase();

      result = result.filter((citerne) => {
        return (
          (citerne.reference ?? "").toLowerCase().includes(value) ||
          (citerne.libelle ?? "").toLowerCase().includes(value) ||
          String(citerne.capacity ?? "").includes(value) ||
          formatDate(citerne.dateFabrication)
            .toLowerCase()
            .includes(value)
        );
      });
    }

    if (capacityFilter === "Petites capacités") {
      result = result.filter(
        (citerne) =>
          citerne.capacity > 0 && citerne.capacity < 3000
      );
    }

    if (capacityFilter === "Capacités moyennes") {
      result = result.filter(
        (citerne) =>
          citerne.capacity >= 3000 && citerne.capacity < 5000
      );
    }

    if (capacityFilter === "Grandes capacités") {
      result = result.filter(
        (citerne) => citerne.capacity >= 5000
      );
    }

    return result;
  }, [citernes, search, capacityFilter]);

  /* =======================================================
     STATISTIQUES
  ======================================================= */

  const totalCapacity = useMemo(
    () =>
      citernes.reduce(
        (sum, citerne) => sum + (Number(citerne.capacity) || 0),
        0
      ),
    [citernes]
  );

  const activeCount = citernes.filter(
    (citerne) => Number(citerne.capacity) > 0
  ).length;

  const maintenanceCount = citernes.filter(
    (citerne) => Number(citerne.capacity) <= 0
  ).length;

  /* =======================================================
     RÉINITIALISER
  ======================================================= */

  const handleReset = () => {
    setSearch("");
    setCapacityFilter("Toutes les capacités");
    gridApiRef.current?.setFilterModel(null);
  };

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const handleExport = () => {
    gridApiRef.current?.exportDataAsCsv({
      fileName: "citernes.csv",
      columnKeys: [
        "reference",
        "libelle",
        "capacity",
        "dateFabrication",
      ],
    });
  };

  /* =======================================================
     RENDU DE LA RÉFÉRENCE
  ======================================================= */

  const ReferenceRenderer = (
    params: ICellRendererParams<Citerne>
  ) => {
    const citerne = params.data;

    if (!citerne) return null;

    return (
      <div className="flex h-full items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6]">
          <Database className="size-[17px] text-[#66823A]" />
        </div>

        <span className="text-sm font-semibold text-[#172033]">
          {citerne.reference || "—"}
        </span>
      </div>
    );
  };

  /* =======================================================
     RENDU DU NOM
  ======================================================= */

  const NameRenderer = (
    params: ICellRendererParams<Citerne>
  ) => (
    <span className="text-sm text-[#334155]">
      {params.data?.libelle || "—"}
    </span>
  );

  /* =======================================================
     RENDU DE LA CAPACITÉ
  ======================================================= */

  const CapacityRenderer = (
    params: ICellRendererParams<Citerne>
  ) => {
    const value = Number(params.data?.capacity ?? 0);

    return (
      <span className="text-sm font-medium text-[#334155]">
        {formatNumber(Number.isFinite(value) ? value : 0)} L
      </span>
    );
  };

  /* =======================================================
     RENDU DE LA DATE
  ======================================================= */

  const DateRenderer = (
    params: ICellRendererParams<Citerne>
  ) => (
    <div className="flex h-full items-center gap-2">
      <CalendarDays className="size-4 text-[#64748b]" />

      <span className="text-sm text-[#334155]">
        {formatDate(params.data?.dateFabrication)}
      </span>
    </div>
  );

  /* =======================================================
     COLONNES
  ======================================================= */

  const columnDefs = useMemo<ColDef<Citerne>[]>(
    () => [
      {
        field: "reference",
        headerName: "Référence",
        minWidth: 190,
        width: 230,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: ReferenceRenderer,
      },
      {
        field: "libelle",
        headerName: "Nom",
        minWidth: 210,
        width: 250,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: NameRenderer,
      },
      {
        field: "capacity",
        headerName: "Capacité (L)",
        minWidth: 220,
        width: 250,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: CapacityRenderer,
      },
      {
        field: "dateFabrication",
        headerName: "Date de fabrication",
        minWidth: 230,
        width: 270,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: DateRenderer,
      },
      {
        colId: "edit",
        headerName: "Modifier",
        width: 115,
        minWidth: 115,
        maxWidth: 115,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<Citerne>
        ) => {
          const citerne = params.data;

          if (!citerne) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Modifier"
                aria-label={`Modifier ${citerne.reference}`}
                onClick={() => onEdit?.(citerne)}
                className="flex size-9 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition-all hover:bg-[#dfead2] hover:text-[#3f5124]"
              >
                <Pencil className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
      {
        colId: "delete",
        headerName: "Supprimer",
        width: 125,
        minWidth: 125,
        maxWidth: 125,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: "right",
        cellRenderer: (
          params: ICellRendererParams<Citerne>
        ) => {
          const citerne = params.data;

          if (!citerne) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Supprimer"
                aria-label={`Supprimer ${citerne.reference}`}
                onClick={() => onDelete?.(citerne)}
                className="flex size-9 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition-all hover:bg-[#fbdadd] hover:text-[#d92735]"
              >
                <Trash2 className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

  /* =======================================================
     CONFIGURATION DES COLONNES
  ======================================================= */

  const defaultColDef = useMemo<ColDef<Citerne>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: false,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    }),
    []
  );

  /* =======================================================
     AFFICHAGE
  ======================================================= */

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

        {/* STATISTIQUES */}

        <div className="grid grid-cols-1 gap-3 border-b border-[#edf0f2] bg-[#fafcf9] px-4 py-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex h-[72px] items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white px-5 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4e6]">
              <Database className="size-[22px] text-[#66823A]" />
            </div>

            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-6 text-[#172033]">
                {citernes.length}
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[12px] text-[#7b8798]">
                Citernes au total
              </p>
            </div>
          </div>

          <div className="flex h-[72px] items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white px-5 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf6ff]">
              <Database className="size-[22px] text-[#62A5F5]" />
            </div>

            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-6 text-[#172033]">
                {formatNumber(totalCapacity)} L
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[12px] text-[#7b8798]">
                Capacité totale
              </p>
            </div>
          </div>

          <div className="flex h-[72px] items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white px-5 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef6e9]">
              <div className="flex size-6 items-center justify-center rounded-full border-2 border-[#66823A]">
                <span className="text-xs font-bold text-[#66823A]">
                  ✓
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-6 text-[#172033]">
                {activeCount}
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[12px] text-[#7b8798]">
                Citernes avec capacité positive
              </p>
            </div>
          </div>

          <div className="flex h-[72px] items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white px-5 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffecef]">
              <X className="size-6 text-[#ef3340]" />
            </div>

            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-6 text-[#172033]">
                {maintenanceCount}
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[12px] text-[#7b8798]">
                Capacité absente ou nulle
              </p>
            </div>
          </div>
        </div>

        {/* RECHERCHE ET ACTIONS */}

        <div className="flex flex-col gap-3 border-b border-[#edf0f2] p-4 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#64748b]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une citerne (référence, nom...)"
              className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-4 text-sm text-[#334155] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-[#64748b]" />

            <select
              value={capacityFilter}
              onChange={(event) =>
                setCapacityFilter(event.target.value)
              }
              className="h-11 w-full appearance-none rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-9 text-sm font-medium text-[#334155] outline-none transition-all focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10 xl:w-[210px]"
            >
              <option>Toutes les capacités</option>
              <option>Petites capacités</option>
              <option>Capacités moyennes</option>
              <option>Grandes capacités</option>
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 rounded-lg border-[#dfe4e9] px-4 text-[#334155] hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
          >
            <RefreshCcw className="size-4" />
            Réinitialiser
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={citernes.length === 0}
            className="h-11 rounded-lg border-[#dfe4e9] px-4 text-[#334155] hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
          >
            <Download className="size-4" />
            Exporter
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="h-11 rounded-lg border-[#dfe4e9] px-4 text-[#334155] hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
          >
            <RefreshCcw
              className={`size-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        {/* RÉSULTATS */}

        <div className="px-4 pb-2 pt-3 text-sm text-[#64748b]">
          {loading
            ? "Chargement des citernes..."
            : `${filteredCiternes.length} résultat(s) sur ${citernes.length}`}
        </div>

        {/* TABLEAU */}

        <div className="w-full overflow-x-auto px-4 pb-4">
          <div
            style={{
              width: "100%",
              minWidth: "1080px",
              height: "600px",
            }}
          >
            <AgGridProvider modules={[AllCommunityModule]}>
              <AgGridReact<Citerne>
                rowData={filteredCiternes}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                theme={citerneTheme}
                rowHeight={58}
                headerHeight={50}
                pagination
                paginationPageSize={10}
                paginationPageSizeSelector={[5, 10, 20, 50]}
                animateRows
                suppressCellFocus
                getRowId={(params) =>
                  String(params.data.citerneId)
                }
                onGridReady={handleGridReady}
                overlayLoadingTemplate="<span>Chargement des citernes...</span>"
                overlayNoRowsTemplate="<span>Aucune citerne trouvée</span>"
                localeText={{
                  page: "Page",
                  more: "Plus",
                  to: "à",
                  of: "sur",
                  next: "Suivant",
                  last: "Dernier",
                  first: "Premier",
                  previous: "Précédent",
                  loadingOoo: "Chargement...",
                  noRowsToShow: "Aucune citerne trouvée",
                  pageSizeSelectorLabel: "Lignes par page",
                  filterOoo: "Filtrer...",
                  equals: "Égal à",
                  notEqual: "Différent de",
                  contains: "Contient",
                  notContains: "Ne contient pas",
                  startsWith: "Commence par",
                  endsWith: "Se termine par",
                  lessThan: "Inférieur à",
                  lessThanOrEqual: "Inférieur ou égal à",
                  greaterThan: "Supérieur à",
                  greaterThanOrEqual: "Supérieur ou égal à",
                  andCondition: "ET",
                  orCondition: "OU",
                  applyFilter: "Appliquer",
                  resetFilter: "Réinitialiser",
                  clearFilter: "Effacer",
                }}
              />
            </AgGridProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CiterneTable;
