
import { useMemo, useState } from 'react';
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
  ChevronDown,
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

const initialSaisons: Saison[] = [
  {
    id: '1',
    year: 2026,
    beginDate: '2026-01-01',
    endDate: '2027-01-31',
    statusId: 1,
    priceKilo: 0.8,
    priceAchat: 10,
    priceVente: 12,
    nbreCaisses: 500,
  },
  {
    id: '2',
    year: 2025,
    beginDate: '2025-10-01',
    endDate: '2026-01-31',
    statusId: 2,
    priceKilo: 0.75,
    priceAchat: 9.5,
    priceVente: 11.5,
    nbreCaisses: 450,
  },
  {
    id: '3',
    year: 2024,
    beginDate: '2024-10-01',
    endDate: '2025-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '4',
    year: 2023,
    beginDate: '2023-10-01',
    endDate: '2024-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '5',
    year: 2022,
    beginDate: '2022-10-01',
    endDate: '2023-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '6',
    year: 2021,
    beginDate: '2021-10-01',
    endDate: '2022-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '7',
    year: 2020,
    beginDate: '2020-10-01',
    endDate: '2021-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '8',
    year: 2019,
    beginDate: '2019-10-01',
    endDate: '2020-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '9',
    year: 2018,
    beginDate: '2018-10-01',
    endDate: '2021-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '10',
    year: 2017,
    beginDate: '2017-10-01',
    endDate: '2018-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
  {
    id: '11',
    year: 2016,
    beginDate: '2016-10-01',
    endDate: '2017-01-31',
    statusId: 2,
    priceKilo: 0.7,
    priceAchat: 9,
    priceVente: 11,
    nbreCaisses: 400,
  },
];

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
  saisons?: Saison[];
  onEdit?: (saison: Saison) => void;
  onDelete?: (saison: Saison) => void;
}

/* =========================================================
   COMPOSANT PRINCIPAL
========================================================= */

