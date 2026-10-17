
import { useMemo, useState } from 'react';

import {
  CheckCircle2,
  Download,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Users,
  X,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

/* ============================================================
   TYPE COMPTE
============================================================ */

export interface Compte {
  compteId: number;
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: number;
  priceConv: number;
  isBaseCompte: boolean;
  baseCompteId: number | null;
}

interface CompteTableProps {
  comptes?: Compte[];
  onEdit?: (compte: Compte) => void;
  onDelete?: (compte: Compte) => void;
}

/* ============================================================
   DONNÉES PAR DÉFAUT
============================================================ */

const defaultComptes: Compte[] = [
  {
    compteId: 1,
    name: 'Ahmed Ben Ali',
    adresse: 'Sousse',
    mobile: '12345678',
    mail: 'ahmed@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 2,
    name: 'Client 1',
    adresse: 'Monastir',
    mobile: '98765432',
    mail: 'client1@gmail.com',
    statusId: 1,
    priceConv: 1.25,
    isBaseCompte: false,
    baseCompteId: 1,
  },
  {
    compteId: 3,
    name: 'Fournisseur 1',
    adresse: 'Sfax',
    mobile: '55667788',
    mail: 'fournisseur@gmail.com',
    statusId: 2,
    priceConv: 0.8,
    isBaseCompte: false,
    baseCompteId: 1,
  },
  {
    compteId: 4,
    name: 'Coopérative',
    adresse: 'Mahdia',
    mobile: '22334455',
    mail: 'coop@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 5,
    name: 'Client 2',
    adresse: 'Tunis',
    mobile: '22113344',
    mail: 'client2@gmail.com',
    statusId: 1,
    priceConv: 1.1,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 6,
    name: 'Fournisseur 2',
    adresse: 'Gabès',
    mobile: '55664433',
    mail: 'fournisseur2@gmail.com',
    statusId: 1,
    priceConv: 0.9,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 7,
    name: 'Client 3',
    adresse: 'Nabeul',
    mobile: '99887766',
    mail: 'client3@gmail.com',
    statusId: 2,
    priceConv: 1.15,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 8,
    name: 'Coopérative 2',
    adresse: 'Kairouan',
    mobile: '44556677',
    mail: 'coop2@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 9,
    name: 'Client 4',
    adresse: 'Bizerte',
    mobile: '77889900',
    mail: 'client4@gmail.com',
    statusId: 1,
    priceConv: 0.95,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 10,
    name: 'Fournisseur 3',
    adresse: 'Béja',
    mobile: '11223344',
    mail: 'fournisseur3@gmail.com',
    statusId: 2,
    priceConv: 0.75,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 11,
    name: 'Client 5',
    adresse: 'Zaghouan',
    mobile: '33445566',
    mail: 'client5@gmail.com',
    statusId: 1,
    priceConv: 1.2,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 12,
    name: 'Coopérative 3',
    adresse: 'Le Kef',
    mobile: '66778899',
    mail: 'coop3@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
];

/* ============================================================
   COMPOSANT CARTE
============================================================ */

function CompteCard({
  compte,
  index,
  onEdit,
  onDelete,
}: {
  compte: Compte;
  index: number;
  onEdit?: (compte: Compte) => void;
  onDelete?: (compte: Compte) => void;
}) {
  const initials = compte.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const avatarColors = [
    'bg-[#e8efdf] text-[#556B2F]',
    'bg-[#e5efff] text-[#3767a5]',
    'bg-[#fce8e8] text-[#b54747]',
    'bg-[#f3e8ff] text-[#8050a5]',
    'bg-[#e1f4ef] text-[#287b67]',
  ];

  const isActive = compte.statusId === 1;

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-[#e2eaf0] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d9b6] hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-3 border-b border-[#edf0f2] px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              avatarColors[index % avatarColors.length]
            }`}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h3
              className="truncate text-sm font-bold text-[#172033]"
              title={compte.name}
            >
              {compte.name}
            </h3>

            <p className="mt-1 text-[11px] text-[#94a3b8]">
              Compte #{compte.compteId}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#64748b]">
          C{String(compte.compteId).padStart(3, '0')}
        </span>
      </div>

      {/* INFORMATIONS */}
      <div className="space-y-3 px-3.5 py-3.5">
        <div className="flex min-w-0 items-start gap-2">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />

          <span
            className="min-w-0 break-words text-xs text-[#64748b]"
            title={compte.adresse}
          >
            {compte.adresse || 'Adresse non renseignée'}
          </span>
        </div>

        <div className="flex min-w-0 items-start gap-2">
          <Phone className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />

          <span className="min-w-0 break-words text-xs text-[#64748b]">
            {compte.mobile || 'Téléphone non renseigné'}
          </span>
        </div>

        <div className="flex min-w-0 items-start gap-2">
          <Mail className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />

          <span
            className="min-w-0 break-all text-xs leading-5 text-[#64748b]"
            title={compte.mail}
          >
            {compte.mail || 'Aucun email'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[#f0f2f4] pt-3">
          <span className="text-[11px] font-medium text-[#94a3b8]">
            Statut du compte
          </span>

          {isActive ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#e3f5e9] px-2 py-1 text-[10px] font-semibold text-[#16833b]">
              <span className="size-1.5 rounded-full bg-[#16a34a]" />
              Actif
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#fdebed] px-2 py-1 text-[10px] font-semibold text-[#dc2635]">
              <span className="size-1.5 rounded-full bg-[#ef3340]" />
              Inactif
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#94a3b8]">
            Prix conversion
          </span>

          <span className="text-xs font-semibold text-[#334155]">
            {Number(compte.priceConv).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            DT
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#94a3b8]">
            Compte de base
          </span>

          {compte.isBaseCompte ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef4e6] px-2 py-1 text-[10px] font-semibold text-[#556B2F]">
              <ShieldCheck className="size-3" />
              Oui
            </span>
          ) : (
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#64748b]">
              Non
              {compte.baseCompteId != null &&
                ` · ID ${compte.baseCompteId}`}
            </span>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between gap-2 border-t border-[#edf0f2] bg-[#fafcfb] px-3.5 py-2.5">
        <span className="truncate text-[10px] text-[#94a3b8]">
          {compte.isBaseCompte
            ? 'Compte principal'
            : `Compte rattaché · ${compte.baseCompteId ?? '—'}`}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            title={`Modifier ${compte.name}`}
            aria-label={`Modifier ${compte.name}`}
            onClick={() => onEdit?.(compte)}
            className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2] hover:text-[#3f5124]"
          >
            <Pencil className="size-4" />
          </button>

          <button
            type="button"
            title={`Supprimer ${compte.name}`}
            aria-label={`Supprimer ${compte.name}`}
            onClick={() => onDelete?.(compte)}
            className="flex size-8 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd] hover:text-[#d92735]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   TABLE / GRILLE DES COMPTES
============================================================ */

export function CompteTable({
  comptes = defaultComptes,
  onEdit,
  onDelete,
}: CompteTableProps) {
  const [statusFilter, setStatusFilter] = useState('Tous');

  const totalComptes = comptes.length;

  const activeComptes = comptes.filter(
    (compte) => compte.statusId === 1,
  ).length;

  const inactiveComptes = comptes.filter(
    (compte) => compte.statusId !== 1,
  ).length;

  const comptesWithEmail = comptes.filter(
    (compte) => Boolean(compte.mail?.trim()),
  ).length;

  const filteredComptes = useMemo(() => {
    switch (statusFilter) {
      case 'Actifs':
        return comptes.filter((compte) => compte.statusId === 1);

      case 'Inactifs':
        return comptes.filter((compte) => compte.statusId !== 1);

      case 'Avec email':
        return comptes.filter((compte) => Boolean(compte.mail?.trim()));

      default:
        return comptes;
    }
  }, [comptes, statusFilter]);

  /* EXPORT CSV */
  const handleExport = () => {
    const headers = [
      'Compte ID',
      'Nom',
      'Adresse',
      'Mobile',
      'Email',
      'Statut',
      'Prix conversion',
      'Compte de base',
      'Compte de base ID',
    ];

    const rows = filteredComptes.map((compte) => [
      compte.compteId,
      compte.name,
      compte.adresse,
      compte.mobile,
      compte.mail,
      compte.statusId === 1 ? 'Actif' : 'Inactif',
      compte.priceConv,
      compte.isBaseCompte ? 'Oui' : 'Non',
      compte.baseCompteId ?? '',
    ]);

    const escapeCsv = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCsv).join(';'),
      ...rows.map((row) => row.map(escapeCsv).join(';')),
    ].join('\r\n');

    const blob = new Blob(
      ['\uFEFF', csvContent],
      { type: 'text/csv;charset=utf-8;' },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'comptes.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const filters = [
    {
      label: 'Tous',
      count: totalComptes,
      dot: 'bg-[#94a3b8]',
      active: 'border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]',
      badge: 'bg-[#e9eef3] text-[#334155]',
    },
    {
      label: 'Actifs',
      count: activeComptes,
      dot: 'bg-[#16a34a]',
      active: 'border-[#b8e3c7] bg-[#f0faf3] text-[#16833b]',
      badge: 'bg-[#e3f5e9] text-[#16833b]',
    },
    {
      label: 'Inactifs',
      count: inactiveComptes,
      dot: 'bg-[#ef4444]',
      active: 'border-[#f5c9cd] bg-[#fff4f4] text-[#dc2635]',
      badge: 'bg-[#fdebed] text-[#dc2635]',
    },
    {
      label: 'Avec email',
      count: comptesWithEmail,
      dot: '',
      active: 'border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]',
      badge: 'bg-[#e9eef3] text-[#334155]',
    },
  ];

  return (
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        {/* STATISTIQUES */}
        {/* STATISTIQUES */}
        <div className="grid grid-cols-1 gap-3 border-b border-[#edf0f2] bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex h-[76px] items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4e6]">
              <Users className="size-5 text-[#556B2F]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#172033]">
                {totalComptes}
              </p>
              <p className="text-xs text-[#7b8798]">Comptes au total</p>
            </div>
          </div>

          <div className="flex h-[76px] items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e3f5e9]">
              <CheckCircle2 className="size-5 text-[#16833b]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#172033]">
                {activeComptes}
              </p>
              <p className="text-xs text-[#7b8798]">Comptes actifs</p>
            </div>
          </div>

          <div className="flex h-[76px] items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fdebed]">
              <X className="size-5 text-[#ef3340]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#172033]">
                {inactiveComptes}
              </p>
              <p className="text-xs text-[#7b8798]">Comptes inactifs</p>
            </div>
          </div>

          <div className="flex h-[76px] items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5efff]">
              <Mail className="size-5 text-[#4679b8]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#172033]">
                {comptesWithEmail}
              </p>
              <p className="text-xs text-[#7b8798]">Avec email</p>
            </div>
          </div>
        </div>

        {/* FILTRES + ACTIONS */}
        <div className="flex flex-col gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            {filters.map((filter) => {
              const selected = statusFilter === filter.label;

              return (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setStatusFilter(filter.label)}
                  aria-pressed={selected}
                  className={`flex h-10 items-center gap-2 rounded-lg border px-3 transition ${
                    selected
                      ? filter.active
                      : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#c9d9b6]'
                  }`}
                >
                  {filter.label === 'Avec email' ? (
                    <Mail className="size-3.5 text-[#556B2F]" />
                  ) : (
                    <span className={`size-2 rounded-full ${filter.dot}`} />
                  )}

                  <span className="whitespace-nowrap text-xs font-semibold">
                    {filter.label}
                  </span>

                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-bold ${filter.badge}`}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStatusFilter('Tous')}
              className="h-10 rounded-lg border-[#dfe4e9] px-3 text-xs text-[#334155] hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
            >
              <RefreshCcw className="size-3.5" />
              Réinitialiser
            </Button>

            <Button
              type="button"
              onClick={handleExport}
              className="h-10 rounded-lg bg-[#087f48] px-4 text-xs font-semibold text-white hover:bg-[#066b3c]"
            >
              <Download className="size-3.5" />
              Exporter
            </Button>
          </div>
        </div>

        {/* GRILLE DES COMPTES */}
        <div className="bg-white p-4 sm:p-5">
          {filteredComptes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredComptes.map((compte, index) => (
                <CompteCard
                  key={compte.compteId}
                  compte={compte}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4e9] bg-white px-4 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#eef4e6]">
                <Wallet className="size-6 text-[#556B2F]" />
              </div>
              <h3 className="text-sm font-semibold text-[#172033]">
                Aucun compte trouvé
              </h3>
              <p className="mt-1 text-xs text-[#94a3b8]">
                Aucun compte ne correspond au filtre sélectionné.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('Tous')}
                className="mt-4 text-xs font-semibold text-[#556B2F] hover:underline"
              >
                Afficher tous les comptes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompteTable;
