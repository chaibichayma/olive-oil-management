
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Wrench,
  Plus,
  Search,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Users,
  Crown,
  Settings,
  UserRound,
  GraduationCap,
  ChartNoAxesColumnIncreasing,
  Shield,
  MoreVertical,
  Trash2,
  Pencil,
  X,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

type Fonction = {
  id: number;
  code: string;
  libelle: string;
  nombrePersonnels: number;
};

const FONCTIONS_INITIALES: Fonction[] = [
  { id: 1, code: 'FON-001', libelle: 'Administrateur', nombrePersonnels: 1 },
  { id: 2, code: 'FON-002', libelle: 'Responsable', nombrePersonnels: 3 },
  { id: 3, code: 'FON-003', libelle: 'Employé', nombrePersonnels: 8 },
  { id: 4, code: 'FON-004', libelle: 'Consultant', nombrePersonnels: 1 },
  { id: 5, code: 'FON-005', libelle: 'Gestionnaire', nombrePersonnels: 4 },
  { id: 6, code: 'FON-006', libelle: 'Technicien', nombrePersonnels: 5 },
  { id: 7, code: 'FON-007', libelle: 'Comptable', nombrePersonnels: 2 },
  { id: 8, code: 'FON-008', libelle: 'Secrétaire', nombrePersonnels: 2 },
  { id: 9, code: 'FON-009', libelle: 'Magasinier', nombrePersonnels: 3 },
  { id: 10, code: 'FON-010', libelle: 'Agent de production', nombrePersonnels: 6 },
  { id: 11, code: 'FON-011', libelle: 'Contrôleur qualité', nombrePersonnels: 2 },
  { id: 12, code: 'FON-012', libelle: 'Agent de maintenance', nombrePersonnels: 3 },
];

const PAGE_SIZE = 6;

const inputClass =
  'h-[35px] w-full rounded-lg border border-[#e1e5dd] bg-white text-[11px] text-[#34412b] outline-none transition placeholder:text-[#92998c] focus:border-[#82965e] focus:ring-2 focus:ring-[#586f32]/10';

const ICONES_FONCTION = [
  Crown,
  Settings,
  UserRound,
  GraduationCap,
  ChartNoAxesColumnIncreasing,
  Shield,
];

const COULEURS_ICONES = [
  'bg-[#fff5d9] text-[#b58a08]',
  'bg-[#eaf6e7] text-[#47843c]',
  'bg-[#e8f2ff] text-[#3784e8]',
  'bg-[#fff5dd] text-[#a88110]',
  'bg-[#e8f3ff] text-[#3282e6]',
  'bg-[#e9f6e6] text-[#398342]',
];

const COULEURS_EFFECTIFS = [
  'bg-[#eaf7e7] text-[#39833a]',
  'bg-[#e9f3ff] text-[#287de0]',
  'bg-[#f2e8ff] text-[#8546d6]',
  'bg-[#fff5df] text-[#a77b0a]',
];