export function SaisonTable({
  saisons = initialSaisons,
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

  /* RENDER */

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        {/* TOOLBAR */}
        {/* TOOLBAR : FILTRES PAR STATUT + ACTIONS */}
<div className="flex min-w-0 flex-col gap-3 border-b border-[#edf0f2] bg-white px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">

  {/* FILTRES CLIQUABLES */}
  <div className="flex min-w-0 flex-wrap items-center gap-5 lg:flex-1 lg:gap-6">
<div className="relative min-w-0">
  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#556B2F]" />

  <select
    value={selectedYear}
    onChange={(event) => setSelectedYear(event.target.value)}
    className="h-10 w-full appearance-none rounded-lg border border-[#dfe4e9] bg-white pl-9 pr-8 text-xs font-semibold text-[#334155] outline-none transition-all hover:border-[#a8b995] focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10 lg:w-[195px]"
  >
    <option value="Toutes les années">Toutes les années</option>

    {[...new Set(saisons.map((saison) => saison.year))]
      .sort((a, b) => b - a)
      .map((year) => (
        <option key={year} value={String(year)}>
          {year}
        </option>
      ))}
  </select>

  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#64748b]" />
</div>

    {/* TOUTES LES SAISONS */}
    <button
      type="button"
      onClick={() => setSelectedFilter('Toutes les saisons')}
      aria-pressed={selectedFilter === 'Toutes les saisons'}
      className={`flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 transition-all duration-200 lg:min-w-[165px] ${
        selectedFilter === 'Toutes les saisons'
          ? 'border-[#8da65b] bg-[#f2f6e9] text-[#35491f] shadow-sm'
          : 'border-[#e2e7ed] bg-white text-[#334155] hover:border-[#b8c99a] hover:bg-[#f8faf5]'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <CalendarDays className="size-[17px] shrink-0 text-[#556B2F]" />
        <span className="truncate text-xs font-semibold">
          Toutes les saisons
        </span>
      </span>

      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#e7edd9] text-xs font-bold text-[#455b29]">
        {saisons.length}
      </span>
    </button>

    {/* SAISONS EN COURS */}
    <button
      type="button"
      onClick={() => setSelectedFilter('En cours')}
      aria-pressed={selectedFilter === 'En cours'}
      className={`flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 transition-all duration-200 lg:min-w-[125px] ${
        selectedFilter === 'En cours'
          ? 'border-[#a8d8b7] bg-[#eff9f1] text-[#166534] shadow-sm'
          : 'border-[#e2e7ed] bg-white text-[#334155] hover:border-[#b8dfc3] hover:bg-[#f7fcf8]'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Circle className="size-3 shrink-0 fill-[#199447] text-[#199447]" />
        <span className="truncate text-xs font-semibold">En cours</span>
      </span>

      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#e8f5eb] text-xs font-bold text-[#166534]">
        {saisons.filter((s) => s.statusId === 1).length}
      </span>
    </button>

    {/* SAISONS CLÔTURÉES */}
    <button
      type="button"
      onClick={() => setSelectedFilter('Clôturées')}
      aria-pressed={selectedFilter === 'Clôturées'}
      className={`flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 transition-all duration-200 lg:min-w-[135px] ${
        selectedFilter === 'Clôturées'
          ? 'border-[#cbd1da] bg-[#f1f3f5] text-[#334155] shadow-sm'
          : 'border-[#e2e7ed] bg-white text-[#334155] hover:border-[#cbd1da] hover:bg-[#f8f9fa]'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Circle className="size-3 shrink-0 fill-[#8490a3] text-[#8490a3]" />
        <span className="truncate text-xs font-semibold">Clôturées</span>
      </span>

      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#e9edf2] text-xs font-bold text-[#475569]">
        {saisons.filter((s) => s.statusId === 2).length}
      </span>
    </button>
  </div>

  {/* ACTIONS */}
  <div className="flex shrink-0 items-center gap-2">

    {/* RÉINITIALISER */}
    <Button
      type="button"
      variant="outline"
      onClick={() => {
  setSelectedYear('Toutes les années');
  setSelectedFilter('Toutes les saisons');
  setSearch('');
}}
      className="h-10 gap-2 rounded-lg border-[#dfe4e9] bg-white px-3 text-xs font-semibold text-[#334155] hover:border-[#a8b995] hover:bg-[#f5f8f1] hover:text-[#556B2F] sm:px-4"
    >
      <RotateCcw className="size-4 shrink-0" />
      <span>Réinitialiser</span>
    </Button>

    {/* EXPORTER */}
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        const headers = [
          'Année',
          'Date début',
          'Date fin',
          "Prix/kg d'olive (DT)",
          'Prix achat huile (DT)',
          'Prix vente huile (DT)',
          'Nombre de caisses',
          'Statut',
        ];

        const rows = filteredSaisons.map((s) => [
          s.year,
          formatDate(s.beginDate),
          formatDate(s.endDate),
          s.priceKilo,
          s.priceAchat,
          s.priceVente,
          s.nbreCaisses,
          s.statusId === 1 ? 'En cours' : 'Clôturée',
        ]);

        const csv = [headers, ...rows]
          .map((row) =>
            row
              .map((value) =>
                `"${String(value ?? '').replace(/"/g, '""')}"`,
              )
              .join(';'),
          )
          .join('\r\n');

        const blob = new Blob(
          ['\uFEFF' + csv],
          { type: 'text/csv;charset=utf-8;' },
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'saisons.csv';
        link.click();

        URL.revokeObjectURL(url);
      }}
      className="h-10 gap-2 rounded-lg border-[#dfe4e9] bg-white px-3 text-xs font-semibold text-[#334155] hover:border-[#a8b995] hover:bg-[#f5f8f1] hover:text-[#556B2F] sm:px-4"
    >
      <Download className="size-4 shrink-0" />
      <span>Exporter</span>
    </Button>
  </div>
</div>

        {/* AG GRID */}
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <div className="w-full min-w-0 overflow-x-auto">
            <div
              className="w-full"
              style={{
                minWidth: '1100px',
                height: 'min(600px, 75vh)',
                minHeight: '420px',
              }}
            >
              <AgGridProvider modules={[AllCommunityModule]}>
                <AgGridReact<Saison>
                  rowData={filteredSaisons}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  theme={saisonTheme}
                  rowHeight={58}
                  headerHeight={50}
                  pagination={true}
                  paginationPageSize={10}
                  paginationPageSizeSelector={[5, 10, 20, 50]}
                  animateRows={true}
                  suppressCellFocus={true}
                  getRowId={(params) => params.data.id}
                  localeText={{
                    page: 'Page',
                    more: 'Plus',
                    to: 'à',
                    of: 'sur',
                    next: 'Suivant',
                    last: 'Dernier',
                    first: 'Premier',
                    previous: 'Précédent',
                    loadingOoo: 'Chargement...',
                    noRowsToShow: 'Aucune saison trouvée',
                    pageSizeSelectorLabel: 'Lignes par page',
                    filterOoo: 'Filtrer...',
                    equals: 'Égal à',
                    notEqual: 'Différent de',
                    contains: 'Contient',
                    notContains: 'Ne contient pas',
                    startsWith: 'Commence par',
                    endsWith: 'Se termine par',
                    lessThan: 'Inférieur à',
                    lessThanOrEqual: 'Inférieur ou égal à',
                    greaterThan: 'Supérieur à',
                    greaterThanOrEqual: 'Supérieur ou égal à',
                    andCondition: 'ET',
                    orCondition: 'OU',
                    applyFilter: 'Appliquer',
                    resetFilter: 'Réinitialiser',
                    clearFilter: 'Effacer',
                  }}
                />
              </AgGridProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
