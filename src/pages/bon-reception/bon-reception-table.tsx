import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  themeQuartz,
} from 'ag-grid-community';

import {
  AgGridProvider,
  AgGridReact,
} from 'ag-grid-react';

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Droplets,
  FileText,
  Filter,
  Hash,
  History,
  Pencil,
  Phone,
  RefreshCcw,
  Search,
  Trash2,
  UserRound,
  X,
  XCircle,
  Scale,
  Factory,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';


/* ============================================================
   TYPE BON DE RÉCEPTION
============================================================ */

export interface BonReception {

  reference: string;

  id: number;

  compteId: number;

  name: string;

  mobile: string;

  quantityOil: number;

  quantityOlive: number;

  priceKg: number;

  price: number;

  payement: number;

  acompte: number;

  statusId: string;

  statusLib: string;

  caisse: string;

  natureId: number;

  priceOil: number;

  observation: string;

  typeHuile: number;

  isBaseCompte: boolean;

  dateCreation: string;

  dateDebProduction: string;

  dateFinProduction: string;
}


/* ============================================================
   PROPS
============================================================ */

interface BonReceptionTableProps {

  bons?: BonReception[];

  onEdit?: (
    bon: BonReception,
  ) => void;

  onDelete?: (
    bon: BonReception,
  ) => void;
}


/* ============================================================
   THEME AG GRID
============================================================ */

const bonReceptionTheme =
  themeQuartz.withParams({

    accentColor:
      '#556B2F',

    backgroundColor:
      '#ffffff',

    foregroundColor:
      '#172033',

    headerBackgroundColor:
      '#f8fafc',

    headerTextColor:
      '#172033',

    headerFontWeight:
      600,

    borderColor:
      '#e5e7eb',

    rowBorder: {
      style: 'solid',
      width: 1,
      color: '#edf0f2',
    },

    fontSize:
      13,

    cellHorizontalPadding:
      7,

    spacing:
      5,
  });


/* ============================================================
   TABLE
============================================================ */

