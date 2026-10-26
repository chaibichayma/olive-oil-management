
import { useMemo, useState } from 'react';

import {
  CheckCircle2,
  Download,
  Mail,
  Pencil,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

/* ============================================================
   TYPE UTILISATEUR
============================================================ */

export interface Utilisateur {
  id: number;
  displayName: string;
  userName: string;
  mail: string;
  password: string;
  userCode: string;
  isActive: boolean;
}

/* ============================================================
   DONNÉES STATIQUES
============================================================ */

export const defaultUtilisateurs: Utilisateur[] = [
  {
    id: 1,
    displayName: 'Ayah Ben Ali',
    userName: 'ayah',
    mail: 'ayah@example.com',
    password: 'demo123',
    userCode: 'U001',
    isActive: true,
  },
  {
    id: 2,
    displayName: 'Mohamed',
    userName: 'mohamed',
    mail: 'mohamed@example.com',
    password: 'demo123',
    userCode: 'U002',
    isActive: true,
  },
  {
    id: 3,
    displayName: 'Salma',
    userName: 'salma',
    mail: 'salma@example.com',
    password: 'demo123',
    userCode: 'U003',
    isActive: false,
  },
  {
    id: 4,
    displayName: 'Youssef',
    userName: 'youssef',
    mail: 'youssef@example.com',
    password: 'demo123',
    userCode: 'U004',
    isActive: true,
  },
  {
    id: 5,
    displayName: 'Amine',
    userName: 'amine',
    mail: 'amine@example.com',
    password: 'demo123',
    userCode: 'U005',
    isActive: true,
  },
  {
    id: 6,
    displayName: 'Sarra',
    userName: 'sarra',
    mail: 'sarra@example.com',
    password: 'demo123',
    userCode: 'U006',
    isActive: false,
  },
  {
    id: 7,
    displayName: 'Houssem',
    userName: 'houssem',
    mail: 'houssem@example.com',
    password: 'demo123',
    userCode: 'U007',
    isActive: true,
  },
  {
    id: 8,
    displayName: 'Mariem',
    userName: 'mariem',
    mail: 'mariem@example.com',
    password: 'demo123',
    userCode: 'U008',
    isActive: true,
  },
  {
    id: 9,
    displayName: 'Ahmed',
    userName: 'ahmed',
    mail: 'ahmed@example.com',
    password: 'demo123',
    userCode: 'U009',
    isActive: true,
  },
  {
    id: 10,
    displayName: 'Ines',
    userName: 'ines',
    mail: 'ines@example.com',
    password: 'demo123',
    userCode: 'U010',
    isActive: false,
  },
  {
    id: 11,
    displayName: 'Omar',
    userName: 'omar',
    mail: 'omar@example.com',
    password: 'demo123',
    userCode: 'U011',
    isActive: true,
  },
  {
    id: 12,
    displayName: 'Nour',
    userName: 'nour',
    mail: 'nour@example.com',
    password: 'demo123',
    userCode: 'U012',
    isActive: true,
  },
];

/* ============================================================
   PHOTOS UTILISATEURS
============================================================ */

const userImages: Record<number, string> = {
  1: 'https://i.pravatar.cc/100?img=47',
  2: 'https://i.pravatar.cc/100?img=12',
  3: 'https://i.pravatar.cc/100?img=32',
  4: 'https://i.pravatar.cc/100?img=11',
  5: 'https://i.pravatar.cc/100?img=68',
  6: 'https://i.pravatar.cc/100?img=44',
  7: 'https://i.pravatar.cc/100?img=13',
  8: 'https://i.pravatar.cc/100?img=49',
  9: 'https://i.pravatar.cc/100?img=51',
  10: 'https://i.pravatar.cc/100?img=45',
  11: 'https://i.pravatar.cc/100?img=56',
  12: 'https://i.pravatar.cc/100?img=48',
};



interface UtilisateurTableProps {
  utilisateurs?: Utilisateur[];
  onEdit?: (utilisateur: Utilisateur) => void;
  onDelete?: (utilisateur: Utilisateur) => void;
}

type StatusFilter = 'Tous' | 'Actifs' | 'Inactifs' | 'Avec email';

/* ============================================================
   COMPOSANT UTILISATEURS
============================================================ */

export function UtilisateurTable({
  utilisateurs = defaultUtilisateurs,
  onEdit,
  onDelete,
}: UtilisateurTableProps) {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('Tous');

  /* ============================================================
     STATISTIQUES
  ============================================================ */

  const totalUsers = utilisateurs.length;

  const activeUsers = utilisateurs.filter(
    (user) => user.isActive,
  ).length;

  const inactiveUsers = utilisateurs.filter(
    (user) => !user.isActive,
  ).length;

  const usersWithEmail = utilisateurs.filter(
    (user) => user.mail.trim().length > 0,
  ).length;

  /* ============================================================
     FILTRAGE
  ============================================================ */

  const filteredUtilisateurs = useMemo(() => {
    switch (statusFilter) {
      case 'Actifs':
        return utilisateurs.filter((user) => user.isActive);

      case 'Inactifs':
        return utilisateurs.filter((user) => !user.isActive);

      case 'Avec email':
        return utilisateurs.filter(
          (user) => user.mail.trim().length > 0,
        );

      default:
        return utilisateurs;
    }
  }, [utilisateurs, statusFilter]);

  /* ============================================================
     RÉINITIALISER
  ============================================================ */

  const handleReset = () => {
    setStatusFilter('Tous');
  };

  /* ============================================================
     EXPORT CSV
     Exporte les utilisateurs du filtre sélectionné.
  ============================================================ */

  const handleExport = () => {
    const headers = [
      "Nom d'affichage",
      'Nom utilisateur',
      'Email',
      'Code utilisateur',
      'Statut',
    ];

    const rows = filteredUtilisateurs.map((user) => [
      user.displayName,
      user.userName,
      user.mail,
      user.userCode,
      user.isActive ? 'Actif' : 'Inactif',
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) => row.map(escapeCSV).join(';'))
      .join('\r\n');

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' },
    );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'utilisateurs.csv';

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    };

    /* ============================================================
      RENDER
    ============================================================ */

    return (
      <div className="w-full min-w-0 space-y-4">
        {/* CONTENEUR PRINCIPAL */}

        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f4f8fb] shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          {/* FILTRES + RÉINITIALISER + EXPORTER */}

          <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">

            {/* FILTRES CLIQUABLES */}

            <div className="flex min-w-0 flex-wrap items-center gap-8">

              {/* TOUS */}

              <button
                type="button"
                onClick={() => setStatusFilter('Tous')}
                aria-pressed={statusFilter === 'Tous'}
                className={`flex h-10 min-w-[140px] items-center gap-2 rounded-md border px-4 transition ${
                  statusFilter === 'Tous'
                    ? 'border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]'
                    : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#c9d9b6]'
                }`}
              >
                <span className="size-2 rounded-full bg-[#94a3b8]" />
                <span className="text-xs font-semibold">Tous</span>
                <span className="rounded-md bg-[#e9eef3] px-2 py-1 text-[10px] font-bold">
                  {totalUsers}
                </span>
              </button>

              {/* ACTIFS */}

              <button
                type="button"
                onClick={() => setStatusFilter('Actifs')}
                aria-pressed={statusFilter === 'Actifs'}
                className={`flex h-10 min-w-[200px] items-center gap-2 rounded-md border px-3 transition ${
                  statusFilter === 'Actifs'
                    ? 'border-[#b8e3c7] bg-[#f0faf3] text-[#16833b]'
                    : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#b8e3c7]'
                }`}
              >
                <span className="size-2 rounded-full bg-[#16a34a]" />
                <span className="text-xs font-semibold">Actifs</span>
                <span className="rounded-md bg-[#e3f5e9] px-2 py-1 text-[10px] font-bold text-[#16833b]">
                  {activeUsers}
                </span>
              </button>

              {/* INACTIFS */}

              <button
                type="button"
                onClick={() => setStatusFilter('Inactifs')}
                aria-pressed={statusFilter === 'Inactifs'}
                className={`flex h-10 items-center gap-2 rounded-md border px-3 transition ${
                  statusFilter === 'Inactifs'
                    ? 'border-[#f5c9cd] bg-[#fff4f4] text-[#dc2635]'
                    : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#f5c9cd]'
                }`}
              >
                <span className="size-2 rounded-full bg-[#ef4444]" />
                <span className="text-xs font-semibold">Inactifs</span>
                <span className="rounded-md bg-[#fdebed] px-2 py-1 text-[10px] font-bold text-[#dc2635]">
                  {inactiveUsers}
                </span>
              </button>

              {/* AVEC EMAIL */}

              <button
                type="button"
                onClick={() => setStatusFilter('Avec email')}
                aria-pressed={statusFilter === 'Avec email'}
                className={`flex h-10 items-center gap-2 rounded-md border px-3 transition ${
                  statusFilter === 'Avec email'
                    ? 'border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]'
                    : 'border-[#e5e7eb] bg-white text-[#334155] hover:border-[#bae6fd]'
                }`}
              >
                <Mail className="size-3.5 text-[#0ea5e9]" />
                <span className="text-xs font-semibold">Avec email</span>
                <span className="rounded-md bg-[#e5f4fc] px-2 py-1 text-[10px] font-bold text-[#0369a1]">
                  {usersWithEmail}
                </span>
              </button>

            </div>

          {/* BOUTONS */}

          <div className="flex shrink-0 items-center gap-3">
  {/* RÉINITIALISER - ORANGE CLAIR */}
  <Button
    type="button"
    variant="outline"
    onClick={handleReset}
    className="h-10 min-w-[150px] gap-2 rounded-lg border border-orange-200 bg-orange-50 px-6 text-sm font-semibold text-orange-700 transition-colors hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
  >
    <RefreshCcw className="size-4" />
    Réinitialiser
  </Button>

  {/* EXPORTER - VERT TRÈS CLAIR */}
  <Button
    type="button"
    variant="outline"
    onClick={handleExport}
    className="h-10 min-w-[140px] gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-6 text-sm font-semibold text-[#556B2F] shadow-sm transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
  >
    <Download className="size-4" />
    Exporter
  </Button>
</div>

        </div>

        {/* GRILLE DES UTILISATEURS */}

        <div className="bg-white p-4 sm:p-5">

          {filteredUtilisateurs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

              {filteredUtilisateurs.map((utilisateur) => {
                const imageUrl =
                  userImages[utilisateur.id] ||
                  'https://i.pravatar.cc/100?img=1';

                return (
                  <article
                    key={utilisateur.id}
                    className="group min-w-0 overflow-hidden rounded-xl border border-[#e1e8ee] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d9b6] hover:shadow-[0_5px_16px_rgba(15,23,42,0.08)]"
                  >

                    {/* EN-TÊTE */}

                    <div className="flex items-start justify-between gap-2 border-b border-[#edf0f2] px-3 py-3">

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="size-11 shrink-0 overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f1f5f9]">
                          <img
                            src={imageUrl}
                            alt={utilisateur.displayName}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-[#172033]">
                            {utilisateur.displayName}
                          </h3>
                          <p className="mt-1 truncate text-[11px] text-[#94a3b8]">
                            @{utilisateur.userName}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#64748b]">
                        {utilisateur.userCode}
                      </span>

                    </div>

                    {/* INFORMATIONS */}

                    <div className="space-y-3 px-3 py-3">

                      <div className="flex min-w-0 items-start gap-2">
                        <Mail className="mt-0.5 size-3.5 shrink-0 text-[#94a3b8]" />
                        <span
                          className="min-w-0 break-all text-xs leading-5 text-[#64748b]"
                          title={utilisateur.mail}
                        >
                          {utilisateur.mail || 'Aucun email'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-[#94a3b8]">
                          Statut du compte
                        </span>

                        {utilisateur.isActive ? (
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

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center justify-between border-t border-[#edf0f2] bg-[#fafcfb] px-3 py-2.5">

                      <span className="text-[10px] text-[#94a3b8]">
                        Code : {utilisateur.userCode}
                      </span>

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          title={`Modifier ${utilisateur.displayName}`}
                          aria-label={`Modifier ${utilisateur.displayName}`}
                          onClick={() => onEdit?.(utilisateur)}
                          className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F] transition hover:bg-[#dfead2] hover:text-[#3f5124]"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          title={`Supprimer ${utilisateur.displayName}`}
                          aria-label={`Supprimer ${utilisateur.displayName}`}
                          onClick={() => onDelete?.(utilisateur)}
                          className="flex size-8 items-center justify-center rounded-lg bg-[#fdebed] text-[#ef3340] transition hover:bg-[#fbdadd] hover:text-[#d92735]"
                        >
                          <Trash2 className="size-4" />
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4e9] bg-white px-4 text-center">

              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f1f5f9]">
                <Users className="size-6 text-[#94a3b8]" />
              </div>

              <h3 className="text-sm font-semibold text-[#334155]">
                Aucun utilisateur trouvé
              </h3>

              <p className="mt-1 text-xs text-[#94a3b8]">
                Aucun utilisateur ne correspond à ce filtre.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="mt-4 h-9 gap-2 rounded-lg text-xs"
              >
                <RefreshCcw className="size-3.5" />
                Réinitialiser
              </Button>

            </div>
          )}

          

        </div>

      </div>

    </div>
  );
}