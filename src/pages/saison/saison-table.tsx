
import { useEffect, useMemo, useState } from 'react';
import {
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';
import {
  CalendarDays,
  Pencil,
  Trash2,
  RotateCcw,
  Download,
  Circle,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

/* =========================================================
   TYPE SAISON
========================================================= */

export interface Saison {
  id: string;
  beginDate: string;
  endDate: string;
  statusId: number;
  year: number;
  priceKilo: number;
  priceAchat: number;
  priceVente: number;
  nbreCaisses: number;
}

/* =========================================================
   DONNÉES STATIQUES
========================================================= */



/* =========================================================
   FORMATAGE
========================================================= */


const formatDate = (date: string) => {
  if (!date) return '';

  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const formatPrice = (value: number) =>
  `${value.toFixed(2).replace('.', ',')} DT`;

/* =========================================================
   THÈME AG GRID
========================================================= */

const saisonTheme = themeQuartz.withParams({
  accentColor: '#556B2F',
  backgroundColor: '#ffffff',
  foregroundColor: '#172033',
  headerBackgroundColor: '#f8fafc',
  headerTextColor: '#172033',
  borderColor: '#e5e7eb',
  rowBorder: {
    style: 'solid',
    width: 1,
    color: '#edf0f2',
  },
  headerFontWeight: 600,
  fontSize: 13,
  cellHorizontalPadding: 16,
  spacing: 8,
  wrapperBorderRadius: 0,
});

/* =========================================================
   PROPS
========================================================= */

interface SaisonTableProps {
  saisons: Saison[];
  onEdit?: (saison: Saison) => void;
  onDelete?: (saison: Saison) => void;
}

/* =========================================================
   COMPOSANT PRINCIPAL
========================================================= */

export function SaisonTable({
  saisons,
  onEdit,
  onDelete,
}: SaisonTableProps) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState('Toutes les saisons');
  const [selectedYear, setSelectedYear] = useState('Toutes les années');

  /* FILTRAGE */

  const filteredSaisons = useMemo(() => {
    let result = [...saisons];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((saison) => {
        return (
          saison.year.toString().includes(searchValue) ||
          formatDate(saison.beginDate).includes(searchValue) ||
          formatDate(saison.endDate).includes(searchValue) ||
          saison.priceKilo.toString().includes(searchValue) ||
          saison.priceAchat.toString().includes(searchValue) ||
          saison.priceVente.toString().includes(searchValue)
        );
      });
    }
    if (selectedYear !== 'Toutes les années') {
  result = result.filter(
    (saison) => saison.year === Number(selectedYear),
  );
}

    if (selectedFilter === 'En cours') {
      result = result.filter((saison) => saison.statusId === 1);
    }

    if (selectedFilter === 'Clôturées') {
      result = result.filter((saison) => saison.statusId === 2);
    }

    return result;
  }, [saisons, search, selectedFilter, selectedYear]);

  /* RENDERER ANNÉE */

  const YearRenderer = (params: ICellRendererParams<Saison>) => {
    const saison = params.data;
    if (!saison) return null;

    const isCurrent = saison.statusId === 1;

    return (
      <div className="flex h-full items-center gap-2 whitespace-nowrap">
        <span
          className={`size-2 shrink-0 rounded-full ${
            isCurrent ? 'bg-[#7FA33B]' : 'bg-[#cbd0d8]'
          }`}
        />
        <span
          className={`text-sm font-semibold ${
            isCurrent ? 'text-[#1f2937]' : 'text-[#334155]'
          }`}
        >
          {saison.year}
        </span>
      </div>
    );
  };

  /* RENDERER DATE */

  const DateRenderer = (params: ICellRendererParams<Saison>) => (
    <div className="flex h-full items-center gap-2 whitespace-nowrap">
      <CalendarDays className="size-4 shrink-0 text-[#64748b]" />
      <span className="text-sm text-[#334155]">
        {formatDate(params.value as string)}
      </span>
    </div>
  );

  /* RENDERER PRIX */

  const PriceRenderer = (params: ICellRendererParams<Saison>) => (
    <span className="whitespace-nowrap text-sm font-semibold text-[#1f2937]">
      {formatPrice(Number(params.value))}
    </span>
  );

  /* COLONNES */

  const columnDefs = useMemo<ColDef<Saison>[]>(
    () => [
      {
        field: 'year',
        headerName: 'Année',
        minWidth: 100,
        width: 120,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: YearRenderer,
      },
      {
        field: 'beginDate',
        headerName: 'Date début',
        minWidth: 155,
        width: 170,
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: DateRenderer,
      },
      {
        field: 'endDate',
        headerName: 'Date fin',
        minWidth: 155,
        width: 170,
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: DateRenderer,
      },
      {
        field: 'priceKilo',
        headerName: "Prix/kg d'olive (DT)",
        minWidth: 175,
        width: 190,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: PriceRenderer,
      },
      {
        field: 'priceAchat',
        headerName: 'Prix achat huile (DT)',
        minWidth: 180,
        width: 195,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: PriceRenderer,
      },
      {
        field: 'priceVente',
        headerName: 'Prix vente huile (DT)',
        minWidth: 180,
        width: 195,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: PriceRenderer,
      },
      {
        colId: 'edit',
        headerName: 'Modifier',
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: 'right',
        cellRenderer: (params: ICellRendererParams<Saison>) => {
          const saison = params.data;
          if (!saison) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Modifier"
                aria-label={`Modifier la saison ${saison.year}`}
                onClick={() => onEdit?.(saison)}
                className="flex size-9 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition-colors hover:bg-[#dfead2]"
              >
                <Pencil className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
      {
        colId: 'delete',
        headerName: 'Supprimer',
        width: 95,
        minWidth: 95,
        maxWidth: 95,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: 'right',
        cellRenderer: (params: ICellRendererParams<Saison>) => {
          const saison = params.data;
          if (!saison) return null;

          return (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                title="Supprimer"
                aria-label={`Supprimer la saison ${saison.year}`}
                onClick={() => onDelete?.(saison)}
                className="flex size-9 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition-colors hover:bg-[#fbdadd]"
              >
                <Trash2 className="size-[17px]" />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete],
  );

  const defaultColDef = useMemo<ColDef<Saison>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      suppressHeaderMenuButton: false,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    }),
    [],
  );

  const [pageSize, setPageSize] = useState(10);
const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.max(
  1,
  Math.ceil(filteredSaisons.length / pageSize),
);

const startIndex =
  filteredSaisons.length === 0
    ? 0
    : (currentPage - 1) * pageSize + 1;

const endIndex = Math.min(
  currentPage * pageSize,
  filteredSaisons.length,
);

const paginatedSaisons = useMemo(() => {
  const start = (currentPage - 1) * pageSize;
  return filteredSaisons.slice(start, start + pageSize);
}, [filteredSaisons, currentPage, pageSize]);

useEffect(() => {
  setCurrentPage(1);
}, [search, selectedFilter, selectedYear, pageSize, saisons.length]);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

  /* RENDER */

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        {/* TOOLBAR */}
        {/* TOOLBAR : FILTRES PAR STATUT + ACTIONS */}
{/* TOOLBAR — DESIGN PROFESSIONNEL */}
<div className="w-full border-b border-slate-100 bg-white p-4 sm:p-5">
  <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end">

    {/* FILTRE PAR ANNÉE */}
    <div className="w-full shrink-0 2xl:w-[220px]">
      <label
        htmlFor="saison-year"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Année
      </label>

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-500" />

        <select
          id="saison-year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-[#a8b995] focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10"
        >
          <option value="Toutes les années">Toutes les années</option>

          {[...new Set(saisons.map((saison) => saison.year))]
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={String(year)}>
                Saison {year}
              </option>
            ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>

    {/* FILTRES PAR STATUT */}
    <div className="flex flex-wrap items-center gap-3">

      {/* EN COURS */}
      <button
        type="button"
        onClick={() => setSelectedFilter('En cours')}
        aria-pressed={selectedFilter === 'En cours'}
        className={`flex h-11 items-center justify-center gap-3 rounded-md border px-4 transition-all duration-200 ${
          selectedFilter === 'En cours'
            ? 'border-[#c6dfb3] bg-[#f1f8eb] text-[#426329] shadow-sm'
            : 'border-slate-200 bg-white text-slate-600 hover:border-[#c6dfb3] hover:bg-[#f8fbf5]'
        }`}
      >
        <Circle className="size-3 shrink-0 fill-[#4d7c2f] text-[#4d7c2f]" />

        <span className="whitespace-nowrap text-sm font-semibold">
          En cours
        </span>

        <span className="flex size-7 items-center justify-center rounded-full bg-[#e4efd8] text-xs font-bold text-[#426329]">
          {saisons.filter((s) => s.statusId === 1).length}
        </span>
      </button>

      {/* CLÔTURÉES */}
      <button
        type="button"
        onClick={() => setSelectedFilter('Clôturées')}
        aria-pressed={selectedFilter === 'Clôturées'}
        className={`flex h-11 items-center justify-center gap-3 rounded-md border px-4 transition-all duration-200 ${
          selectedFilter === 'Clôturées'
            ? 'border-slate-300 bg-slate-100 text-slate-700 shadow-sm'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <Circle className="size-3 shrink-0 fill-slate-500 text-slate-500" />

        <span className="whitespace-nowrap text-sm font-semibold">
          Clôturées
        </span>

        <span className="flex size-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
          {saisons.filter((s) => s.statusId === 2).length}
        </span>
      </button>
    </div>

    {/* RECHERCHE */}
    <div className="relative min-w-0 flex-1 2xl:min-w-[220px]">
      <label htmlFor="saison-search" className="sr-only">
        Rechercher une saison
      </label>

      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />

      <input
        id="saison-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher une saison..."
        className="h-11 w-full rounded-md border border-transparent bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:bg-slate-100 focus:border-[#b7c99d] focus:bg-white focus:ring-4 focus:ring-[#556B2F]/10"
      />
    </div>

    {/* ACTIONS */}
    <div className="flex shrink-0 flex-wrap items-center gap-2">

      {/* RÉINITIALISER */}
      {/* RÉINITIALISER */}
<Button
  type="button"
  variant="outline"
  onClick={() => {
    setSelectedYear("Toutes les années");
    setSelectedFilter("Toutes les saisons");
    setSearch("");
  }}
  className="h-10 min-w-[200px] rounded-lg border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
>
  <RotateCcw className="size-[17px]" />
  Réinitialiser
</Button>

{/* EXPORTER */}
<Button
  type="button"
  variant="outline"
  onClick={() => {
    const headers = [
      "Année",
      "Date début",
      "Date fin",
      "Prix/kg d'olive (DT)",
      "Prix achat huile (DT)",
      "Prix vente huile (DT)",
      "Nombre de caisses",
      "Statut",
    ];

    const rows = filteredSaisons.map((s) => [
      s.year,
      formatDate(s.beginDate),
      formatDate(s.endDate),
      s.priceKilo,
      s.priceAchat,
      s.priceVente,
      s.nbreCaisses,
      s.statusId === 1 ? "En cours" : "Clôturée",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(";"),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "saisons.csv";
    link.click();

    URL.revokeObjectURL(url);
  }}
  className="h-11 gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] shadow-sm transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
>
  <Download className="size-[17px]" />
  Exporter
  <ChevronDown className="ml-1 size-4 text-[#71864E]" />
</Button>
    </div>
  </div>
</div>

        {/* AG GRID */}
        

{/* TABLEAU AG GRID */}
<div className="w-full min-w-0 overflow-x-auto">
  <div
    className="w-full"
    style={{
      minWidth: '1100px',
      height: `${Math.max(1, paginatedSaisons.length) * 58 + 50}px`,
      minHeight: '108px',
    }}
  >
    <AgGridProvider modules={[AllCommunityModule]}>
      <AgGridReact<Saison>
        rowData={paginatedSaisons}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        theme={saisonTheme}
        rowHeight={58}
        headerHeight={50}
        pagination={false}
        domLayout="normal"
        animateRows={true}
        suppressCellFocus={true}
        getRowId={(params) => params.data.id}
        localeText={{
          noRowsToShow: 'Aucune saison trouvée',
          filterOoo: 'Filtrer...',
          equals: 'Égal à',
          notEqual: 'Différent de',
          contains: 'Contient',
          notContains: 'Ne contient pas',
          startsWith: 'Commence par',
          endsWith: 'Se termine par',
          lessThan: 'Inférieur à',
          greaterThan: 'Supérieur à',
          applyFilter: 'Appliquer',
          resetFilter: 'Réinitialiser',
          clearFilter: 'Effacer',
        }}
      />
    </AgGridProvider>
  </div>
</div>


{/* PAGINATION PERSONNALISÉE */}
<div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

  {/* NOMBRE DE LIGNES */}
  <div className="flex items-center gap-3">
    <label
      htmlFor="saison-page-size"
      className="whitespace-nowrap text-xs font-medium text-slate-500"
    >
      Lignes par page
    </label>

    <div className="relative">
      <select
        id="saison-page-size"
        value={pageSize}
        onChange={(event) => {
          setPageSize(Number(event.target.value));
          setCurrentPage(1);
        }}
        className="h-9 min-w-[66px] appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-semibold text-slate-700 shadow-sm outline-none transition hover:border-[#a5b68b] focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-slate-500" />
    </div>
  </div>

  {/* COMPTEUR ET NAVIGATION */}
  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">

    <span className="whitespace-nowrap text-xs font-medium text-slate-500">
      <span className="font-semibold text-slate-700">
        {startIndex} à {endIndex}
      </span>
      {' '}sur{' '}
      <span className="font-semibold text-slate-700">
        {filteredSaisons.length}
      </span>
    </span>

    <div className="flex items-center gap-1.5">

      {/* PRÉCÉDENT */}
      <button
        type="button"
        aria-label="Page précédente"
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage((page) => Math.max(1, page - 1))
        }
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#b5c59b] hover:bg-[#f5f8f1] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4 rotate-180" />
      </button>

      {/* NUMÉROS DE PAGES */}
      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((page) => {
          return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          );
        })
        .reduce<(number | string)[]>((pages, page, index, array) => {
          if (index > 0 && page - array[index - 1] > 1) {
            pages.push(`ellipsis-${page}`);
          }
          pages.push(page);
          return pages;
        }, [])
        .map((page) =>
          typeof page === 'string' ? (
            <span
              key={page}
              className="flex size-9 items-center justify-center text-xs text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => setCurrentPage(page)}
              className={`flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                currentPage === page
                  ? 'border-[#465a27] bg-[#556B2F] text-white shadow-[0_2px_5px_rgba(85,107,47,0.25)]'
                  : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-[#b5c59b] hover:bg-[#f5f8f1] hover:text-[#556B2F]'
              }`}
            >
              {page}
            </button>
          ),
        )}

      {/* SUIVANT */}
      <button
        type="button"
        aria-label="Page suivante"
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage((page) => Math.min(totalPages, page + 1))
        }
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#b5c59b] hover:bg-[#f5f8f1] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>

    </div>
  </div>
</div>

      </div>
    </div>
  );
}
