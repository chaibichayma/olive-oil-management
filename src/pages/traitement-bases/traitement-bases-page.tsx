
import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  Download,
  Droplet,
  FileText,
  Leaf,
  Plus,
  RotateCcw,
  Search,
  UserRound,
  X,
} from 'lucide-react';

type TraitementBase = {
  id: number;
  date: string;
  poidsOlive: number;
  poidsHuile: number;
  typeHuile: string;
  prixUnite: number;
  observation: string;
};

const DONNEES_INITIALES: TraitementBase[] = [
  {
    id: 1,
    date: '02/10/2026',
    poidsOlive: 850,
    poidsHuile: 165,
    typeHuile: 'Vierge extra',
    prixUnite: 7.5,
    observation: 'Lot A-12',
  },
  {
    id: 2,
    date: '05/10/2026',
    poidsOlive: 1200,
    poidsHuile: 238,
    typeHuile: 'Vierge',
    prixUnite: 7,
    observation: 'Traitement terminé',
  },
  {
    id: 3,
    date: '08/10/2026',
    poidsOlive: 640,
    poidsHuile: 121,
    typeHuile: 'Lampante',
    prixUnite: 6.5,
    observation: 'Contrôle qualité validé',
  },
  {
    id: 4,
    date: '12/10/2026',
    poidsOlive: 950,
    poidsHuile: 182,
    typeHuile: 'Vierge extra',
    prixUnite: 7.8,
    observation: 'Lot B-03',
  },
  {
    id: 5,
    date: '15/10/2026',
    poidsOlive: 1430,
    poidsHuile: 275,
    typeHuile: 'Vierge',
    prixUnite: 7.2,
    observation: 'Traitement terminé',
  },
  {
    id: 6,
    date: '18/10/2026',
    poidsOlive: 780,
    poidsHuile: 150,
    typeHuile: 'Lampante',
    prixUnite: 6.8,
    observation: 'En attente de contrôle',
  },
  {
    id: 7,
    date: '22/10/2026',
    poidsOlive: 1050,
    poidsHuile: 199,
    typeHuile: 'Vierge extra',
    prixUnite: 7.6,
    observation: 'Lot C-07',
  },
];

const NOMBRE_OPERATIONS = 24;
const PAGE_SIZE = 7;

const TYPES_HUILE = ['Vierge extra', 'Vierge', 'Lampante'];

function calculerPrixTotal(item: TraitementBase) {
  return item.poidsHuile * item.prixUnite;
}

