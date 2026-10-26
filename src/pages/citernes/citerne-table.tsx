
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Pencil,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Citerne {
  citerneId: number;
  reference: string;
  libelle: string;
  capacity: number;
  dateFabrication: string;
}

interface CiterneTableProps {
  citernes: Citerne[];
  loading?: boolean;
  onEdit?: (citerne: Citerne) => void;
  onDelete?: (citerne: Citerne) => void;
  onRefresh?: () => void;
}

type CapacityFilter =
  | "all"
  | "small"
  | "medium"
  | "large";

const citerneTheme = themeQuartz.withParams({
  accentColor: "#556B2F",
  backgroundColor: "#ffffff",
  foregroundColor: "#172033",
  headerBackgroundColor: "#f8fafc",
  headerTextColor: "#334155",
  headerFontWeight: 600,
  borderColor: "#e8edf2",
  fontSize: 13,
  spacing: 8,
});

function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

function formatDate(value?: string): string {
  if (!value) return "—";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  if (value.includes("T")) {
    const [year, month, day] = value.split("T")[0].split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
  }

  return value;
}

export function CiterneTable({
  citernes,
  loading = false,
  onEdit,
  onDelete,
  onRefresh,
}: CiterneTableProps) {
  const gridApiRef = useRef<GridApi<Citerne> | null>(null);

  const [capacityFilter, setCapacityFilter] =
    useState<CapacityFilter>("all");

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCiternes = useMemo(() => {
    return citernes.filter((citerne) => {
      const capacity = Number(citerne.capacity) || 0;

      switch (capacityFilter) {
        case "small":
          return capacity > 0 && capacity < 3000;
        case "medium":
          return capacity >= 3000 && capacity < 5000;
        case "large":
          return capacity >= 5000;
        default:
          return true;
      }
    });
  }, [citernes, capacityFilter]);

  const filterOptions: {
    value: CapacityFilter;
    label: string;
    color: string;
    activeColor: string;
  }[] = [
    {
      value: "all",
      label: "Toutes les capacités",
      color: "#556B2F",
      activeColor: "#556B2F",
    },
    {
      value: "small",
      label: "Petites capacités",
      color: "#2680eb",
      activeColor: "#2475d0",
    },
    {
      value: "medium",
      label: "Capacités moyennes",
      color: "#d99022",
      activeColor: "#c78319",
    },
    {
      value: "large",
      label: "Grandes capacités",
      color: "#9655d9",
      activeColor: "#8545c7",
    },
  ];

  const counts = useMemo(() => {
    return {
      all: citernes.length,
      small: citernes.filter(
        (c) => Number(c.capacity) > 0 && Number(c.capacity) < 3000
      ).length,
      medium: citernes.filter(
        (c) => Number(c.capacity) >= 3000 && Number(c.capacity) < 5000
      ).length,
      large: citernes.filter(
        (c) => Number(c.capacity) >= 5000
      ).length,
    };
  }, [citernes]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCiternes.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);
  const navigate = useNavigate();

const handleAdd = () => {
  navigate("/store-admin/tanks/ajouter");
};

const handleEdit = (citerne: Citerne) => {
  navigate("/store-admin/tanks/ajouter", {
    state: { citerne },
  });
};

  const paginatedCiternes = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCiternes.slice(start, start + pageSize);
  }, [filteredCiternes, safePage, pageSize]);

  const handleGridReady = (event: GridReadyEvent<Citerne>) => {
    gridApiRef.current = event.api;
  };

  const handleFilterChange = (filter: CapacityFilter) => {
    setCapacityFilter(filter);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setCapacityFilter("all");
    setCurrentPage(1);
    setPageSize(5);
  };

  const handleExport = () => {
    const header = [
      "Référence",
      "Nom",
      "Capacité (L)",
      "Date de fabrication",
    ];

    const rows = filteredCiternes.map((c) => [
      c.reference,
      c.libelle,
      String(c.capacity),
      formatDate(c.dateFabrication),
    ]);

    const escapeCsv = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(";"))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "citernes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const ReferenceRenderer = (
    params: ICellRendererParams<Citerne>
  ) => {
    const citerne = params.data;
    if (!citerne) return null;

    return (
      <div className="flex h-full items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4e6]">
          <Database className="size-[17px] text-[#556B2F]" />
        </div>
        <span className="font-semibold text-[#172033]">
          {citerne.reference || "—"}
        </span>
      </div>
    );
  };

  const NameRenderer = (
    params: ICellRendererParams<Citerne>
  ) => (
    <span className="text-sm text-[#334155]">
      {params.data?.libelle || "—"}
    </span>
  );

  const CapacityRenderer = (
    params: ICellRendererParams<Citerne>
  ) => {
    const capacity = Number(params.data?.capacity) || 0;

    let label = "Grande capacité";
    let badgeClass = "bg-purple-50 text-purple-700";

    if (capacity > 0 && capacity < 3000) {
      label = "Petite capacité";
      badgeClass = "bg-blue-50 text-blue-700";
    } else if (capacity >= 3000 && capacity < 5000) {
      label = "Capacité moyenne";
      badgeClass = "bg-amber-50 text-amber-700";
    }

    return (
      <div className="flex h-full items-center gap-3">
        <span className="font-semibold text-[#334155]">
          {formatNumber(capacity)} L
        </span>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-4 whitespace-nowrap ${badgeClass}`}
        >
          {capacity <= 0 ? "Capacité nulle" : label}
        </span>
      </div>
    );
  };

  const DateRenderer = (
    params: ICellRendererParams<Citerne>
  ) => (
    <div className="flex h-full items-center gap-2 text-sm text-[#64748b]">
      <CalendarDays className="size-4 shrink-0" />
      <span>{formatDate(params.data?.dateFabrication)}</span>
    </div>
  );

  const columnDefs = useMemo<ColDef<Citerne>[]>(
    () => [
      {
        field: "reference",
        headerName: "Référence",
        flex: 1,
        minWidth: 155,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: ReferenceRenderer,
      },
      {
        field: "libelle",
        headerName: "Nom",
        flex: 1.2,
        minWidth: 165,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: NameRenderer,
      },
      {
        field: "capacity",
        headerName: "Capacité (L)",
        flex: 1.5,
        minWidth: 235,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: CapacityRenderer,
      },
      {
        field: "dateFabrication",
        headerName: "Date de fabrication",
        flex: 1,
        minWidth: 165,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: DateRenderer,
      },
      {
        colId: "edit",
        headerName: "Modifier",
        width: 95,
        minWidth: 95,
        maxWidth: 95,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<Citerne>) => {
          const citerne = params.data;
          if (!citerne) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Modifier"
                aria-label={`Modifier ${citerne.reference}`}
                onClick={() => onEdit?.(citerne)}
                className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2]"
              >
                <Pencil className="size-4" />
              </button>
            </div>
          );
        },
      },
      {
        colId: "delete",
        headerName: "Supprimer",
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<Citerne>) => {
          const citerne = params.data;
          if (!citerne) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Supprimer"
                aria-label={`Supprimer ${citerne.reference}`}
                onClick={() => onDelete?.(citerne)}
                className="flex size-8 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd]"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

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

  return (
    <div className="w-full space-y-3">
      {/* Filtres de capacité */}
      <div className="rounded-xl border border-[#edf0f2] bg-white p-2.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((filter) => {
            const active = capacityFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilterChange(filter.value)}
                className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all sm:flex-none ${
                  active
                    ? "border-transparent text-white shadow-sm"
                    : "border-[#edf0f2] bg-white text-[#475569] hover:bg-[#f8fafc]"
                }`}
                style={
                  active
                    ? { backgroundColor: filter.activeColor }
                    : undefined
                }
              >
                <Database
                  className="size-4 shrink-0"
                  style={{ color: active ? "#ffffff" : filter.color }}
                />
                <span>{filter.label}</span>
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                  {counts[filter.value]}
                </span>
              </button>
            );
          })}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            