export default function FunctionsPage() {
  const [fonctions, setFonctions] = useState<Fonction[]>(
    FONCTIONS_INITIALES,
  );

  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [tri, setTri] = useState('code');
  const [ordreCroissant, setOrdreCroissant] = useState(true);

  const [modalOuvert, setModalOuvert] = useState(false);
  const [menuActionId, setMenuActionId] = useState<number | null>(null);
  const [fonctionEnEdition, setFonctionEnEdition] =
    useState<Fonction | null>(null);
  const [confirmationSuppression, setConfirmationSuppression] =
    useState<Fonction | null>(null);

  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [erreur, setErreur] = useState('');
  const [notification, setNotification] = useState('');

  const fonctionsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase('fr');

    const resultat = fonctions.filter(
      (fonction) =>
        fonction.code.toLocaleLowerCase('fr').includes(terme) ||
        fonction.libelle.toLocaleLowerCase('fr').includes(terme),
    );

    resultat.sort((a, b) => {
      let comparaison = 0;

      if (tri === 'code') {
        comparaison = a.code.localeCompare(b.code, 'fr');
      } else if (tri === 'libelle') {
        comparaison = a.libelle.localeCompare(b.libelle, 'fr');
      } else {
        comparaison = a.nombrePersonnels - b.nombrePersonnels;
      }

      return ordreCroissant ? comparaison : -comparaison;
    });

    return resultat;
  }, [fonctions, recherche, tri, ordreCroissant]);

  const nombrePages = Math.max(
    1,
    Math.ceil(fonctionsFiltrees.length / PAGE_SIZE),
  );

  const pageCourante = Math.min(page, nombrePages);

  const fonctionsAffichees = fonctionsFiltrees.slice(
    (pageCourante - 1) * PAGE_SIZE,
    pageCourante * PAGE_SIZE,
  );

  const debut = fonctionsFiltrees.length
    ? (pageCourante - 1) * PAGE_SIZE + 1
    : 0;

  const fin = Math.min(
    pageCourante * PAGE_SIZE,
    fonctionsFiltrees.length,
  );

  const notifier = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(''), 3000);
  };

  const ouvrirAjout = () => {
    setFonctionEnEdition(null);
    setCode('');
    setLibelle('');
    setErreur('');
    setModalOuvert(true);
    setMenuActionId(null);
  };

  const ouvrirEdition = (fonction: Fonction) => {
    setFonctionEnEdition(fonction);
    setCode(fonction.code);
    setLibelle(fonction.libelle);
    setErreur('');
    setModalOuvert(true);
    setMenuActionId(null);
  };

  const enregistrerFonction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const codePropre = code.trim();
    const libellePropre = libelle.trim();

    if (!codePropre || !libellePropre) {
      setErreur('Veuillez remplir le code et le libellé.');
      return;
    }

    const doublonCode = fonctions.some(
      (fonction) =>
        fonction.code.toLowerCase() === codePropre.toLowerCase() &&
        fonction.id !== fonctionEnEdition?.id,
    );

    if (doublonCode) {
      setErreur('Ce code est déjà utilisé.');
      return;
    }

    const doublonLibelle = fonctions.some(
      (fonction) =>
        fonction.libelle.toLowerCase() === libellePropre.toLowerCase() &&
        fonction.id !== fonctionEnEdition?.id,
    );

    if (doublonLibelle) {
      setErreur('Ce libellé existe déjà.');
      return;
    }

    if (fonctionEnEdition) {
      setFonctions((anciennes) =>
        anciennes.map((fonction) =>
          fonction.id === fonctionEnEdition.id
            ? { ...fonction, code: codePropre, libelle: libellePropre }
            : fonction,
        ),
      );

      notifier('La fonction a été modifiée.');
    } else {
      setFonctions((anciennes) => [
        ...anciennes,
        {
          id: Date.now(),
          code: codePropre,
          libelle: libellePropre,
          nombrePersonnels: 0,
        },
      ]);

      notifier('La fonction a été ajoutée.');
      setPage(Math.ceil((fonctionsFiltrees.length + 1) / PAGE_SIZE));
    }

    setModalOuvert(false);
    setCode('');
    setLibelle('');
    setErreur('');
  };

  const supprimerFonction = () => {
    if (!confirmationSuppression) return;

    setFonctions((anciennes) =>
      anciennes.filter(
        (fonction) => fonction.id !== confirmationSuppression.id,
      ),
    );

    setConfirmationSuppression(null);
    setMenuActionId(null);
    setPage(1);
    notifier('La fonction a été supprimée.');
  };

  const reinitialiser = () => {
    setRecherche('');
    setTri('code');
    setOrdreCroissant(true);
    setPage(1);
  };

  const exporterCSV = () => {
    const entetes = ['Code', 'Libellé', 'Nbre personnels'];

    const lignes = fonctionsFiltrees.map((fonction) => [
      fonction.code,
      fonction.libelle,
      fonction.nombrePersonnels,
    ]);

    const contenu = [entetes, ...lignes]
      .map((ligne) =>
        ligne
          .map((valeur) => `"${String(valeur).replace(/"/g, '""')}"`)
          .join(';'),
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + contenu], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');

    lien.href = url;
    lien.download = 'fonctions.csv';
    lien.click();

    URL.revokeObjectURL(url);
    notifier('Export CSV terminé.');
  };

  const actualiser = () => {
    setRecherche('');
    setPage(1);
    setMenuActionId(null);
    notifier('La liste locale a été actualisée.');
  };

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1500px]">

        {/* Carte principale */}
        <section className="overflow-visible rounded-xl border border-[#e8ebe4] bg-white px-4 py-4 shadow-[0_4px_18px_rgba(35,48,25,0.035)] sm:px-5 sm:py-5">

          {/* En-tête compact */}
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#879b58] to-[#536b30] text-white shadow-[0_3px_8px_rgba(74,95,42,0.18)]">
                <Wrench size={22} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-[#17251b] sm:text-[22px]">
                  Fonctions
                </h1>
                <p className="mt-1 text-[11px] leading-4 text-[#7d8577] sm:text-xs">
                  Gérez les fonctions de votre établissement et consultez
                  le nombre de personnels associés à chacune d’elles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={ouvrirAjout}
              className="inline-flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#52692e] px-3.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#435724] focus:outline-none focus:ring-2 focus:ring-[#52692e]/25"
            >
              <Plus size={15} />
              Ajouter une fonction
            </button>
          </div>

          
{/* Barre de tri et actions */}
<div className="mb-4 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">

  {/* Trois filtres indépendants */}
  
{/* Filtres de tri — design premium */}


{/* Filtres de tri — version compacte et élégante */}

{/* Filtres de tri */}
<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:flex xl:flex-none xl:items-center xl:gap-2.5">

  {/* Tri par code */}
  <div className="relative min-w-0 xl:w-[230px] xl:flex-none">
    <div className="pointer-events-none absolute left-2.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-[#69adf5] to-[#347ee0] text-white shadow-sm">
      <ChevronsUpDown size={15} strokeWidth={2.5} />
    </div>

    <select
      aria-label="Trier par code"
      value={tri === 'code' ? (ordreCroissant ? 'asc' : 'desc') : ''}
      onChange={(event) => {
        setTri('code');
        setOrdreCroissant(event.target.value === 'asc');
        setPage(1);
      }}
      className="h-[44px] w-full cursor-pointer appearance-none rounded-[13px] border-2 border-[#cfe2fb] bg-gradient-to-r from-[#f2f8ff] to-[#fbfdff] pl-[58px] pr-10 text-[13px] font-semibold text-[#18365d] outline-none transition-all duration-200 hover:border-[#9fc6f6] focus:ring-2 focus:ring-[#5c9de8]/15"
    >
      <option value="" disabled>Trié par code</option>
      <option value="asc">Trié par code (A → Z)</option>
      <option value="desc">Trié par code (Z → A)</option>
    </select>

    <span className="pointer-events-none absolute bottom-2 left-[47px] top-2 z-10 w-[2px] rounded-full bg-[#c6dcfa]" />
    <span className="pointer-events-none absolute bottom-2 right-[34px] top-2 w-[2px] rounded-full bg-[#dce9fb]" />

    <ChevronDown
      size={16}
      strokeWidth={2.5}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#244b7a]"
    />
  </div>

  {/* Tri par libellé */}
  <div className="relative min-w-0 xl:w-[230px] xl:flex-none">
    <div className="pointer-events-none absolute left-2.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-[#a58af7] to-[#7148d9] text-white shadow-sm">
      <ChevronsUpDown size={15} strokeWidth={2.5} />
    </div>

    <select
      aria-label="Trier par libellé"
      value={tri === 'libelle' ? (ordreCroissant ? 'asc' : 'desc') : ''}
      onChange={(event) => {
        setTri('libelle');
        setOrdreCroissant(event.target.value === 'asc');
        setPage(1);
      }}
      className="h-[44px] w-full cursor-pointer appearance-none rounded-[13px] border-2 border-[#ddcffb] bg-gradient-to-r from-[#f8f4ff] to-[#fdfbff] pl-[58px] pr-10 text-[13px] font-semibold text-[#382568] outline-none transition-all duration-200 hover:border-[#c4aff8] focus:ring-2 focus:ring-[#8c68e8]/15"
    >
      <option value="" disabled>Trié par libellé</option>
      <option value="asc">Trié par libellé (A → Z)</option>
      <option value="desc">Trié par libellé (Z → A)</option>
    </select>

    <span className="pointer-events-none absolute bottom-2 left-[47px] top-2 z-10 w-[2px] rounded-full bg-[#d8c9fa]" />
    <span className="pointer-events-none absolute bottom-2 right-[34px] top-2 w-[2px] rounded-full bg-[#e8defc]" />

    <ChevronDown
      size={16}
      strokeWidth={2.5}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#51378e]"
    />
  </div>

  {/* Tri par effectif */}
  <div className="relative min-w-0 xl:w-[230px] xl:flex-none">
    <div className="pointer-events-none absolute left-2.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-[#8fba7c] to-[#4d7e40] text-white shadow-sm">
      <Users size={15} strokeWidth={2.5} />
    </div>

    <select
      aria-label="Trier par effectif"
      value={tri === 'effectif' ? (ordreCroissant ? 'asc' : 'desc') : ''}
      onChange={(event) => {
        setTri('effectif');
        setOrdreCroissant(event.target.value === 'asc');
        setPage(1);
      }}
      className="h-[44px] w-full cursor-pointer appearance-none rounded-[13px] border-2 border-[#d4e8ce] bg-gradient-to-r from-[#f3faef] to-[#fbfef9] pl-[58px] pr-10 text-[13px] font-semibold text-[#284b2d] outline-none transition-all duration-200 hover:border-[#b6d6ad] focus:ring-2 focus:ring-[#6c9a50]/15"
    >
      <option value="" disabled>Trié par effectif</option>
      <option value="asc">Effectif croissant</option>
      <option value="desc">Effectif décroissant</option>
    </select>

    <span className="pointer-events-none absolute bottom-2 left-[47px] top-2 z-10 w-[2px] rounded-full bg-[#cce2c4]" />
    <span className="pointer-events-none absolute bottom-2 right-[34px] top-2 w-[2px] rounded-full bg-[#dfedda]" />

    <ChevronDown
      size={16}
      strokeWidth={2.5}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#365d37]"
    />
  </div>

</div>



  {/* Séparateur et boutons d'action */}
  <div className="flex items-center gap-2 xl:ml-4 xl:border-l xl:border-[#e7ebe4] xl:pl-4">

    {/* Exporter : orange clair */}
    <button
      type="button"
      onClick={exporterCSV}
      className="inline-flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#ffdbb8] bg-[#fff4e9] px-4 text-[12px] font-semibold text-[#b45309] transition hover:border-[#ffc78f] hover:bg-[#ffead5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 sm:flex-none sm:min-w-[170px]"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe5cc] text-[#c45a0b]">
        <Download size={15} />
      </span>
      Exporter
    </button>

    {/* Actualiser : vert très clair */}
    <button
      type="button"
      onClick={actualiser}
      className="inline-flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#dcebd2] bg-[#f3f9ee] px-4 text-[12px] font-semibold text-[#39743a] transition hover:border-[#c5dfb7] hover:bg-[#eaf5e2] focus:outline-none focus:ring-2 focus:ring-[#6c9a50]/20 sm:flex-none sm:min-w-[170px]"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e4f5d9] text-[#37813a]">
        <RotateCcw size={15} />
      </span>
      Actualiser
    </button>
  </div>
</div>


{/* Tableau des fonctions */}
<div className="overflow-x-auto rounded-xl border border-[#e7ebe3] bg-white">
  <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
    <colgroup>
      <col className="w-[6%]" />
      <col className="w-[23%]" />
      <col className="w-[27%]" />
      <col className="w-[20%]" />
      <col className="w-[12%]" />
      <col className="w-[12%]" />
    </colgroup>

    <thead>
      <tr className="h-[44px] border-b border-[#e7ebe3] bg-gradient-to-r from-[#f5f7f1] to-[#fafbf8]">
        <th className="px-2 text-center text-[11px] font-bold uppercase tracking-wide text-[#65715b]">
          #
        </th>

        <th className="border-l border-[#e9ede5] px-4 text-[11px] font-bold uppercase tracking-wide text-[#485342]">
          <button
            type="button"
            onClick={() => {
              if (tri === 'code') {
                setOrdreCroissant(!ordreCroissant);
              } else {
                setTri('code');
                setOrdreCroissant(true);
              }
              setPage(1);
            }}
            className="inline-flex items-center gap-2 transition hover:text-[#526b32]"
          >
            Code
            <ChevronsUpDown size={13} className="text-[#8c9583]" />
          </button>
        </th>

        <th className="border-l border-[#e9ede5] px-4 text-[11px] font-bold uppercase tracking-wide text-[#485342]">
          <button
            type="button"
            onClick={() => {
              if (tri === 'libelle') {
                setOrdreCroissant(!ordreCroissant);
              } else {
                setTri('libelle');
                setOrdreCroissant(true);
              }
              setPage(1);
            }}
            className="inline-flex items-center gap-2 transition hover:text-[#526b32]"
          >
            Libellé
            <ChevronsUpDown size={13} className="text-[#8c9583]" />
          </button>
        </th>

        <th className="border-l border-[#e9ede5] px-3 text-center text-[11px] font-bold uppercase tracking-wide text-[#485342]">
          <button
            type="button"
            onClick={() => {
              if (tri === 'effectif') {
                setOrdreCroissant(!ordreCroissant);
              } else {
                setTri('effectif');
                setOrdreCroissant(true);
              }
              setPage(1);
            }}
            className="inline-flex items-center gap-1.5 transition hover:text-[#526b32]"
          >
            Nbre personnels
            <ChevronsUpDown size={13} className="text-[#8c9583]" />
          </button>
        </th>

        <th className="border-l border-[#e9ede5] px-2 text-center text-[10px] font-bold uppercase tracking-wide text-[#39743a]">
          Modifier
        </th>

        <th className="border-l border-[#e9ede5] px-2 text-center text-[10px] font-bold uppercase tracking-wide text-[#c24141]">
          Supprimer
        </th>
      </tr>
    </thead>

    <tbody>
      {fonctionsAffichees.map((fonction, index) => {
        const Icone =
          ICONES_FONCTION[
            (fonction.id - 1) % ICONES_FONCTION.length
          ];

        const couleurIcone =
          COULEURS_ICONES[
            (fonction.id - 1) % COULEURS_ICONES.length
          ];

        const couleurEffectif =
          COULEURS_EFFECTIFS[
            (fonction.id - 1) % COULEURS_EFFECTIFS.length
          ];

        return (
          <tr
            key={fonction.id}
            className="group h-[54px] border-b border-[#edf0e9] transition-colors duration-150 last:border-b-0 hover:bg-[#fafcf7]"
          >
            {/* Numéro */}
            <td className="px-2 text-center text-[11px] font-medium tabular-nums text-[#899182]">
              {(pageCourante - 1) * PAGE_SIZE + index + 1}
            </td>

            {/* Code */}
            <td className="border-l border-[#f0f2ed] px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${couleurIcone}`}
                >
                  <Icone size={15} strokeWidth={2} />
                </div>

                <span className="truncate text-[12px] font-bold tracking-wide text-[#34412e]">
                  {fonction.code}
                </span>
              </div>
            </td>

            {/* Libellé */}
            <td className="border-l border-[#f0f2ed] px-4">
              <span className="block truncate text-[12px] font-medium text-[#475343]">
                {fonction.libelle}
              </span>
            </td>

            {/* Effectif */}
            <td className="border-l border-[#f0f2ed] px-3 text-center">
              <span
                className={`inline-flex min-w-[62px] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 ${couleurEffectif}`}
              >
                <Users size={13} strokeWidth={2} />
                <span className="text-[11px] font-bold tabular-nums">
                  {fonction.nombrePersonnels}
                </span>
              </span>
            </td>

            {/* Action Modifier */}
            <td className="border-l border-[#f0f2ed] px-2 text-center">
              <button
                type="button"
                aria-label={`Modifier ${fonction.libelle}`}
                title={`Modifier ${fonction.libelle}`}
                onClick={() => ouvrirEdition(fonction)}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#d8ead1] bg-[#f0f8eb] px-2.5 text-[11px] font-semibold text-[#39743a] transition-all duration-200 hover:border-[#b9d8ac] hover:bg-[#e3f2dc] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6c9a50]/20"
              >
                <Pencil size={13} strokeWidth={2} />
                <span>Modifier</span>
              </button>
            </td>

            {/* Action Supprimer */}
            <td className="border-l border-[#f0f2ed] px-2 text-center">
              <button
                type="button"
                aria-label={`Supprimer ${fonction.libelle}`}
                title={`Supprimer ${fonction.libelle}`}
                onClick={() => {
                  setConfirmationSuppression(fonction);
                  setMenuActionId(null);
                }}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#f5d6d6] bg-[#fff4f4] px-2.5 text-[11px] font-semibold text-[#c24141] transition-all duration-200 hover:border-[#efb8b8] hover:bg-[#ffe8e8] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <Trash2 size={13} strokeWidth={2} />
                <span>Supprimer</span>
              </button>
            </td>
          </tr>
        );
      })}

      {/* Aucun résultat */}
      {fonctionsAffichees.length === 0 && (
        <tr>
          <td colSpan={6} className="px-4 py-14 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f6ee] text-[#849176]">
                <Search size={20} />
              </div>

              <p className="text-[13px] font-semibold text-[#46513e]">
                Aucune fonction trouvée
              </p>

              <p className="text-[11px] text-[#92998c]">
                Essayez un autre code ou libellé.
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


          {/* Pied et pagination */}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-[#e8ecdf] bg-[#f8faf5] px-3 py-2 text-[11px] font-medium tracking-[0.01em] text-[#78816e]">
  Affichage de
  <span className="font-bold tabular-nums text-[#526b32]">
    {debut}
  </span>
  <span>à</span>
  <span className="font-bold tabular-nums text-[#526b32]">
    {fin}
  </span>
  <span>sur</span>
  <span className="rounded-md bg-[#e8f0df] px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#435a29]">
    {fonctionsFiltrees.length}
  </span>
  <span>fonction(s)</span>
</p>

            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                disabled={pageCourante === 1}
                onClick={() => setPage((precedente) => precedente - 1)}
                aria-label="Page précédente"
                className="flex h-[29px] w-[29px] items-center justify-center rounded-lg border border-[#e2e6de] bg-white text-[#59644f] transition hover:bg-[#f4f6f0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: nombrePages }, (_, index) => index + 1)
                .filter(
                  (numero) =>
                    numero === 1 ||
                    numero === nombrePages ||
                    Math.abs(numero - pageCourante) <= 1,
                )
                .map((numero, index, numeros) => (
                  <span key={numero} className="contents">
                    {index > 0 && numero - numeros[index - 1] > 1 && (
                      <span className="px-0.5 text-[10px] text-[#92998b]">
                        …
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPage(numero)}
                      aria-current={
                        numero === pageCourante ? 'page' : undefined
                      }
                      className={`flex h-[29px] min-w-[29px] items-center justify-center rounded-lg border px-2 text-[10px] font-semibold transition ${
                        numero === pageCourante
                          ? 'border-[#52692e] bg-[#52692e] text-white shadow-sm'
                          : 'border-[#e2e6de] bg-white text-[#56614c] hover:bg-[#f3f6ed]'
                      }`}
                    >
                      {numero}
                    </button>
                  </span>
                ))}

              <button
                type="button"
                disabled={pageCourante === nombrePages}
                onClick={() => setPage((precedente) => precedente + 1)}
                aria-label="Page suivante"
                className="flex h-[29px] w-[29px] items-center justify-center rounded-lg border border-[#e2e6de] bg-white text-[#59644f] transition hover:bg-[#f4f6f0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal ajout / modification */}
      {modalOuvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172012]/40 p-4 backdrop-blur-[2px]"
          onClick={() => setModalOuvert(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-fonction-modal"
            className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#e7ebe2] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4">
              <div>
                <h2
                  id="titre-fonction-modal"
                  className="text-base font-bold text-[#26351e]"
                >
                  {fonctionEnEdition
                    ? 'Modifier la fonction'
                    : 'Ajouter une fonction'}
                </h2>
                <p className="mt-1 text-[11px] text-[#899181]">
                  Complétez les informations ci-dessous.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOuvert(false)}
                aria-label="Fermer"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7d8674] hover:bg-[#f2f4ee]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={enregistrerFonction} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="fonction-code"
                  className="mb-1.5 block text-[11px] font-semibold text-[#485440]"
                >
                  Code <span className="text-red-500">*</span>
                </label>

                <input
                  id="fonction-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Ex. FON-013"
                  className={`${inputClass} px-3`}
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="fonction-libelle"
                  className="mb-1.5 block text-[11px] font-semibold text-[#485440]"
                >
                  Libellé <span className="text-red-500">*</span>
                </label>

                <input
                  id="fonction-libelle"
                  value={libelle}
                  onChange={(event) => setLibelle(event.target.value)}
                  placeholder="Ex. Gestionnaire"
                  className={`${inputClass} px-3`}
                />
              </div>

              {erreur && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700"
                >
                  {erreur}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOuvert(false)}
                  className="h-9 rounded-lg border border-[#e1e5dd] px-3.5 text-[11px] font-semibold text-[#58614f] hover:bg-[#f7f8f4]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#52692e] px-3.5 text-[11px] font-semibold text-white hover:bg-[#435724]"
                >
                  <Check size={14} />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {confirmationSuppression && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#172012]/40 p-4 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-suppression"
            className="w-full max-w-[360px] rounded-2xl border border-[#e7ebe2] bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <X size={19} />
            </div>

            <h2
              id="titre-suppression"
              className="text-sm font-bold text-[#26351e]"
            >
              Supprimer cette fonction ?
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#7b8474]">
              Voulez-vous supprimer « {confirmationSuppression.libelle} » ?
              Cette action ne pourra pas être annulée.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmationSuppression(null)}
                className="h-9 rounded-lg border border-[#e1e5dd] px-3 text-[11px] font-semibold text-[#58614f] hover:bg-[#f7f8f4]"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={supprimerFonction}
                className="h-9 rounded-lg bg-red-600 px-3 text-[11px] font-semibold text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-xl border border-[#dfe7d5] bg-white px-4 py-3 text-xs font-semibold text-[#3f552b] shadow-lg"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf4e2]">
            <Check size={14} />
          </span>
          {notification}
          <button
            type="button"
            onClick={() => setNotification('')}
            aria-label="Fermer la notification"
            className="ml-1 text-[#8a9380] hover:text-[#435724]"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

function SlidersUpIcon() {
  return (
    <SlidersHorizontal
      size={13}
      className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-[#657451]"
    />
  );
}