function formaterNombre(value: number) {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function convertirDate(date: string) {
  const [jour, mois, annee] = date.split('/');
  return new Date(Number(annee), Number(mois) - 1, Number(jour));
}

function creerDonneesDemo(): TraitementBase[] {
  const donnees = [...DONNEES_INITIALES];

  for (let i = donnees.length; i < NOMBRE_OPERATIONS; i++) {
    const modele = DONNEES_INITIALES[i % DONNEES_INITIALES.length];
    const jour = 1 + ((i * 3 + 1) % 28);

    donnees.push({
      ...modele,
      id: i + 1,
      date: `${String(jour).padStart(2, '0')}/09/2026`,
      poidsOlive: modele.poidsOlive + i * 10,
      poidsHuile: modele.poidsHuile + i * 2,
      observation: `Lot ${String.fromCharCode(65 + (i % 3))}-${String(
        i + 1,
      ).padStart(2, '0')}`,
    });
  }

  return donnees.sort(
    (a, b) => convertirDate(b.date).getTime() - convertirDate(a.date).getTime(),
  );
}

export function TraitementBasesPage() {
  const [traitements, setTraitements] =
    useState<TraitementBase[]>(creerDonneesDemo);

  const [nomCompte, setNomCompte] = useState('Mohamed Ben Salem');
  const [telephone, setTelephone] = useState('+216 22 345 678');
  const [recherche, setRecherche] = useState('');
  const [typeHuile, setTypeHuile] = useState('Tous les types d’huile');
  const [page, setPage] = useState(1);
  const [dateDebut, setDateDebut] = useState('2026-10-01');
  const [dateFin, setDateFin] = useState('2026-10-24');
  const [modalOuvert, setModalOuvert] = useState(false);

  const [nouveau, setNouveau] = useState({
    date: '2026-10-24',
    poidsOlive: '',
    poidsHuile: '',
    typeHuile: 'Vierge extra',
    prixUnite: '',
    observation: '',
  });

  const traitementsFiltres = useMemo(() => {
    return traitements.filter((item) => {
      const texte = [
        item.date,
        item.typeHuile,
        item.observation,
        String(item.poidsOlive),
        String(item.poidsHuile),
      ]
        .join(' ')
        .toLowerCase();

      const correspondRecherche = texte.includes(recherche.toLowerCase());

      const correspondType =
        typeHuile === 'Tous les types d’huile' ||
        item.typeHuile === typeHuile;

      const dateItem = convertirDate(item.date);
      const debut = dateDebut ? new Date(`${dateDebut}T00:00:00`) : null;
      const fin = dateFin ? new Date(`${dateFin}T23:59:59`) : null;

      const correspondDate =
        (!debut || dateItem >= debut) && (!fin || dateItem <= fin);

      return correspondRecherche && correspondType && correspondDate;
    });
  }, [traitements, recherche, typeHuile, dateDebut, dateFin]);

  const nombrePages = Math.max(
    1,
    Math.ceil(traitementsFiltres.length / PAGE_SIZE),
  );

  const traitementsAffiches = traitementsFiltres.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const totalOlives = traitements.reduce(
    (total, item) => total + item.poidsOlive,
    0,
  );

  const totalHuile = traitements.reduce(
    (total, item) => total + item.poidsHuile,
    0,
  );

  const montantTotal = traitements.reduce(
    (total, item) => total + calculerPrixTotal(item),
    0,
  );

  function reinitialiserFiltres() {
    setRecherche('');
    setTypeHuile('Tous les types d’huile');
    setDateDebut('');
    setDateFin('');
    setPage(1);
  }

  function exporterCSV() {
    const entetes = [
      'Date',
      'Poids olive (kg)',
      'Poids huile (L)',
      "Type d'huile",
      'Prix unite (DT)',
      'Prix total (DT)',
      'Observation',
    ];

    const lignes = traitementsFiltres.map((item) => [
      item.date,
      item.poidsOlive,
      item.poidsHuile,
      item.typeHuile,
      item.prixUnite,
      calculerPrixTotal(item).toFixed(2),
      item.observation,
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
    lien.download = 'historique-traitement-bases.csv';
    lien.click();
    URL.revokeObjectURL(url);
  }

  function ajouterTraitement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const poidsOlive = Number(nouveau.poidsOlive);
    const poidsHuile = Number(nouveau.poidsHuile);
    const prixUnite = Number(nouveau.prixUnite);

    if (
      !nouveau.date ||
      !Number.isFinite(poidsOlive) ||
      !Number.isFinite(poidsHuile) ||
      !Number.isFinite(prixUnite) ||
      poidsOlive <= 0 ||
      poidsHuile <= 0 ||
      prixUnite < 0
    ) {
      return;
    }

    const [annee, mois, jour] = nouveau.date.split('-');

    const traitement: TraitementBase = {
      id: Date.now(),
      date: `${jour}/${mois}/${annee}`,
      poidsOlive,
      poidsHuile,
      typeHuile: nouveau.typeHuile,
      prixUnite,
      observation: nouveau.observation.trim() || 'Aucune observation',
    };

    setTraitements((precedents) => [traitement, ...precedents]);
    setRecherche('');
    setTypeHuile('Tous les types d’huile');
    setDateDebut('');
    setDateFin('');
    setPage(1);
    setModalOuvert(false);

    setNouveau({
      date: '2026-10-24',
      poidsOlive: '',
      poidsHuile: '',
      typeHuile: 'Vierge extra',
      prixUnite: '',
      observation: '',
    });
  }

  const champClass =
    'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#71843d] focus:ring-2 focus:ring-[#71843d]/10';

  return (
    <div className="min-h-full  p-4 text-slate-800 sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Traitement des bases
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Suivi des opérations de traitement et de production d’huile.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOuvert(true)}
              className="inline-flex items-center gap-2 rounded-md bg-[#63782c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#526522]"
            >
              <Plus size={16} />
              Nouveau traitement
            </button>

            <button
              type="button"
              onClick={exporterCSV}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Leaf size={25} />}
            label="Total olives traitées"
            value={`${formaterNombre(totalOlives)} kg`}
            iconClass="bg-[#edf2e2] text-[#718532]"
            cardClass="border-[#e5ebdc] bg-[#fbfcf8]"
          />

          <StatCard
            icon={<Droplet size={25} />}
            label="Huile produite"
            value={`${formaterNombre(totalHuile)} L`}
            iconClass="bg-[#e6f0f8] text-[#4d99d5]"
            cardClass="border-[#e0eaf2] bg-[#f9fbfd]"
          />

          <StatCard
            icon={<Coins size={25} />}
            label="Montant total"
            value={`${formaterNombre(montantTotal)} DT`}
            iconClass="bg-[#fff3df] text-[#c99516]"
            cardClass="border-[#f0e7d9] bg-[#fffdfa]"
          />

          <StatCard
            icon={<FileText size={25} />}
            label="Opérations"
            value={String(traitements.length)}
            iconClass="bg-[#eee9fb] text-[#8571df]"
            cardClass="border-[#e9e4f5] bg-[#fcfbff]"
          />
        </div>

        {/* Informations du compte */}
<section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
  {/* En-tête */}
  <div className="mb-4 flex items-center gap-2">
    <UserRound size={19} className="text-[#63782c]" />
    <h2 className="text-base font-bold text-slate-900">
      Informations du compte
    </h2>
  </div>

  {/* Champs du compte */}
  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-[1.7fr_1fr_1.3fr]">
    {/* Recherche du compte */}
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        Rechercher un compte par nom ou téléphone
      </label>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={nomCompte}
          onChange={(e) => {
            setNomCompte(e.target.value);
            setPage(1);
          }}
          className={`${champClass} pl-9 pr-9`}
          placeholder="Nom du compte"
        />

        {nomCompte && (
          <button
            type="button"
            aria-label="Effacer le nom du compte"
            onClick={() => {
              setNomCompte('');
              setPage(1);
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          >
            <X size={15} />
          </button>
        )}

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>

    {/* Téléphone */}
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        Téléphone
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z" />
          </svg>
        </span>

        <input
          value={telephone}
          onChange={(e) => {
            setTelephone(e.target.value);
            setPage(1);
          }}
          className={`${champClass} pl-9`}
          placeholder="+216 ..."
          type="tel"
        />
      </div>
    </div>

    {/* Période */}
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        Période
      </label>

      <div className="flex min-h-[38px] flex-wrap items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5 transition focus-within:border-[#63782c] focus-within:ring-1 focus-within:ring-[#63782c]/20">
        <CalendarDays
          size={16}
          className="shrink-0 text-slate-500"
        />

        <input
          type="date"
          aria-label="Date de début"
          value={dateDebut}
          max={dateFin || undefined}
          onChange={(e) => {
            setDateDebut(e.target.value);
            setPage(1);
          }}
          className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none"
        />

        <span className="text-xs text-slate-400">–</span>

        <input
          type="date"
          aria-label="Date de fin"
          value={dateFin}
          min={dateDebut || undefined}
          onChange={(e) => {
            setDateFin(e.target.value);
            setPage(1);
          }}
          className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none"
        />
      </div>
    </div>
  </div>
</section>

        {/* Tableau */}
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <FileText size={19} className="text-[#63782c]" />
              <h2 className="text-base font-bold text-slate-900">
                Historique des traitements
              </h2>
            </div>

            <span className="rounded-md bg-[#edf4e5] px-2.5 py-1 text-xs font-semibold text-[#526c23]">
              {traitementsFiltres.length} opérations
            </span>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 pb-3">
            <div className="relative w-full sm:max-w-[280px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={recherche}
                onChange={(e) => {
                  setRecherche(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher..."
                className={`${champClass} py-2 pl-8 text-xs`}
              />
            </div>

            <div className="relative w-full sm:max-w-[210px]">
              <select
                value={typeHuile}
                onChange={(e) => {
                  setTypeHuile(e.target.value);
                  setPage(1);
                }}
                className={`${champClass} appearance-none py-2 pr-8 text-xs`}
              >
                <option>Tous les types d’huile</option>
                {TYPES_HUILE.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={reinitialiserFiltres}
              title="Réinitialiser les filtres"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={13} />
              Réinitialiser
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#f7f9fb] text-slate-600">
                  <th className="px-3 py-3 font-semibold">
                    <SortLabel label="Date" />
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    <SortLabel label="Poids olive (kg)" />
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    <SortLabel label="Poids d’huile (L)" />
                  </th>
                  <th className="px-3 py-3 font-semibold">
                    <SortLabel label="Type d’huile" />
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    <SortLabel label="Prix unité (DT)" />
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    <SortLabel label="Prix total (DT)" />
                  </th>
                  <th className="px-3 py-3 font-semibold">Observation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {traitementsAffiches.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#f8faf5]"
                  >
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                      {item.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right text-slate-700">
                      {formaterNombre(item.poidsOlive)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right text-slate-700">
                      {formaterNombre(item.poidsHuile)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                      {item.typeHuile}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right text-slate-700">
                      {formaterNombre(item.prixUnite)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium text-slate-800">
                      {formaterNombre(calculerPrixTotal(item))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                      {item.observation}
                    </td>
                  </tr>
                ))}

                {traitementsAffiches.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      Aucune opération ne correspond aux filtres sélectionnés.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              {traitementsFiltres.length === 0
                ? 'Aucun résultat'
                : `Affichage de ${(page - 1) * PAGE_SIZE + 1} à ${Math.min(
                    page * PAGE_SIZE,
                    traitementsFiltres.length,
                  )} sur ${traitementsFiltres.length} résultats`}
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Page précédente"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: nombrePages }, (_, index) => index + 1)
                .filter(
                  (numero) =>
                    numero === 1 ||
                    numero === nombrePages ||
                    Math.abs(numero - page) <= 1,
                )
                .map((numero, index, numeros) => (
                  <span key={numero} className="contents">
                    {index > 0 && numero - numeros[index - 1] > 1 && (
                      <span className="px-1 text-slate-400">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(numero)}
                      aria-current={page === numero ? 'page' : undefined}
                      className={`h-8 min-w-8 rounded-md border px-2 text-xs font-medium transition ${
                        page === numero
                          ? 'border-[#63782c] bg-[#63782c] text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {numero}
                    </button>
                  </span>
                ))}

              <button
                type="button"
                aria-label="Page suivante"
                disabled={page === nombrePages}
                onClick={() =>
                  setPage((p) => Math.min(nombrePages, p + 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal : nouveau traitement */}
      {modalOuvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4"
          onClick={() => setModalOuvert(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nouveau-traitement-title"
            className="my-auto w-full max-w-xl rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2
                  id="nouveau-traitement-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Nouveau traitement
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Saisir les informations de l’opération.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOuvert(false)}
                aria-label="Fermer"
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={ajouterTraitement} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={nouveau.date}
                    onChange={(e) =>
                      setNouveau({ ...nouveau, date: e.target.value })
                    }
                    className={champClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Type d’huile
                  </label>
                  <select
                    value={nouveau.typeHuile}
                    onChange={(e) =>
                      setNouveau({ ...nouveau, typeHuile: e.target.value })
                    }
                    className={champClass}
                  >
                    {TYPES_HUILE.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Poids olive (kg)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={nouveau.poidsOlive}
                    onChange={(e) =>
                      setNouveau({ ...nouveau, poidsOlive: e.target.value })
                    }
                    placeholder="Ex. : 850"
                    className={champClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Poids huile (L)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={nouveau.poidsHuile}
                    onChange={(e) =>
                      setNouveau({ ...nouveau, poidsHuile: e.target.value })
                    }
                    placeholder="Ex. : 165"
                    className={champClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Prix unité (DT/L)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={nouveau.prixUnite}
                    onChange={(e) =>
                      setNouveau({ ...nouveau, prixUnite: e.target.value })
                    }
                    placeholder="Ex. : 7.50"
                    className={champClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Observation
                  </label>
                  <input
                    value={nouveau.observation}
                    onChange={(e) =>
                      setNouveau({ ...nouveau, observation: e.target.value })
                    }
                    placeholder="Ex. : Lot A-12"
                    className={champClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOuvert(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-[#63782c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#526522]"
                >
                  <Plus size={16} />
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClass: string;
  cardClass: string;
};

function StatCard({
  icon,
  label,
  value,
  iconClass,
  cardClass,
}: StatCardProps) {
  return (
    <div
      className={`flex min-h-[88px] items-center gap-3 rounded-lg border p-3.5 shadow-sm ${cardClass}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-lg font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function SortLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      {label}
      <ChevronsUpDown size={12} className="text-slate-400" />
    </span>
  );
}