export function BonReceptionTable({

  bons = [],

  onEdit,

  onDelete,

}: BonReceptionTableProps) {
  const navigate = useNavigate();
  const handleEdit = (bon: BonReception) => {
    navigate(`/store-admin/reception-vouchers/edit/${bon.id}`);
  };
  const API_BASE_URL = '/olive_app';

const handleDelete = (bon: BonReception) => {
  setBonASupprimer(bon);
};

const confirmerSuppression = async () => {
  if (!bonASupprimer || suppressionEnCours) return;

  setSuppressionEnCours(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/reception/delete/${bonASupprimer.id}`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
        },
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status}${
          responseText ? ` : ${responseText}` : ''
        }`
      );
    }

    setBonASupprimer(null);
    window.location.reload();  

    setBonASupprimer(null);
    window.location.reload();
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);

    alert(
      error instanceof Error
        ? error.message
        : 'Impossible de supprimer le bon de réception.'
    );
  } finally {
    setSuppressionEnCours(false);
  }
};


  /* ==========================================================
     GRID API
  ========================================================== */

  const gridApiRef =
    useRef<GridApi<BonReception> | null>(
      null,
    );


  /* ==========================================================
     RECHERCHE
  ========================================================== */

  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [bonASupprimer, setBonASupprimer] =
    useState<BonReception | null>(null);

  const [suppressionEnCours, setSuppressionEnCours] =
    useState(false);


  /* ==========================================================
     FILTRE STATUT
  ========================================================== */

  const [statusFilter, setStatusFilter] = useState('Tous');


  /* ==========================================================
     HISTORIQUE
  ========================================================== */

  const [
    historyCompteId,
    setHistoryCompteId,
  ] = useState<number | null>(
    null,
  );


  /* ==========================================================
     GRID READY
  ========================================================== */

  const handleGridReady = (
    event: GridReadyEvent<BonReception>,
  ) => {

    gridApiRef.current =
      event.api;

  };


  /* ==========================================================
     FORMAT NOMBRE
  ========================================================== */

  const formatNumber = (
    value: number,
  ) => {

    return value.toLocaleString(
      'fr-FR',
      {
        maximumFractionDigits: 2,
      },
    );

  };


  /* ==========================================================
     FORMAT PRIX
  ========================================================== */

  const formatPrice = (
    value: number,
  ) => {

    return value.toLocaleString(
      'fr-FR',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  };


  /* ==========================================================
     STATISTIQUES
  ========================================================== */

  const totalBons =
    bons.length;

  const bonsEnCours =
    bons.filter(
      (bon) =>
        bon.statusLib ===
        'En cours',
    ).length;

  const bonsEnAttente =
    bons.filter(
      (bon) =>
        bon.statusLib ===
        'En attente',
    ).length;

  const bonsAnnules =
    bons.filter(
      (bon) =>
        bon.statusLib ===
        'Annulé',
    ).length;

  const statusCounts = useMemo(() => {
   const count = (status: string) =>
    bons.filter((bon) => bon.statusLib === status).length;

   return [
    { label: 'Tous', count: bons.length },
    { label: 'Non Affecté', count: count('Non Affecté') },
    { label: 'Non Pesé', count: count('Non Pesé') },
    { label: 'En Attente', count: count('En Attente') },
    { label: 'Fin Prod', count: count('Fin Prod') },
    { label: 'Non Payé', count: count('Non Payé') },
    { label: 'Validé', count: count('Validé') },
   ];
  }, [bons]);


  /* ==========================================================
     FILTRAGE
  ========================================================== */

  const filteredBons = useMemo(() => {
  let result = [...bons];

  // Filtre par date de début et date de fin
  const parseDate = (date: string): number => {
    const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

    if (match) {
      const [, jour, mois, annee] = match;
      return new Date(
        Number(annee),
        Number(mois) - 1,
        Number(jour)
      ).getTime();
    }

    return NaN;
  };

  if (dateDebut) {
    const debut = new Date(`${dateDebut}T00:00:00`).getTime();

    result = result.filter((bon) => {
      const dateBon = parseDate(bon.dateCreation);
      return !Number.isNaN(dateBon) && dateBon >= debut;
    });
  }

  if (dateFin) {
    const fin = new Date(`${dateFin}T23:59:59.999`).getTime();

    result = result.filter((bon) => {
      const dateBon = parseDate(bon.dateCreation);
      return !Number.isNaN(dateBon) && dateBon <= fin;
    });
  }

  if (statusFilter !== 'Tous') {
   result = result.filter(
    (bon) => bon.statusLib === statusFilter,
   );
  }

  return result;
}, [bons, dateDebut, dateFin, statusFilter]);

/* ==========================================================
   PAGINATION PERSONNALISÉE
========================================================== */

const [pageSize, setPageSize] = useState(10);
const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.max(
  1,
  Math.ceil(filteredBons.length / pageSize),
);

const startIndex =
  filteredBons.length === 0
    ? 0
    : (currentPage - 1) * pageSize + 1;

const endIndex = Math.min(
  currentPage * pageSize,
  filteredBons.length,
);

const paginatedBons = useMemo(() => {
  const start = (currentPage - 1) * pageSize;

  return filteredBons.slice(start, start + pageSize);
}, [filteredBons, currentPage, pageSize]);

/* Revenir à la première page lors d'un changement de filtre */
useEffect(() => {
  setCurrentPage(1);
}, [dateDebut, dateFin, statusFilter, pageSize]);

/* Corriger la page si le nombre de résultats diminue */
useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

/* Numéros de pages avec ellipses */
const getPageNumbers = () => {
  const pages: (number | '...')[] = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page++) {
      pages.push(page);
    }

    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push('...');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push('...');
  }

  pages.push(totalPages);

  return pages;
};
  /* ==========================================================
     RESET
  ========================================================== */

  const handleReset = () => {
    setDateDebut('');
    setDateFin('');
    setStatusFilter('Tous les statuts');

    gridApiRef.current?.setFilterModel(null);
  };


  /* ==========================================================
     EXPORT
  ========================================================== */

  const handleExport = () => {

    gridApiRef.current?.exportDataAsCsv({
      fileName:
        'bons-reception.csv',
    });

  };


  /* ==========================================================
     RENDERER RÉFÉRENCE
  ========================================================== */

  const ReferenceRenderer = (
    params:
      ICellRendererParams<BonReception>,
  ) => {

    const bon =
      params.data;

    if (!bon) {
      return null;
    }

    return (

      <div className="flex h-full items-center gap-2">

        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4e6]">

          <FileText className="size-4 text-[#556B2F]" />

        </div>

        <div className="min-w-0">

          <div className="text-sm font-semibold text-[#172033]">
            {bon.reference}
          </div>

          <div className="text-[11px] text-[#94a3b8]">
            #{bon.id}
          </div>

        </div>

      </div>
    );
  };


  /* ==========================================================
     RENDERER COMPTE
  ========================================================== */

  const CompteRenderer = (
    params:
      ICellRendererParams<BonReception>,
  ) => {

    const bon =
      params.data;

    if (!bon) {
      return null;
    }

    return (

      <div className="flex flex-col justify-center">

        <span className="truncate text-sm font-semibold text-[#172033]">
          {bon.name}
        </span>

        <span className="text-[11px] text-[#94a3b8]">
          Compte #{bon.compteId}
        </span>

      </div>
    );
  };

  


  /* ==========================================================
     RENDERER STATUT
  ========================================================== */

  const StatusRenderer = (
    params:
      ICellRendererParams<BonReception>,
  ) => {

    const status =
      params.data?.statusLib;


    if (
      status ===
      'En cours'
    ) {

      return (

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#dcfce7] px-2.5 py-1.5 text-xs font-semibold text-[#16833b]">

          <CheckCircle2 className="size-3.5" />

          En cours

        </span>
      );
    }


    if (
      status ===
      'Terminé'
    ) {

      return (

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#dbeafe] px-2.5 py-1.5 text-xs font-semibold text-[#2563eb]">

          <CheckCircle2 className="size-3.5" />

          Terminé

        </span>
      );
    }


    if (
      status ===
      'En attente'
    ) {

      return (

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffedd5] px-2.5 py-1.5 text-xs font-semibold text-[#ea580c]">

          <Clock3 className="size-3.5" />

          En attente

        </span>
      );
    }


    if (
      status ===
      'Annulé'
    ) {

      return (

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#fee2e2] px-2.5 py-1.5 text-xs font-semibold text-[#dc2626]">

          <XCircle className="size-3.5" />

          Annulé

        </span>
      );
    }


    return (

      <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
        {status || '—'}
      </span>
    );
  };


  /* ==========================================================
     COLONNES
  ========================================================== */

  const columnDefs =
    useMemo<ColDef<BonReception>[]>(
      () => [

        /* ----------------------------------------------------
           RÉFÉRENCE
        ---------------------------------------------------- */

        {
          field:
            'reference',

          headerName:
            'Référence',

          width:
            145,

          minWidth:
            135,

          cellRenderer:
            ReferenceRenderer,

          filter:
            'agTextColumnFilter',
        },


        /* ----------------------------------------------------
           COMPTE
        ---------------------------------------------------- */

        {
          field:
            'name',

          headerName:
            'Compte',

          width:
            180,

          minWidth:
            165,

          cellRenderer:
            CompteRenderer,

          filter:
            'agTextColumnFilter',
        },


        /* ----------------------------------------------------
           OLIVES
        ---------------------------------------------------- */

        {
          field:
            'quantityOlive',

          headerName:
            'Olives (kg)',

          width:
            115,

          minWidth:
            105,

          filter:
            'agNumberColumnFilter',

          valueFormatter: (
            params,
          ) =>
            formatNumber(
              Number(
                params.value,
              ),
            ),
        },


        /* ----------------------------------------------------
           HUILE
        ---------------------------------------------------- */

        {
          field:
            'quantityOil',

          headerName:
            'Huile (L)',

          width:
            105,

          minWidth:
            95,

          filter:
            'agNumberColumnFilter',

          valueFormatter: (
            params,
          ) =>
            formatNumber(
              Number(
                params.value,
              ),
            ),
        },


        /* ----------------------------------------------------
           PRIX KG
        ---------------------------------------------------- */

        {
          field:
            'priceKg',

          headerName:
            'Prix/kg',

          width:
            105,

          minWidth:
            95,

          filter:
            'agNumberColumnFilter',

          valueFormatter: (
            params,
          ) =>
            formatPrice(
              Number(
                params.value,
              ),
            ),
        },


        /* ----------------------------------------------------
           PRIX TOTAL
        ---------------------------------------------------- */

        {
          field:
            'price',

          headerName:
            'Prix total',

          width:
            120,

          minWidth:
            110,

          filter:
            'agNumberColumnFilter',

          valueFormatter: (
            params,
          ) =>
            formatPrice(
              Number(
                params.value,
              ),
            ),
        },


        /* ----------------------------------------------------
           PAIEMENT
        ---------------------------------------------------- */

        {
          field:
            'payement',

          headerName:
            'Paiement',

          width:
            115,

          minWidth:
            105,

          filter:
            'agNumberColumnFilter',

          valueFormatter: (
            params,
          ) =>
            formatPrice(
              Number(
                params.value,
              ),
            ),
        },


        /* ----------------------------------------------------
           ACOMPTE
        ---------------------------------------------------- */

        {
          field:
            'acompte',

          headerName:
            'Acompte',

          width:
            110,

          minWidth:
            100,

          filter:
            'agNumberColumnFilter',

          valueFormatter: (
            params,
          ) =>
            formatPrice(
              Number(
                params.value,
              ),
            ),
        },


        /* ----------------------------------------------------
           STATUT
        ---------------------------------------------------- */

        {
          field:
            'statusLib',

          headerName:
            'Statut',

          width:
            130,

          minWidth:
            120,

          filter:
            'agSetColumnFilter',

          cellRenderer:
            StatusRenderer,

          filterParams: {

            values: [
              'En cours',
              'Terminé',
              'En attente',
              'Annulé',
            ],

          },
        },


        /* ----------------------------------------------------
           DATE
        ---------------------------------------------------- */

        {
          field:
            'dateCreation',

          headerName:
            'Date création',

          width:
            175,

          minWidth:
            160,

          filter:
            'agTextColumnFilter',

          cellClass:
            'whitespace-nowrap',
        },


        /* ====================================================
           MODIFIER
        ==================================================== */

        {
          colId:
            'edit',

          headerName:
            'Modifier',

          width:
            85,

          minWidth:
            85,

          maxWidth:
            85,

          pinned:
            'right',

          sortable:
            false,

          filter:
            false,

          resizable:
            false,

          cellRenderer: (
            params:
              ICellRendererParams<BonReception>,
          ) => {

            if (!params.data) {
              return null;
            }

            return (

              <div className="flex h-full items-center justify-center">

                <button
  type="button"
  title="Modifier"
  onClick={() => handleEdit(params.data!)}
  className="flex size-9 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2]"
>
  <Pencil className="size-[17px]" />
</button>

              </div>
            );
          },
        },


        /* ====================================================
           SUPPRIMER
        ==================================================== */

        {
          colId:
            'delete',

          headerName:
            'Supprimer',

          width:
            90,

          minWidth:
            90,

          maxWidth:
            90,

          pinned:
            'right',

          sortable:
            false,

          filter:
            false,

          resizable:
            false,

          cellRenderer: (
            params:
              ICellRendererParams<BonReception>,
          ) => {

            if (!params.data) {
              return null;
            }

            return (

              <div className="flex h-full items-center justify-center">

                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => handleDelete(params.data!)}
                  className="flex size-9 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd]"
                >

                  <Trash2 className="size-[17px]" />

                </button>

              </div>
            );
          },
        },


        

      ],

      [
        onEdit,
        onDelete,
      ],
    );


  /* ==========================================================
     DEFAULT COLUMN
  ========================================================== */

  const defaultColDef =
    useMemo<ColDef<BonReception>>(
      () => ({

        sortable:
          true,

        filter:
          true,

        resizable:
          true,

        floatingFilter:
          false,

        cellStyle: {
          display:
            'flex',

          alignItems:
            'center',
        },

      }),

      [],
    );


  /* ==========================================================
     COMPTE HISTORIQUE
  ========================================================== */

  const historyBons =
    historyCompteId !== null
      ? bons.filter(
          (bon) =>
            bon.compteId ===
            historyCompteId,
        )
      : [];


  const historyAccount =
    historyBons[0];


  /* ==========================================================
     STATISTIQUES HISTORIQUE
  ========================================================== */

  const historyTotalOlives =
    historyBons.reduce(
      (total, bon) =>
        total +
        bon.quantityOlive,
      0,
    );


  const historyTotalOil =
    historyBons.reduce(
      (total, bon) =>
        total +
        bon.quantityOil,
      0,
    );


  const historyTotalPrice =
    historyBons.reduce(
      (total, bon) =>
        total +
        bon.price,
      0,
    );


  /* ==========================================================
     STYLE STATUT HISTORIQUE
  ========================================================== */

  const getHistoryStatusStyle = (
    status: string,
  ) => {

    if (
      status ===
      'En cours'
    ) {

      return {
        className:
          'bg-[#dcfce7] text-[#16833b]',
        icon:
          <CheckCircle2 className="size-3.5" />,
      };

    }


    if (
      status ===
      'Terminé'
    ) {

      return {
        className:
          'bg-[#dbeafe] text-[#2563eb]',
        icon:
          <CheckCircle2 className="size-3.5" />,
      };

    }


    if (
      status ===
      'En attente'
    ) {

      return {
        className:
          'bg-[#ffedd5] text-[#ea580c]',
        icon:
          <Clock3 className="size-3.5" />,
      };

    }


    if (
      status ===
      'Annulé'
    ) {

      return {
        className:
          'bg-[#fee2e2] text-[#dc2626]',
        icon:
          <XCircle className="size-3.5" />,
      };

    }


    return {
      className:
        'bg-gray-100 text-gray-600',
      icon:
        <Clock3 className="size-3.5" />,
    };

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div className="w-full">

      {/* ======================================================
          CARD PRINCIPALE
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      

{/* FILTRES : DATES ET ACTIONS */}
<div className="grid grid-cols-1 items-end gap-3 border-b border-[#edf0f2] p-4 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_190px_auto]">

  {/* DATE DE DÉBUT */}
  <div className="flex min-w-0 flex-col gap-1.5">
    <label
      htmlFor="dateDebut"
      className="text-xs font-semibold text-[#64748b]"
    >
      Date de début
    </label>

    <input
      id="dateDebut"
      type="date"
      value={dateDebut}
      max={dateFin || undefined}
      onChange={(event) => setDateDebut(event.target.value)}
      className="h-11 w-full min-w-0 rounded-lg border border-[#dfe4e9] bg-white px-3 text-sm text-[#334155] outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
    />
  </div>

  {/* DATE DE FIN */}
  <div className="flex min-w-0 flex-col gap-1.5">
    <label
      htmlFor="dateFin"
      className="text-xs font-semibold text-[#64748b]"
    >
      Date de fin
    </label>

    <input
      id="dateFin"
      type="date"
      value={dateFin}
      min={dateDebut || undefined}
      onChange={(event) => setDateFin(event.target.value)}
      className="h-11 w-full min-w-0 rounded-lg border border-[#dfe4e9] bg-white px-3 text-sm text-[#334155] outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
    />
  </div>

  {/* RÉINITIALISER */}
{/* RÉINITIALISER */}
{/* RÉINITIALISER */}
<Button
  type="button"
  variant="outline"
  onClick={handleReset}
  className="h-11 gap-2 whitespace-nowrap rounded-lg border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
>
  <RefreshCcw className="size-[17px]" />
  Réinitialiser
</Button>

{/* EXPORTER */}
<Button
  type="button"
  variant="outline"
  onClick={handleExport}
  className="h-11 gap-2 whitespace-nowrap rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] shadow-sm transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
>
  <Download className="size-[17px]" />
  Exporter
</Button>

</div>

{/* FILTRES PAR STATUT : DEUXIÈME LIGNE */}
<div className="grid grid-cols-2 gap-2 border-b border-[#edf0f2] bg-white px-4 py-3 sm:grid-cols-4 xl:grid-cols-7">

  {statusCounts.map((item, index) => {
    const active = statusFilter === item.label;

    const styles = [
      'border-[#dbeafe] bg-[#eff6ff] text-[#2563eb]',
      'border-[#e5e7eb] bg-[#f8fafc] text-[#64748b]',
      'border-[#fde68a] bg-[#fffbeb] text-[#b7791f]',
      'border-[#e9d5ff] bg-[#faf5ff] text-[#9333ea]',
      'border-[#bbf7d0] bg-[#ecfdf5] text-[#16833b]',
      'border-[#fecaca] bg-[#fff1f2] text-[#e11d48]',
      'border-[#a5f3fc] bg-[#ecfeff] text-[#0f9297]',
    ];

    const icons = [
      <FileText className="size-4" />,
      <UserRound className="size-4" />,
      <Scale className="size-4" />,
      <Clock3 className="size-4" />,
      <Factory className="size-4" />,
      <CreditCard className="size-4" />,
      <CheckCircle2 className="size-4" />,
    ];

    return (
      <button
        key={item.label}
        type="button"
        onClick={() => setStatusFilter(item.label)}
        className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold transition ${
          active
            ? 'border-[#2878e8] bg-[#2878e8] text-white shadow-sm'
            : `${styles[index]} hover:brightness-95`
        }`}
      >
        {icons[index]}
        <span className="truncate">{item.label}</span>
        <span className="shrink-0">({item.count})</span>
      </button>
    );
  })}

</div>




        {/* ====================================================
            AG GRID
        ==================================================== */}

        <div className="w-full px-4 pb-4">

          <div
  className="w-full"
  style={{
    height: `${Math.max(1, paginatedBons.length) * 58 + 50}px`,
  }}
>

            <AgGridProvider
              modules={[
                AllCommunityModule,
              ]}
            >

              <AgGridReact<BonReception>

                rowData={paginatedBons}

                columnDefs={
                  columnDefs
                }

                defaultColDef={
                  defaultColDef
                }

                theme={
                  bonReceptionTheme
                }

                rowHeight={
                  58
                }

                headerHeight={
                  50
                }

                

                animateRows={
                  true
                }

                suppressCellFocus={
                  true
                }

                getRowId={(
                  params,
                ) =>
                  params.data.id.toString()
                }

                onGridReady={
                  handleGridReady
                }

                localeText={{

                  page:
                    'Page',

                  more:
                    'Plus',

                  to:
                    'à',

                  of:
                    'sur',

                  next:
                    'Suivant',

                  last:
                    'Dernier',

                  first:
                    'Premier',

                  previous:
                    'Précédent',

                  loadingOoo:
                    'Chargement...',

                  noRowsToShow:
                    'Aucun bon de réception trouvé',

                  pageSizeSelectorLabel:
                    'Lignes par page',

                  filterOoo:
                    'Filtrer...',

                  equals:
                    'Égal à',

                  notEqual:
                    'Différent de',

                  contains:
                    'Contient',

                  notContains:
                    'Ne contient pas',

                  startsWith:
                    'Commence par',

                  endsWith:
                    'Se termine par',

                  lessThan:
                    'Inférieur à',

                  lessThanOrEqual:
                    'Inférieur ou égal à',

                  greaterThan:
                    'Supérieur à',

                  greaterThanOrEqual:
                    'Supérieur ou égal à',

                  andCondition:
                    'ET',

                  orCondition:
                    'OU',

                  applyFilter:
                    'Appliquer',

                  resetFilter:
                    'Réinitialiser',

                  clearFilter:
                    'Effacer',

                }}

              />

            </AgGridProvider>
            </div>
            {/* ====================================================
    PAGINATION PERSONNALISÉE
==================================================== */}

<div className="flex flex-col gap-4 border-t border-[#edf0f2] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

  {/* Nombre de résultats et choix de la taille */}
  <div className="flex flex-wrap items-center gap-3 text-sm text-[#64748b]">

    

    <div className="flex items-center gap-2">
      <label htmlFor="pageSize" className="whitespace-nowrap">
        Lignes par page
      </label>

      <select
        id="pageSize"
        value={pageSize}
        onChange={(event) => {
          setPageSize(Number(event.target.value));
        }}
        className="h-9 rounded-lg border border-[#dfe4e9] bg-white px-2 text-sm font-medium text-[#334155] outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>

  </div>

  {/* Navigation entre les pages */}
  <div className="flex flex-wrap items-center justify-center gap-1.5">

    <button
      type="button"
      title="Page précédente"
      aria-label="Page précédente"
      disabled={currentPage === 1}
      onClick={() => {
        setCurrentPage((page) => Math.max(1, page - 1));
      }}
      className="flex size-9 items-center justify-center rounded-lg border border-[#dfe4e9] text-[#64748b] transition hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#dfe4e9] disabled:hover:bg-white disabled:hover:text-[#64748b]"
    >
      <ChevronLeft className="size-4" />
    </button>

    {getPageNumbers().map((page, index) =>
      page === '...' ? (
        <span
          key={`ellipsis-${index}`}
          className="flex size-9 items-center justify-center text-sm text-[#94a3b8]"
        >
          ...
        </span>
      ) : (
        <button
          key={page}
          type="button"
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => setCurrentPage(page)}
          className={`flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
            currentPage === page
              ? 'border-[#556B2F] bg-[#556B2F] text-white shadow-sm'
              : 'border-[#dfe4e9] bg-white text-[#475569] hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]'
          }`}
        >
          {page}
        </button>
      ),
    )}

    <button
      type="button"
      title="Page suivante"
      aria-label="Page suivante"
      disabled={currentPage === totalPages}
      onClick={() => {
        setCurrentPage((page) => Math.min(totalPages, page + 1));
      }}
      className="flex size-9 items-center justify-center rounded-lg border border-[#dfe4e9] text-[#64748b] transition hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#dfe4e9] disabled:hover:bg-white disabled:hover:text-[#64748b]"
    >
      <ChevronRight className="size-4" />
    </button>

  </div>


          </div>

        </div>

      </div>


      {/* ======================================================
          PANNEAU HISTORIQUE
      ====================================================== */}

      {historyCompteId !== null && (

        <div
          className="fixed inset-0 z-[70] bg-black/30"
          onClick={() =>
            setHistoryCompteId(null)
          }
        >

          <div
            className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex size-11 items-center justify-center rounded-xl bg-[#eef4e6]">

                  <History className="size-5 text-[#556B2F]" />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#172033]">
                    Historique des bons
                  </h2>

                  <p className="mt-0.5 text-xs text-[#94a3b8]">
                    Historique du compte
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setHistoryCompteId(null)
                }
                className="flex size-9 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#172033]"
              >

                <X className="size-5" />

              </button>

            </div>


            {/* ==================================================
                CONTENU
            ================================================== */}

            <div className="flex-1 overflow-y-auto">


              {/* =================================================
                  COMPTE
              ================================================= */}

              {historyAccount && (

                <div className="border-b border-[#edf0f2] bg-[#fafcf9] px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e6f0dc]">

                      <UserRound className="size-7 text-[#556B2F]" />

                    </div>


                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-bold text-[#172033]">
                        {historyAccount.name}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b]">

                        <span className="flex items-center gap-1.5">

                          <Hash className="size-3.5" />

                          Compte #
                          {historyAccount.compteId}

                        </span>


                        <span className="flex items-center gap-1.5">

                          <Phone className="size-3.5" />

                          {historyAccount.mobile}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              )}


              {/* =================================================
                  STATISTIQUES
              ================================================= */}

              <div className="grid grid-cols-2 gap-3 border-b border-[#edf0f2] p-5">


                <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

                  <div className="flex items-center gap-2">

                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6]">

                      <FileText className="size-4 text-[#556B2F]" />

                    </div>

                    <span className="text-xs text-[#64748b]">
                      Total bons
                    </span>

                  </div>

                  <p className="mt-2 text-xl font-bold text-[#172033]">
                    {historyBons.length}
                  </p>

                </div>


                <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

                  <div className="flex items-center gap-2">

                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff1df]">

                      <Droplets className="size-4 text-[#ea580c]" />

                    </div>

                    <span className="text-xs text-[#64748b]">
                      Olives
                    </span>

                  </div>

                  <p className="mt-2 text-xl font-bold text-[#172033]">

                    {formatNumber(
                      historyTotalOlives,
                    )}

                    <span className="ml-1 text-xs font-medium text-[#94a3b8]">
                      kg
                    </span>

                  </p>

                </div>


                <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

                  <div className="flex items-center gap-2">

                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f1ff]">

                      <Droplets className="size-4 text-[#2563eb]" />

                    </div>

                    <span className="text-xs text-[#64748b]">
                      Huile
                    </span>

                  </div>

                  <p className="mt-2 text-xl font-bold text-[#172033]">

                    {formatNumber(
                      historyTotalOil,
                    )}

                    <span className="ml-1 text-xs font-medium text-[#94a3b8]">
                      L
                    </span>

                  </p>

                </div>


                <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

                  <div className="flex items-center gap-2">

                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f7ed]">

                      <span className="text-xs font-bold text-[#16833b]">
                        DT
                      </span>

                    </div>

                    <span className="text-xs text-[#64748b]">
                      Montant
                    </span>

                  </div>

                  <p className="mt-2 text-xl font-bold text-[#172033]">

                    {formatPrice(
                      historyTotalPrice,
                    )}

                    <span className="ml-1 text-xs font-medium text-[#94a3b8]">
                      DT
                    </span>

                  </p>

                </div>

              </div>


              {/* =================================================
                  HISTORIQUE
              ================================================= */}

              <div className="px-6 pb-8 pt-5">

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-bold text-[#172033]">
                      Historique des réceptions
                    </h3>

                    <p className="mt-1 text-xs text-[#94a3b8]">
                      Tous les bons associés à ce compte
                    </p>

                  </div>


                  <span className="rounded-full bg-[#eef4e6] px-3 py-1 text-xs font-semibold text-[#556B2F]">

                    {historyBons.length}
                    {' '}
                    bon
                    {historyBons.length > 1
                      ? 's'
                      : ''}

                  </span>

                </div>


                {/* =================================================
                    TIMELINE
                ================================================= */}

                <div className="relative">

                  {historyBons.length > 1 && (

                    <div className="absolute bottom-6 left-[17px] top-6 w-px bg-[#e5e7eb]" />

                  )}


                  <div className="space-y-5">

                    {historyBons.map(
                      (bon) => {

                        const statusStyle =
                          getHistoryStatusStyle(
                            bon.statusLib,
                          );

                        return (

                          <div
                            key={bon.id}
                            className="relative flex gap-4"
                          >

                            {/* POINT */}

                            <div className="relative z-10 flex size-[35px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#eef4e6]">

                              <div className="size-2 rounded-full bg-[#556B2F]" />

                            </div>


                            {/* CARTE */}

                            <div className="min-w-0 flex-1 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">


                              {/* HEADER */}

                              <div className="flex items-start justify-between gap-3">

                                <div>

                                  <div className="flex items-center gap-2">

                                    <span className="text-sm font-bold text-[#172033]">
                                      {bon.reference}
                                    </span>

                                    <span className="text-[11px] text-[#94a3b8]">
                                      #{bon.id}
                                    </span>

                                  </div>


                                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">

                                    <CalendarDays className="size-3.5" />

                                    {bon.dateCreation}

                                  </div>

                                </div>


                                {/* STATUT */}

                                <span
                                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${statusStyle.className}`}
                                >

                                  {statusStyle.icon}

                                  {bon.statusLib}

                                </span>

                              </div>


                              {/* DONNÉES */}

                              <div className="mt-4 grid grid-cols-2 gap-3">

                                <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                  <p className="text-[10px] text-[#94a3b8]">
                                    Olives
                                  </p>

                                  <p className="mt-0.5 text-xs font-semibold text-[#334155]">

                                    {formatNumber(
                                      bon.quantityOlive,
                                    )}
                                    {' kg'}

                                  </p>

                                </div>


                                <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                  <p className="text-[10px] text-[#94a3b8]">
                                    Huile
                                  </p>

                                  <p className="mt-0.5 text-xs font-semibold text-[#334155]">

                                    {formatNumber(
                                      bon.quantityOil,
                                    )}
                                    {' L'}

                                  </p>

                                </div>


                                <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                  <p className="text-[10px] text-[#94a3b8]">
                                    Prix/kg
                                  </p>

                                  <p className="mt-0.5 text-xs font-semibold text-[#334155]">

                                    {formatPrice(
                                      bon.priceKg,
                                    )}
                                    {' DT'}

                                  </p>

                                </div>


                                <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                  <p className="text-[10px] text-[#94a3b8]">
                                    Prix total
                                  </p>

                                  <p className="mt-0.5 text-xs font-bold text-[#556B2F]">

                                    {formatPrice(
                                      bon.price,
                                    )}
                                    {' DT'}

                                  </p>

                                </div>

                              </div>


                              {/* PAIEMENT */}

                              <div className="mt-3 border-t border-[#edf0f2] pt-3">

                                <div className="flex items-center justify-between text-xs">

                                  <span className="text-[#64748b]">
                                    Paiement
                                  </span>

                                  <span className="font-semibold text-[#334155]">

                                    {formatPrice(
                                      bon.payement,
                                    )}
                                    {' DT'}

                                  </span>

                                </div>


                                <div className="mt-1 flex items-center justify-between text-xs">

                                  <span className="text-[#64748b]">
                                    Acompte
                                  </span>

                                  <span className="font-semibold text-[#334155]">

                                    {formatPrice(
                                      bon.acompte,
                                    )}
                                    {' DT'}

                                  </span>

                                </div>

                              </div>


                              {/* PRODUCTION */}

                              <div className="mt-3 rounded-lg border border-[#edf0f2] bg-[#fafcf9] p-3">

                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                                  Production
                                </p>

                                <div className="mt-2 space-y-1 text-xs text-[#475569]">

                                  <div className="flex justify-between gap-3">

                                    <span>
                                      Début
                                    </span>

                                    <span className="font-medium text-[#334155]">
                                      {bon.dateDebProduction}
                                    </span>

                                  </div>


                                  <div className="flex justify-between gap-3">

                                    <span>
                                      Fin
                                    </span>

                                    <span className="font-medium text-[#334155]">
                                      {bon.dateFinProduction}
                                    </span>

                                  </div>

                                </div>

                              </div>


                              {/* OBSERVATION */}

                              {bon.observation && (

                                <div className="mt-3 rounded-lg bg-[#f8fafc] p-3">

                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                                    Observation
                                  </p>

                                  <p className="mt-1 text-xs text-[#475569]">
                                    {bon.observation}
                                  </p>

                                </div>

                              )}

                            </div>

                          </div>

                        );

                      },
                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="border-t border-[#e5e7eb] bg-white px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setHistoryCompteId(null)
                }
                className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white text-sm font-semibold text-[#334155] transition hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
              >

                Fermer

              </button>

            </div>

          </div>

        </div>

      )}
      {bonASupprimer && (
  <div
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
    onClick={() => {
      if (!suppressionEnCours) {
        setBonASupprimer(null);
      }
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="relative w-full max-w-[500px] rounded-2xl bg-white p-7 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Fermer */}
      <button
        type="button"
        aria-label="Fermer"
        disabled={suppressionEnCours}
        onClick={() => setBonASupprimer(null)}
        className="absolute right-5 top-5 text-gray-500 transition hover:text-gray-800 disabled:opacity-50"
      >
        <X className="size-5" />
      </button>

      {/* Icône */}
      <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-red-50">
        <Trash2 className="size-9 text-red-500" />
      </div>

      {/* Titre */}
      <h2
        id="delete-dialog-title"
        className="text-center text-2xl font-bold text-slate-800"
      >
        Supprimer le bon de réception
      </h2>

      {/* Message */}
      <p className="mt-3 text-center leading-6 text-slate-500">
        Voulez-vous vraiment supprimer le bon de réception
        <span className="block font-semibold text-slate-800">
          {bonASupprimer.reference} — {bonASupprimer.name}
        </span>
        ?
      </p>

      {/* Boutons */}
      <div className="mt-7 flex justify-center gap-4">
        <button
          type="button"
          disabled={suppressionEnCours}
          onClick={() => setBonASupprimer(null)}
          className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          Annuler
        </button>

        <button
          type="button"
          disabled={suppressionEnCours}
          onClick={confirmerSuppression}
          className="flex items-center gap-2 rounded-lg bg-[#ff303d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="size-4" />
          {suppressionEnCours ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}