<Button
  type="button"
  variant="outline"
  onClick={handleReset}
  className="h-10 min-w-[200px] rounded-lg border-[#F59E0B] bg-[#FFF7E6] px-5 text-sm font-medium text-[#B96B00] transition-colors hover:border-[#D97706] hover:bg-[#FEF0CC] hover:text-[#92400E]"
>
  <RefreshCcw className="mr-2 size-4" />
  Réinitialiser
</Button>


            


<Button
  type="button"
  variant="outline"
  onClick={handleExport}
  disabled={filteredCiternes.length === 0}
  className="h-10 min-w-[125px] rounded-lg border-[#556B2F] bg-[#F5F8F1] px-5 text-sm font-semibold tracking-[0.01em] text-[#556B2F] shadow-sm transition-all duration-200 hover:border-[#465A27] hover:bg-[#EAF0E2] hover:text-[#465A27] disabled:cursor-not-allowed disabled:opacity-50"
>
  <Download className="mr-2 size-4 shrink-0" strokeWidth={2} />
  Exporter
</Button>



          </div>
        </div>
      </div>

      
{/* Tableau et pagination */}
<div className="w-full overflow-hidden rounded-xl border border-[#edf0f2] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
  <div className="w-full overflow-hidden">
    <AgGridProvider modules={[AllCommunityModule]}>
      <AgGridReact<Citerne>
        rowData={paginatedCiternes}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        theme={citerneTheme}
        domLayout="autoHeight"
        rowHeight={44}
        headerHeight={40}
        animateRows
        suppressCellFocus
        suppressPaginationPanel
        getRowId={(params) => String(params.data.citerneId)}
        onGridReady={handleGridReady}
        overlayNoRowsTemplate="<span>Aucune citerne trouvée</span>"
        localeText={{
          loadingOoo: "Chargement...",
          noRowsToShow: "Aucune citerne trouvée",
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

        {/* Pagination personnalisée */}
        <div className="flex flex-col gap-3 border-t border-[#edf0f2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-[#64748b]">
            <label htmlFor="page-size">Lignes par page</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-[#e2e8f0] bg-white px-3 text-xs text-[#334155] outline-none focus:border-[#556B2F]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <span className="mr-1 text-xs text-[#64748b]">
              {filteredCiternes.length === 0
                ? "0 résultat"
                : `${(safePage - 1) * pageSize + 1} à ${Math.min(
                    safePage * pageSize,
                    filteredCiternes.length
                  )} sur ${filteredCiternes.length}`}
            </span>

            <button
              type="button"
              aria-label="Page précédente"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex size-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#64748b] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>

            <span className="flex size-8 items-center justify-center rounded-lg bg-[#556B2F] text-xs font-semibold text-white">
              {safePage}
            </span>

            <button
              type="button"
              aria-label="Page suivante"
              disabled={safePage >= totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="flex size-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#64748b] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CiterneTable;
