
import { useMemo, useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Download,
  RefreshCw,
  Users,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronsUpDown,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

type Departement = {
  id: number;
  code: string;
  libelle: string;
  nombrePersonnels: number;
};

const DEPARTEMENTS_INITIAUX: Departement[] = [
  { id: 1, code: 'DEP-001', libelle: 'Administration', nombrePersonnels: 6 },
  { id: 2, code: 'DEP-002', libelle: 'Production', nombrePersonnels: 8 },
  { id: 3, code: 'DEP-003', libelle: 'Commercial', nombrePersonnels: 5 },
  { id: 4, code: 'DEP-004', libelle: 'Finances', nombrePersonnels: 4 },
  { id: 5, code: 'DEP-005', libelle: 'Technique', nombrePersonnels: 3 },
  { id: 6, code: 'DEP-006', libelle: 'Ressources humaines', nombrePersonnels: 2 },
  { id: 7, code: 'DEP-007', libelle: 'Logistique', nombrePersonnels: 7 },
  { id: 8, code: 'DEP-008', libelle: 'Maintenance', nombrePersonnels: 4 },
  { id: 9, code: 'DEP-009', libelle: 'Qualité', nombrePersonnels: 3 },
  { id: 10, code: 'DEP-010', libelle: 'Informatique', nombrePersonnels: 2 },
  { id: 11, code: 'DEP-011', libelle: 'Achats', nombrePersonnels: 3 },
  { id: 12, code: 'DEP-012', libelle: 'Stock', nombrePersonnels: 5 },
];

const PAGE_SIZE = 6;

const inputClass =
  'h-10 w-full rounded-lg border border-[#e1e7dc] bg-white px-3 text-[12px] text-[#34412e] outline-none transition placeholder:text-[#9aa392] hover:border-[#c5d1ba] focus:border-[#829b63] focus:ring-2 focus:ring-[#526b32]/10';

export default function DepartementsPage() {
  const [departements, setDepartements] = useState<Departement[]>(
    DEPARTEMENTS_INITIAUX,
  );

  const [recherche, setRecherche] = useState('');
  const [tri, setTri] = useState<'code' | 'libelle' | 'effectif'>('code');
  const [ordreCroissant, setOrdreCroissant] = useState(true);
  const [page, setPage] = useState(1);

  const [modalOuverte, setModalOuverte] = useState(false);
  const [departementEdite, setDepartementEdite] =
    useState<Departement | null>(null);

  const [confirmationSuppression, setConfirmationSuppression] =
    useState<Departement | null>(null);

  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [nombrePersonnels, setNombrePersonnels] = useState('0');
  const [erreur, setErreur] = useState('');

  const departementsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    return [...departements]
      .filter(
        (departement) =>
          departement.code.toLowerCase().includes(terme) ||
          departement.libelle.toLowerCase().includes(terme),
      )
      .sort((a, b) => {
        let comparaison = 0;

        if (tri === 'code') {
          comparaison = a.code.localeCompare(b.code, 'fr', {
            numeric: true,
          });
        } else if (tri === 'libelle') {
          comparaison = a.libelle.localeCompare(b.libelle, 'fr');
        } else {
          comparaison = a.nombrePersonnels - b.nombrePersonnels;
        }

        return ordreCroissant ? comparaison : -comparaison;
      });
  }, [departements, recherche, tri, ordreCroissant]);

  const nombrePages = Math.max(
    1,
    Math.ceil(departementsFiltres.length / PAGE_SIZE),
  );

  const pageCourante = Math.min(page, nombrePages);

  const departementsAffiches = departementsFiltres.slice(
    (pageCourante - 1) * PAGE_SIZE,
    pageCourante * PAGE_SIZE,
  );

  const debut =
    departementsFiltres.length === 0
      ? 0
      : (pageCourante - 1) * PAGE_SIZE + 1;

  const fin = Math.min(
    pageCourante * PAGE_SIZE,
    departementsFiltres.length,
  );

  const totalPersonnels = departements.reduce(
    (total, departement) => total + departement.nombrePersonnels,
    0,
  );

  const ouvrirAjout = () => {
    setDepartementEdite(null);
    setCode('');
    setLibelle('');
    setNombrePersonnels('0');
    setErreur('');
    setModalOuverte(true);
  };

  const ouvrirEdition = (departement: Departement) => {
    setDepartementEdite(departement);
    setCode(departement.code);
    setLibelle(departement.libelle);
    setNombrePersonnels(String(departement.nombrePersonnels));
    setErreur('');
    setModalOuverte(true);
  };

  const enregistrerDepartement = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const codeNettoye = code.trim().toUpperCase();
    const libelleNettoye = libelle.trim();
    const effectif = Number(nombrePersonnels);

    if (!codeNettoye || !libelleNettoye) {
      setErreur('Veuillez renseigner le code et le libellé.');
      return;
    }

    if (!Number.isInteger(effectif) || effectif < 0) {
      setErreur('Le nombre de personnels doit être un entier positif ou nul.');
      return;
    }

    const codeExiste = departements.some(
      (departement) =>
        departement.code.toLowerCase() === codeNettoye.toLowerCase() &&
        departement.id !== departementEdite?.id,
    );

    if (codeExiste) {
      setErreur('Ce code existe déjà. Veuillez en choisir un autre.');
      return;
    }

    if (departementEdite) {
      setDepartements((anciens) =>
        anciens.map((departement) =>
          departement.id === departementEdite.id
            ? {
                ...departement,
                code: codeNettoye,
                libelle: libelleNettoye,
                nombrePersonnels: effectif,
              }
            : departement,
        ),
      );
    } else {
      const nouvelId =
        Math.max(0, ...departements.map((departement) => departement.id)) + 1;

      setDepartements((anciens) => [
        ...anciens,
        {
          id: nouvelId,
          code: codeNettoye,
          libelle: libelleNettoye,
          nombrePersonnels: effectif,
        },
      ]);

      setPage(Math.ceil((departementsFiltres.length + 1) / PAGE_SIZE));
    }

    setModalOuverte(false);
    setErreur('');
  };

  const supprimerDepartement = () => {
    if (!confirmationSuppression) return;

    setDepartements((anciens) =>
      anciens.filter(
        (departement) =>
          departement.id !== confirmationSuppression.id,
      ),
    );

    setConfirmationSuppression(null);
    setPage((anciennePage) => Math.min(anciennePage, nombrePages));
  };

  const actualiser = () => {
    setRecherche('');
    setTri('code');
    setOrdreCroissant(true);
    setPage(1);
  };

  const exporterCSV = () => {
    const lignes = [
      ['Code', 'Libellé', 'Nombre de personnels'],
      ...departementsFiltres.map((departement) => [
        departement.code,
        departement.libelle,
        String(departement.nombrePersonnels),
      ]),
    ];

    const contenu =
      '\uFEFF' +
      lignes
        .map((ligne) =>
          ligne
            .map((valeur) => `"${valeur.replace(/"/g, '""')}"`)
            .join(';'),
        )
        .join('\r\n');

    const fichier = new Blob([contenu], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(fichier);
    const lien = document.createElement('a');

    lien.href = url;
    lien.download = 'departements.csv';
    lien.click();

    URL.revokeObjectURL(url);
  };

  const choisirTri = (nouveauTri: typeof tri) => {
    if (tri === nouveauTri) {
      setOrdreCroissant((ancien) => !ancien);
    } else {
      setTri(nouveauTri);
      setOrdreCroissant(true);
    }

    setPage(1);
  };

  return (
    <div className="min-h-screen p-3 text-[#263522] sm:p-5">
      <div className="mx-auto max-w-[1600px] space-y-4">

        {/* En-tête */}
        {/* En-tête et statistiques — section unifiée */}
<section className="overflow-hidden rounded-2xl border border-[#e5eadf] bg-gradient-to-br from-white via-white to-[#f8faf5] shadow-[0_4px_18px_rgba(36,54,26,0.04)]">

  {/* En-tête */}
  <div className="flex flex-col justify-between gap-4 border-b border-[#edf0e8] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
    <div className="flex min-w-0 items-center gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#91a85e] to-[#526b32] text-white shadow-md shadow-[#526b32]/15">
        <Building2 size={22} strokeWidth={1.9} />
      </div>

      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-[#26351f] sm:text-2xl">
          Départements
        </h1>
        <p className="mt-1 text-[11px] leading-5 text-[#7b8573] sm:text-xs">
          Gérez les départements et consultez leurs effectifs.
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={ouvrirAjout}
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#526b32] px-4 text-[11px] font-semibold text-white shadow-sm transition duration-200 hover:bg-[#435927] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#526b32]/25"
    >
      <Plus size={16} strokeWidth={2.2} />
      Ajouter un département
    </button>
  </div>

  {/* Statistiques intégrées dans la même section */}
  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:p-5">

    {/* Total des départements */}
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#e8ede3] bg-white/90 px-4 py-3 transition duration-200 hover:border-[#d5e2c9] hover:shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5e7] text-[#527b36] transition-transform duration-200 group-hover:scale-105">
        <Building2 size={19} strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight tracking-tight text-[#273923] tabular-nums">
          {departements.length}
        </p>
        <p className="mt-1 text-[10px] font-medium text-[#818a79] sm:text-[11px]">
          Départements au total
        </p>
      </div>
    </div>

    {/* Personnels affectés */}
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#e4ebf6] bg-white/90 px-4 py-3 transition duration-200 hover:border-[#cddcf1] hover:shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#3975c5] transition-transform duration-200 group-hover:scale-105">
        <Users size={19} strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight tracking-tight text-[#273923] tabular-nums">
          {totalPersonnels}
        </p>
        <p className="mt-1 text-[10px] font-medium text-[#818a79] sm:text-[11px]">
          Personnels affectés
        </p>
      </div>
    </div>

    {/* Départements affichés */}
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#e9e4f7] bg-white/90 px-4 py-3 transition duration-200 hover:border-[#d9cff0] hover:shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#7860c7] transition-transform duration-200 group-hover:scale-105">
        <SlidersHorizontal size={19} strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight tracking-tight text-[#273923] tabular-nums">
          {departementsFiltres.length}
        </p>
        <p className="mt-1 text-[10px] font-medium text-[#818a79] sm:text-[11px]">
          Départements affichés
        </p>
      </div>
    </div>

  </div>
</section>

        {/* Organisation des départements */}
<section className="rounded-xl border border-[#e7ebe2] bg-gradient-to-r from-white via-[#fdfefb] to-[#f8faf5] p-3.5 shadow-sm shadow-[#263522]/[0.03]">
  {/* En-tête */}
  <div className="mb-3 flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf4e5] text-[#526f35]">
      <Building2 size={19} strokeWidth={2} />
    </div>

    <div className="min-w-0">
      <h2 className="text-[13px] font-bold tracking-[-0.2px] text-[#34412e]">
        Organisation des départements
      </h2>
      <p className="mt-0.5 text-[10px] text-[#899382]">
        Triez les départements selon vos besoins.
      </p>
    </div>
  </div>

  {/* Filtres et actions */}
  <div className="grid grid-cols-1 items-center gap-4.5 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-nowrap">

    {/* Trier par code */}
    <div className="group relative min-w-0 xl:w-[260px] xl:shrink-0">
      <div className="pointer-events-none absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-gradient-to-br from-[#62a7f5] to-[#347ee0] text-white shadow-sm">
        <ChevronsUpDown size={15} strokeWidth={2.4} />
      </div>

      <select
        aria-label="Trier par code"
        value={
          tri === 'code'
            ? ordreCroissant
              ? 'asc'
              : 'desc'
            : ''
        }
        onChange={(event) => {
          setTri('code');
          setOrdreCroissant(event.target.value === 'asc');
          setPage(1);
        }}
        className="h-[42px] w-full cursor-pointer appearance-none rounded-[11px] border border-[#cfe1ff] bg-gradient-to-r from-[#f3f8ff] to-white pl-[48px] pr-9 text-[11px] font-semibold text-[#294c7c] outline-none transition-all hover:border-[#94bdf8] hover:shadow-sm focus:border-[#7ca8ed] focus:ring-2 focus:ring-[#5b9ae8]/10"
      >
        <option value="" disabled>
          Trier par code
        </option>
        <option value="asc">Code croissant (A → Z)</option>
        <option value="desc">Code décroissant (Z → A)</option>
      </select>

      <span className="pointer-events-none absolute bottom-2.5 left-[40px] top-2.5 w-px bg-[#d4e4ff]" />

      <ChevronDown
        size={14}
        strokeWidth={2.2}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#49658c] transition-transform group-hover:text-[#2868b0]"
      />
    </div>

    {/* Trier par libellé */}
    <div className="group relative min-w-0 xl:w-[250px] xl:shrink-0">
      <div className="pointer-events-none absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-gradient-to-br from-[#a184f4] to-[#7951dc] text-white shadow-sm">
        <ChevronsUpDown size={15} strokeWidth={2.4} />
      </div>

      <select
        aria-label="Trier par libellé"
        value={
          tri === 'libelle'
            ? ordreCroissant
              ? 'asc'
              : 'desc'
            : ''
        }
        onChange={(event) => {
          setTri('libelle');
          setOrdreCroissant(event.target.value === 'asc');
          setPage(1);
        }}
        className="h-[42px] w-full cursor-pointer appearance-none rounded-[11px] border border-[#e0d2ff] bg-gradient-to-r from-[#faf7ff] to-white pl-[48px] pr-9 text-[11px] font-semibold text-[#574080] outline-none transition-all hover:border-[#c1aafa] hover:shadow-sm focus:border-[#a184e8] focus:ring-2 focus:ring-[#9770e7]/10"
      >
        <option value="" disabled>
          Trier par libellé
        </option>
        <option value="asc">Libellé (A → Z)</option>
        <option value="desc">Libellé (Z → A)</option>
      </select>

      <span className="pointer-events-none absolute bottom-2.5 left-[40px] top-2.5 w-px bg-[#e5d9ff]" />

      <ChevronDown
        size={14}
        strokeWidth={2.2}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#68518e] transition-transform group-hover:text-[#7951dc]"
      />
    </div>

    {/* Trier par effectif */}
    <div className="group relative min-w-0 xl:w-[250px] xl:shrink-0">
      <div className="pointer-events-none absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-gradient-to-br from-[#8eb87a] to-[#568448] text-white shadow-sm">
        <Users size={15} strokeWidth={2.3} />
      </div>

      <select
        aria-label="Trier par effectif"
        value={
          tri === 'effectif'
            ? ordreCroissant
              ? 'asc'
              : 'desc'
            : ''
        }
        onChange={(event) => {
          setTri('effectif');
          setOrdreCroissant(event.target.value === 'asc');
          setPage(1);
        }}
        className="h-[42px] w-full cursor-pointer appearance-none rounded-[11px] border border-[#d5e8ce] bg-gradient-to-r from-[#f5faef] to-white pl-[48px] pr-9 text-[11px] font-semibold text-[#355c36] outline-none transition-all hover:border-[#b8d8ad] hover:shadow-sm focus:border-[#83ae71] focus:ring-2 focus:ring-[#77a65e]/10"
      >
        <option value="" disabled>
          Trier par effectif
        </option>
        <option value="asc">Effectif croissant</option>
        <option value="desc">Effectif décroissant</option>
      </select>

      <span className="pointer-events-none absolute bottom-2.5 left-[40px] top-2.5 w-px bg-[#d7e9d0]" />

      <ChevronDown
        size={14}
        strokeWidth={2.2}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#426b41] transition-transform group-hover:text-[#34753b]"
      />
    </div>

    {/* Séparateur */}
    {/* Séparateur */}
<div className="hidden h-8 w-px shrink-0 bg-[#e8ece4] xl:block" />

{/* Exporter */}
<button
  type="button"
  onClick={exporterCSV}
  className="inline-flex h-[40px] w-full min-w-0 items-center justify-center gap-3 rounded-[10px] border border-[#ffdfc2] bg-[#fff4e9] px-2.5 text-[11px] font-semibold text-[#b95a16] transition-all hover:border-[#ffc995] hover:bg-[#ffead8] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/15 sm:w-auto xl:w-[115px] xl:shrink-0"
>
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffe5ce] text-[#c45d16]">
    <Download size={14} strokeWidth={2.2} />
  </span>
  Exporter
</button>

{/* Actualiser */}
<button
  type="button"
  onClick={actualiser}
  className="inline-flex h-[40px] w-full min-w-0 items-center justify-center gap-1.5 rounded-[10px] border border-[#dcebd2] bg-[#f2f8ed] px-2.5 text-[11px] font-semibold text-[#39733c] transition-all hover:border-[#c5dfb9] hover:bg-[#e7f3df] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6c9a50]/15 sm:w-auto xl:w-[125px] xl:shrink-0"
>
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e2f1d9] text-[#438044]">
    <RefreshCw size={13} strokeWidth={2.2} />
  </span>
  Actualiser
</button>
  </div>
</section>
        {/* Tableau */}
        <section className="overflow-hidden rounded-xl border border-[#e6ebe1] bg-white shadow-[0_3px_12px_rgba(36,54,26,0.035)]">
          <div className="flex flex-col justify-between gap-3 border-b border-[#edf0e9] px-4 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f5e9] text-[#526b32]">
                <Building2 size={17} />
              </div>
              <div>
                <h2 className="text-[13px] font-bold text-[#34412e]">
                  Liste des départements
                </h2>
                <p className="mt-0.5 text-[11px] text-[#8a9382]">
                  Consultez et gérez les départements de votre établissement.
                </p>
              </div>
            </div>

            
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[6%]" />
                <col className="w-[23%]" />
                <col className="w-[27%]" />
                <col className="w-[20%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
              </colgroup>

              <thead>
                <tr className="h-11 bg-[#f6f8f3]">
                  <th className="px-2 text-center text-[10px] font-bold uppercase tracking-wide text-[#75806b]">
                    #
                  </th>

                  <th className="border-l border-[#e9ede5] px-4 text-[10px] font-bold uppercase tracking-wide text-[#56614d]">
                    <button
                      type="button"
                      onClick={() => choisirTri('code')}
                      className="inline-flex items-center gap-1.5 hover:text-[#526b32]"
                    >
                      Code
                      <SlidersHorizontal size={12} />
                    </button>
                  </th>

                  <th className="border-l border-[#e9ede5] px-4 text-[10px] font-bold uppercase tracking-wide text-[#56614d]">
                    <button
                      type="button"
                      onClick={() => choisirTri('libelle')}
                      className="inline-flex items-center gap-1.5 hover:text-[#526b32]"
                    >
                      Libellé
                      <SlidersHorizontal size={12} />
                    </button>
                  </th>

                  <th className="border-l border-[#e9ede5] px-2 text-center text-[10px] font-bold uppercase tracking-wide text-[#56614d]">
                    <button
                      type="button"
                      onClick={() => choisirTri('effectif')}
                      className="inline-flex items-center gap-1.5 hover:text-[#526b32]"
                    >
                      Nbre personnels
                      <SlidersHorizontal size={12} />
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
                {departementsAffiches.map((departement, index) => (
                  <tr
                    key={departement.id}
                    className="h-[58px] border-b border-[#edf0e9] transition-colors last:border-b-0 hover:bg-[#fafcf7]"
                  >
                    <td className="px-2 text-center text-[11px] font-medium tabular-nums text-[#91998a]">
                      {(pageCourante - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="border-l border-[#f0f2ed] px-4">
                      <span className="inline-flex items-center rounded-md border border-[#e5eadf] bg-[#f7f9f4] px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-[#455635]">
                        {departement.code}
                      </span>
                    </td>

                    <td className="border-l border-[#f0f2ed] px-4">
                      <span className="block truncate text-[12px] font-semibold text-[#35412f]">
                        {departement.libelle}
                      </span>
                    </td>

                    <td className="border-l border-[#f0f2ed] px-2 text-center">
                      <span className="inline-flex min-w-[64px] items-center justify-center gap-1.5 rounded-full border border-[#dcebd3] bg-[#f0f7e9] px-3 py-1.5 text-[#49743a]">
                        <Users size={13} />
                        <span className="text-[11px] font-bold tabular-nums">
                          {departement.nombrePersonnels}
                        </span>
                      </span>
                    </td>

                    <td className="border-l border-[#f0f2ed] px-2 text-center">
                      <button
                        type="button"
                        onClick={() => ouvrirEdition(departement)}
                        aria-label={`Modifier ${departement.libelle}`}
                        title={`Modifier ${departement.libelle}`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#d8ead1] bg-[#f0f8eb] px-2.5 text-[11px] font-semibold text-[#39743a] transition hover:border-[#b9d8ac] hover:bg-[#e3f2dc] focus:outline-none focus:ring-2 focus:ring-[#6c9a50]/20"
                      >
                        <Pencil size={13} />
                        <span>Modifier</span>
                      </button>
                    </td>

                    <td className="border-l border-[#f0f2ed] px-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmationSuppression(departement)
                        }
                        aria-label={`Supprimer ${departement.libelle}`}
                        title={`Supprimer ${departement.libelle}`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#f5d6d6] bg-[#fff4f4] px-2.5 text-[11px] font-semibold text-[#c24141] transition hover:border-[#efb8b8] hover:bg-[#ffe8e8] focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <Trash2 size={13} />
                        <span>Supprimer</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {departementsAffiches.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0f5e9] text-[#829071]">
                          <Search size={20} />
                        </div>
                        <p className="text-[13px] font-semibold text-[#46513e]">
                          Aucun département trouvé
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

          {/* Pied du tableau et pagination */}
          <div className="flex flex-col justify-between gap-3 border-t border-[#edf0e9] px-4 py-3 sm:flex-row sm:items-center">
            {/* Indicateur de pagination */}
<div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#e5ecde] bg-gradient-to-r from-[#f7faf3] to-white px-4 py-2.5 shadow-sm shadow-[#526b32]/[0.04]">
  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8f0df] text-[#526b32]">
    <Users size={14} strokeWidth={2} />
  </span>

  <p className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-[#66715e]">
    <span>Affichage</span>

    <span className="inline-flex min-w-[26px] items-center justify-center rounded-md bg-white px-2 py-0.5 font-bold tabular-nums text-[#526b32] ring-1 ring-[#e2e9d9]">
      {debut}
    </span>

    <span className="text-[#a0a895]">à</span>

    <span className="inline-flex min-w-[26px] items-center justify-center rounded-md bg-white px-2 py-0.5 font-bold tabular-nums text-[#526b32] ring-1 ring-[#e2e9d9]">
      {fin}
    </span>

    <span className="text-[#a0a895]">sur</span>

    <span className="inline-flex min-w-[30px] items-center justify-center rounded-md bg-[#eaf3e2] px-2 py-0.5 font-bold tabular-nums text-[#405b2b]">
      {departementsFiltres.length}
    </span>

    <span className="font-medium text-[#52614a]">
      département{departementsFiltres.length > 1 ? 's' : ''}
    </span>
  </p>
</div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Page précédente"
                disabled={pageCourante <= 1}
                onClick={() => setPage((ancienne) => Math.max(1, ancienne - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e7dc] bg-white text-[#66735b] transition hover:bg-[#f3f6ed] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: nombrePages }, (_, index) => index + 1).map(
                (numero) => (
                  <button
                    key={numero}
                    type="button"
                    onClick={() => setPage(numero)}
                    aria-current={pageCourante === numero ? 'page' : undefined}
                    className={`h-8 min-w-8 rounded-lg px-2 text-[11px] font-semibold transition ${
                      pageCourante === numero
                        ? 'bg-[#526b32] text-white shadow-sm'
                        : 'border border-[#e2e7dc] bg-white text-[#64715a] hover:bg-[#f3f6ed]'
                    }`}
                  >
                    {numero}
                  </button>
                ),
              )}

              <button
                type="button"
                aria-label="Page suivante"
                disabled={pageCourante >= nombrePages}
                onClick={() =>
                  setPage((ancienne) => Math.min(nombrePages, ancienne + 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e7dc] bg-white text-[#66735b] transition hover:bg-[#f3f6ed] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal Ajouter / Modifier */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#172113]/40 p-4 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOuverte(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="departement-modal-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e7ebe2] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#edf0e9] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5e7] text-[#526b32]">
                  {departementEdite ? (
                    <Pencil size={18} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
                <div>
                  <h2
                    id="departement-modal-title"
                    className="text-base font-bold text-[#2d3b27]"
                  >
                    {departementEdite
                      ? 'Modifier le département'
                      : 'Nouveau département'}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-[#899180]">
                    Renseignez les informations ci-dessous.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOuverte(false)}
                aria-label="Fermer"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7c8574] transition hover:bg-[#f3f5ef] hover:text-[#34412e]"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={enregistrerDepartement} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="departement-code"
                  className="mb-1.5 block text-[12px] font-semibold text-[#46513e]"
                >
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="departement-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Ex. : DEP-013"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="departement-libelle"
                  className="mb-1.5 block text-[12px] font-semibold text-[#46513e]"
                >
                  Libellé <span className="text-red-500">*</span>
                </label>
                <input
                  id="departement-libelle"
                  value={libelle}
                  onChange={(event) => setLibelle(event.target.value)}
                  placeholder="Ex. : Administration"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="departement-effectif"
                  className="mb-1.5 block text-[12px] font-semibold text-[#46513e]"
                >
                  Nombre de personnels
                </label>
                <input
                  id="departement-effectif"
                  type="number"
                  min="0"
                  step="1"
                  value={nombrePersonnels}
                  onChange={(event) =>
                    setNombrePersonnels(event.target.value)
                  }
                  className={inputClass}
                  required
                />
              </div>

              {erreur && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-700"
                >
                  {erreur}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOuverte(false)}
                  className="h-9 rounded-lg border border-[#e1e7dc] bg-white px-4 text-[12px] font-semibold text-[#586451] transition hover:bg-[#f7f9f4]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#526b32] px-4 text-[12px] font-semibold text-white transition hover:bg-[#435927]"
                >
                  <Check size={15} />
                  {departementEdite ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {confirmationSuppression && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#172113]/40 p-4 backdrop-blur-[3px]">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="suppression-title"
            className="w-full max-w-sm rounded-2xl border border-[#f0dfdf] bg-white p-5 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f0] text-[#c24141]">
              <Trash2 size={20} />
            </div>

            <h2
              id="suppression-title"
              className="mt-4 text-base font-bold text-[#303a2b]"
            >
              Supprimer ce département ?
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-[#7c8574]">
              Voulez-vous vraiment supprimer le département{' '}
              <span className="font-semibold text-[#34412e]">
                {confirmationSuppression.libelle}
              </span>{' '}
              ({confirmationSuppression.code}) ?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmationSuppression(null)}
                className="h-9 rounded-lg border border-[#e1e7dc] px-4 text-[12px] font-semibold text-[#586451] transition hover:bg-[#f7f9f4]"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={supprimerDepartement}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#c74747] px-4 text-[12px] font-semibold text-white transition hover:bg-[#ad3535]"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
