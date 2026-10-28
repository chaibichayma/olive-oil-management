
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Filter,
  Leaf,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
  WalletCards,
  X,
} from 'lucide-react';

type Compte = {
  id: number;
  nom: string;
  telephone: string;
  numero: string;
  type: 'Client' | 'Fournisseur';
};

type BonReception = {
  id: number;
  reference: string;
  compteId: number;
  date: string;
  typeHuile: string;
  quantiteOlives: number;
  quantiteHuile: number;
  montant: number;
  statut: 'Traité' | 'En cours' | 'En attente';
};

const TYPES_HUILE = [
  "Huile d'olive",
  'Huile vierge extra',
  'Huile vierge',
  'Lampante',
];

const COMPTES: Compte[] = [
  { id: 1, nom: 'Coopérative de Sousse', telephone: '+216 73 210 456', numero: 'CPT-001', type: 'Fournisseur' },
  { id: 2, nom: 'Société El Oliva', telephone: '+216 98 123 456', numero: 'CPT-002', type: 'Client' },
  { id: 3, nom: 'Agriplus', telephone: '+216 55 678 912', numero: 'CPT-003', type: 'Fournisseur' },
  { id: 4, nom: 'Mohamed Ben Salem', telephone: '+216 22 345 678', numero: 'CPT-004', type: 'Client' },
  { id: 5, nom: 'Med Oil', telephone: '+216 71 987 654', numero: 'CPT-005', type: 'Client' },
  { id: 6, nom: 'Coopérative Mahdia', telephone: '+216 29 111 222', numero: 'CPT-006', type: 'Fournisseur' },
  { id: 7, nom: 'Karim Trabelsi', telephone: '+216 50 333 444', numero: 'CPT-007', type: 'Client' },
  { id: 8, nom: 'Export Olive SARL', telephone: '+216 28 765 432', numero: 'CPT-008', type: 'Fournisseur' },
];

const BONS_INITIAUX: BonReception[] = [
  { id: 1, reference: 'BR-001', compteId: 1, date: '2024-10-12', typeHuile: "Huile d'olive", quantiteOlives: 1250, quantiteHuile: 250, montant: 1500, statut: 'Traité' },
  { id: 2, reference: 'BR-002', compteId: 2, date: '2024-10-15', typeHuile: 'Huile vierge extra', quantiteOlives: 980, quantiteHuile: 210, montant: 1230, statut: 'En cours' },
  { id: 3, reference: 'BR-003', compteId: 3, date: '2024-10-18', typeHuile: 'Huile vierge', quantiteOlives: 1500, quantiteHuile: 300, montant: 1850, statut: 'En attente' },
  { id: 4, reference: 'BR-004', compteId: 1, date: '2024-10-20', typeHuile: "Huile d'olive", quantiteOlives: 1100, quantiteHuile: 230, montant: 1420, statut: 'Traité' },
  { id: 5, reference: 'BR-005', compteId: 4, date: '2024-10-22', typeHuile: 'Huile vierge extra', quantiteOlives: 950, quantiteHuile: 205, montant: 1280, statut: 'En cours' },
  { id: 6, reference: 'BR-006', compteId: 5, date: '2024-10-23', typeHuile: 'Huile vierge', quantiteOlives: 1320, quantiteHuile: 275, montant: 1720, statut: 'Traité' },
  { id: 7, reference: 'BR-007', compteId: 6, date: '2024-10-24', typeHuile: 'Lampante', quantiteOlives: 870, quantiteHuile: 165, montant: 990, statut: 'En attente' },
  { id: 8, reference: 'BR-008', compteId: 7, date: '2024-10-25', typeHuile: 'Huile vierge extra', quantiteOlives: 1150, quantiteHuile: 240, montant: 1640, statut: 'En cours' },
  { id: 9, reference: 'BR-009', compteId: 8, date: '2024-10-26', typeHuile: "Huile d'olive", quantiteOlives: 1420, quantiteHuile: 295, montant: 1980, statut: 'Traité' },
];

const inputClass =
  'w-full rounded-lg border border-[#e0e5dc] bg-white px-3 py-2.5 text-xs text-[#344054] outline-none transition placeholder:text-[#98a2b3] hover:border-[#cbd5c0] focus:border-[#71843d] focus:ring-2 focus:ring-[#71843d]/10';

function formatNumber(value: number) {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR');
}

function formatMoney(value: number) {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function StatusBadge({ status }: { status: BonReception['statut'] }) {
  const styles: Record<BonReception['statut'], string> = {
    Traité: 'bg-[#dff1df] text-[#28723a]',
    'En cours': 'bg-[#dcecff] text-[#1764bd]',
    'En attente': 'bg-[#fff0cc] text-[#a86b08]',
  };

  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e3ead9] bg-[#edf3e5] text-[#556b2f]">
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#172b3d]">{title}</h2>
        {description && (
          <p className="mt-1 text-xs leading-5 text-[#778397]">{description}</p>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold text-[#344054]">
      {children}
    </label>
  );
}

function InfoCompte({
  icon,
  label,
  value,
  last = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${!last ? 'xl:border-r xl:border-[#dce4d5] xl:pr-3' : ''}`}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf2e6] text-[#556b2f]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[#7b8795]">{label}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#344054]">{value}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e8ede3] bg-[#fbfcfa] p-3">
      <p className="text-[10px] font-medium text-[#7b8795]">{label}</p>
      <p className="mt-1.5 break-words text-sm font-semibold text-[#344054]">{value}</p>
    </div>
  );
}

export default function TraitementBasesPage() {
  const [bons] = useState<BonReception[]>(BONS_INITIAUX);

  const [typeHuile, setTypeHuile] = useState('');
  const [compteId, setCompteId] = useState('');
  const [telephone, setTelephone] = useState('');
  const [numeroCompte, setNumeroCompte] = useState('');

  const [rechercheLancee, setRechercheLancee] = useState(false);
  const [messageErreur, setMessageErreur] = useState('');

  const [dropdownComptesOuvert, setDropdownComptesOuvert] = useState(false);
  const [rechercheCompte, setRechercheCompte] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(5);
  const [selection, setSelection] = useState<number[]>([]);
  const [rechercheTableau, setRechercheTableau] = useState('');
  const [detailsBon, setDetailsBon] = useState<BonReception | null>(null);

  const compteSelectionne = COMPTES.find(
    (compte) => String(compte.id) === compteId,
  );

  const comptesFiltres = useMemo(() => {
    const q = rechercheCompte.trim().toLowerCase();

    return COMPTES.filter((compte) =>
      !q ||
      compte.nom.toLowerCase().includes(q) ||
      compte.telephone.toLowerCase().includes(q) ||
      compte.numero.toLowerCase().includes(q) ||
      compte.type.toLowerCase().includes(q)
    );
  }, [rechercheCompte]);

  // Un type d'huile ET un numéro de compte ou un téléphone sont obligatoires.
  const criteresComplets =
    Boolean(typeHuile) && Boolean(numeroCompte || telephone);

  const bonsFiltres = useMemo(() => {
    // Ne jamais afficher les bons avant une recherche valide.
    if (!rechercheLancee || !criteresComplets) {
      return [];
    }

    const recherche = rechercheTableau.trim().toLowerCase();

    return bons.filter((bon) => {
      const compte = COMPTES.find((c) => c.id === bon.compteId);

      const correspondType = bon.typeHuile === typeHuile;

      const correspondCompte =
        !compteId || bon.compteId === Number(compteId);

      const correspondTelephone =
        !telephone || compte?.telephone === telephone;

      const correspondNumero =
        !numeroCompte || compte?.numero === numeroCompte;

      const texte = [
        bon.reference,
        bon.typeHuile,
        bon.statut,
        bon.date,
        compte?.nom ?? '',
        compte?.numero ?? '',
        compte?.telephone ?? '',
      ].join(' ').toLowerCase();

      const correspondRecherche =
        !recherche || texte.includes(recherche);

      return (
        correspondType &&
        correspondCompte &&
        correspondTelephone &&
        correspondNumero &&
        correspondRecherche
      );
    });
  }, [
    bons,
    rechercheLancee,
    criteresComplets,
    typeHuile,
    compteId,
    telephone,
    numeroCompte,
    rechercheTableau,
  ]);

  const nombrePages = Math.max(
    1,
    Math.ceil(bonsFiltres.length / taillePage),
  );

  const bonsAffiches = bonsFiltres.slice(
    (page - 1) * taillePage,
    page * taillePage,
  );

  const toutSelectionne =
    bonsAffiches.length > 0 &&
    bonsAffiches.every((bon) => selection.includes(bon.id));

  function modifierFiltre(callback: () => void) {
    callback();
    setRechercheLancee(false);
    setMessageErreur('');
    setPage(1);
    setSelection([]);
  }

  function appliquerRecherche() {
    if (!typeHuile) {
      setRechercheLancee(false);
      setMessageErreur("Veuillez sélectionner un type d’huile.");
      return;
    }

    if (!numeroCompte && !telephone) {
      setRechercheLancee(false);
      setMessageErreur(
        'Veuillez sélectionner un numéro de compte ou un téléphone.',
      );
      return;
    }

    setMessageErreur('');
    setRechercheLancee(true);
    setPage(1);
    setSelection([]);
    setDropdownComptesOuvert(false);
  }

  function choisirCompte(compte: Compte) {
    setCompteId(String(compte.id));
    setTelephone(compte.telephone);
    setNumeroCompte(compte.numero);
    setRechercheCompte('');
    setDropdownComptesOuvert(false);
    setRechercheLancee(false);
    setMessageErreur('');
    setPage(1);
    setSelection([]);
  }

  function reinitialiser() {
    setTypeHuile('');
    setCompteId('');
    setTelephone('');
    setNumeroCompte('');
    setRechercheCompte('');
    setRechercheTableau('');
    setRechercheLancee(false);
    setMessageErreur('');
    setDropdownComptesOuvert(false);
    setPage(1);
    setSelection([]);
  }

  function exporterCSV() {
    if (bonsFiltres.length === 0) return;

    const entetes = [
      'Référence',
      'Nom du compte',
      'Téléphone',
      'Numéro de compte',
      'Date de réception',
      "Type d'huile",
      "Quantité d'olives (kg)",
      "Quantité d'huile (kg)",
      'Montant (DT)',
      'Statut',
    ];

    const lignes = bonsFiltres.map((bon) => {
      const compte = COMPTES.find((c) => c.id === bon.compteId);

      return [
        bon.reference,
        compte?.nom ?? '',
        compte?.telephone ?? '',
        compte?.numero ?? '',
        formatDate(bon.date),
        bon.typeHuile,
        bon.quantiteOlives,
        bon.quantiteHuile,
        bon.montant.toFixed(2),
        bon.statut,
      ];
    });

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
    lien.download = 'bons-reception-traitement.csv';
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    URL.revokeObjectURL(url);
  }

  function basculerSelection(id: number) {
    setSelection((ancienne) =>
      ancienne.includes(id)
        ? ancienne.filter((item) => item !== id)
        : [...ancienne, id],
    );
  }

  function basculerToutesLesSelections() {
    if (toutSelectionne) {
      const idsPage = bonsAffiches.map((bon) => bon.id);
      setSelection((ancienne) =>
        ancienne.filter((id) => !idsPage.includes(id)),
      );
    } else {
      setSelection((ancienne) =>
        Array.from(
          new Set([...ancienne, ...bonsAffiches.map((bon) => bon.id)]),
        ),
      );
    }
  }

  function actualiser() {
    setPage(1);
    setSelection([]);
  }

  return (
    <div className="min-h-full bg-[#f7f9f5] p-3 text-[#243247] sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3.5">

        {/* En-tête */}
        <header className="relative overflow-hidden rounded-xl border border-[#e4e9dd] bg-gradient-to-r from-white via-[#fbfcf8] to-[#eff4e6] px-5 py-4 shadow-[0_2px_8px_rgba(28,43,20,0.03)] sm:px-6 sm:py-5">
          <div className="pointer-events-none absolute -right-5 -top-10 size-40 rounded-full border border-[#e3ead8]" />
          <div className="pointer-events-none absolute -right-1 -top-5 size-28 rounded-full border border-[#e3ead8]" />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#839a4b] to-[#536b2d] text-white shadow-md shadow-[#556b2f]/15">
                <Building2 size={25} strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#142e43] sm:text-2xl">
                  Traitement de base
                </h1>
                <p className="mt-1 text-xs leading-5 text-[#687b90] sm:text-sm">
                  Sélectionnez un type d’huile et un numéro de compte ou un téléphone pour consulter les bons de réception.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce6d1] bg-white/80 px-3 py-1.5 text-[10px] font-medium text-[#33452a]">
              <span className="size-1.5 rounded-full bg-[#63823d]" />
              Gestion de production
            </span>
          </div>
        </header>

        {/* Critères */}
        
{/* Section des critères de recherche */}
<section className="overflow-hidden rounded-2xl border border-[#e5e9df] bg-white shadow-[0_4px_18px_rgba(35,48,25,0.04)]">

  {/* En-tête */}
  <div className="flex flex-col gap-3 border-b border-[#edf0e8] bg-gradient-to-r from-[#f8faf5] to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0df] text-[#586f32] ring-1 ring-inset ring-[#dce5ce]">
        <Filter size={19} strokeWidth={2} />
      </div>

      <div>
        <h2 className="text-sm font-bold tracking-tight text-[#26351d] sm:text-base">
          Critères de recherche
        </h2>
        <p className="mt-1 text-xs leading-5 text-[#788071]">
          Filtrez les bons de réception selon le type d’huile et le compte.
        </p>
      </div>
    </div>

    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e3e9d9] bg-white px-3 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#718b48]" />
      <span className="text-[11px] font-semibold text-[#586f32]">
        Recherche par critères
      </span>
    </div>
  </div>

  {/* Champs de recherche */}
  <div className="p-5 sm:p-6">
    <div className="grid grid-cols-1 items-end gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-[1.05fr_1.5fr_1.05fr_auto]">

      {/* Type d'huile */}
      <div className="min-w-0">
        <FieldLabel>Type d’huile <span className="text-red-500">*</span></FieldLabel>

        <div className="group relative mt-2">
          <Leaf
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#647b40] transition-colors group-focus-within:text-[#435624]"
          />

          <select
            value={typeHuile}
            onChange={(e) =>
              modifierFiltre(() => setTypeHuile(e.target.value))
            }
            className="h-12 w-full appearance-none rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] pl-10 pr-10 text-sm font-medium text-[#34412b] outline-none transition-all duration-200 hover:border-[#b9c7a8] focus:border-[#718746] focus:bg-white focus:ring-4 focus:ring-[#586f32]/10"
          >
            <option value="">Sélectionner un type</option>
            {TYPES_HUILE.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8572]"
          />
        </div>
      </div>

      {/* Téléphone */}
      <div className="min-w-0">
        <FieldLabel>Téléphone <span className="text-red-500">*</span></FieldLabel>

        <div className="group relative mt-2">
          <Phone
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#647b40] transition-colors group-focus-within:text-[#435624]"
          />

          <select
            value={telephone}
            onChange={(e) => {
              const valeur = e.target.value;
              const compte = COMPTES.find(
                (c) => c.telephone === valeur,
              );

              modifierFiltre(() => {
                setTelephone(valeur);
                setCompteId(compte ? String(compte.id) : '');
                setNumeroCompte(compte?.numero ?? '');
              });
            }}
            className="h-12 w-full appearance-none rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] pl-10 pr-10 text-sm font-medium text-[#34412b] outline-none transition-all duration-200 hover:border-[#b9c7a8] focus:border-[#718746] focus:bg-white focus:ring-4 focus:ring-[#586f32]/10"
          >
            <option value="">Sélectionner un téléphone</option>
            {COMPTES.map((compte) => (
              <option key={compte.id} value={compte.telephone}>
                {compte.telephone}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8572]"
          />
        </div>
      </div>

      {/* Numéro de compte */}
      <div className="min-w-0">
        <FieldLabel>
          Numéro de compte <span className="text-red-500">*</span>
        </FieldLabel>

        <div className="group relative mt-2">
          <WalletCards
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#647b40] transition-colors group-focus-within:text-[#435624]"
          />

          <select
            value={numeroCompte}
            onChange={(e) => {
              const valeur = e.target.value;
              const compte = COMPTES.find(
                (c) => c.numero === valeur,
              );

              modifierFiltre(() => {
                setNumeroCompte(valeur);
                setCompteId(compte ? String(compte.id) : '');
                setTelephone(compte?.telephone ?? '');
              });
            }}
            className="h-12 w-full appearance-none rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] pl-10 pr-10 text-sm font-medium text-[#34412b] outline-none transition-all duration-200 hover:border-[#b9c7a8] focus:border-[#718746] focus:bg-white focus:ring-4 focus:ring-[#586f32]/10"
          >
            <option value="">Sélectionner un numéro</option>
            {COMPTES.map((compte) => (
              <option key={compte.id} value={compte.numero}>
                {compte.numero}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8572]"
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-end gap-2 md:col-span-2 xl:col-span-1">
        <button
          type="button"
          onClick={appliquerRecherche}
          className="group inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#586f32] px-4 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(65,83,39,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#465a27] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#586f32]/20 active:translate-y-0"
        >
          <Search
            size={17}
            strokeWidth={2}
            className="shrink-0 transition-transform group-hover:scale-110"
          />
          <span>Rechercher</span>
        </button>

        <button
          type="button"
          onClick={reinitialiser}
          title="Réinitialiser les critères"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#dfe5d8] bg-white px-3.5 text-sm font-semibold text-[#53604a] transition-all duration-200 hover:border-[#c6d2b9] hover:bg-[#f7f9f3] hover:text-[#435624] focus:outline-none focus:ring-4 focus:ring-[#586f32]/10"
        >
          <RotateCcw size={16} strokeWidth={1.8} />
          <span>Réinitialiser</span>
        </button>
      </div>
    </div>

    {/* Message d'erreur */}
    {messageErreur && (
      <div
        role="alert"
        className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <X size={17} className="mt-0.5 shrink-0" />
        <p className="font-medium leading-5">{messageErreur}</p>
      </div>
    )}
  </div>
</section>


        {/* Informations du compte */}
        <section className="rounded-xl border border-[#e6eae3] bg-white p-3 shadow-[0_2px_8px_rgba(28,43,20,0.025)] sm:p-4">
          <div className="rounded-lg border border-[#edf1e7] bg-gradient-to-r from-[#f3f7ed] to-[#f8faf5] p-3.5 sm:p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#e0ebd1] text-[#526b2c]">
                <UserRound size={21} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#172b3d]">Compte sélectionné</h2>
                <p className="mt-1 text-xs text-[#7b8795]">
                  {compteSelectionne
                    ? 'Les informations du compte sélectionné.'
                    : 'Sélectionnez un compte pour afficher ses informations.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCompte icon={<UserRound size={16} />} label="Nom du compte" value={compteSelectionne?.nom ?? '—'} />
              <InfoCompte icon={<Phone size={16} />} label="Téléphone" value={compteSelectionne?.telephone ?? '—'} />
              <InfoCompte icon={<WalletCards size={16} />} label="Numéro de compte" value={compteSelectionne?.numero ?? '—'} />
              <InfoCompte icon={<Users size={16} />} label="Type de compte" value={compteSelectionne?.type ?? '—'} last />
            </div>
          </div>
        </section>

        {/* Bons de réception : tableau masqué avant une recherche valide */}
        <section className="overflow-hidden rounded-xl border border-[#e6eae3] bg-white shadow-[0_2px_8px_rgba(28,43,20,0.025)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <SectionTitle
              icon={<ClipboardList size={19} />}
              title="Bons de réception"
              description={
                !rechercheLancee
                  ? 'Choisissez un type d’huile et un compte pour afficher les bons.'
                  : `Résultats : ${bonsFiltres.length} bon(s) de réception.`
              }
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={exporterCSV}
                disabled={bonsFiltres.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5da] bg-white px-3 py-2 text-xs font-semibold text-[#34452a] transition hover:bg-[#f4f7ef] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={14} />
                Exporter
              </button>
              <button
                type="button"
                onClick={actualiser}
                className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5da] bg-white px-3 py-2 text-xs font-semibold text-[#34452a] transition hover:bg-[#f4f7ef]"
              >
                <RefreshCw size={14} />
                Actualiser
              </button>
              <button
                type="button"
                onClick={() => {
                  setRechercheTableau('');
                  setTaillePage(5);
                  setPage(1);
                  setSelection([]);
                }}
                aria-label="Réinitialiser la recherche du tableau"
                title="Réinitialiser la recherche du tableau"
                className="flex size-9 items-center justify-center rounded-lg border border-[#dfe5da] bg-white text-[#556b2f] transition hover:bg-[#f4f7ef]"
              >
                <SlidersHorizontal size={15} />
              </button>
            </div>
          </div>

          {!rechercheLancee ? (
            <div className="border-t border-[#edf0e9] px-4 py-14 text-center sm:px-5">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#687d43]">
                  <Filter size={22} />
                </div>
                <p className="text-sm font-semibold text-[#344054]">
                  Aucun bon affiché
                </p>
                <p className="mt-1 text-xs leading-5 text-[#7b8795]">
                  Sélectionnez un type d’huile et un numéro de compte ou un téléphone, puis cliquez sur « Rechercher ».
                </p>
              </div>
            </div>
          ) : (
            <>
              

              {/* Tableau */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1020px] border-collapse text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#e7ebe3] bg-[#f5f7f2] text-[#475467]">
                      <th className="w-10 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={toutSelectionne}
                          onChange={basculerToutesLesSelections}
                          aria-label="Sélectionner tous les bons de cette page"
                          className="size-3.5 cursor-pointer accent-[#586f32]"
                        />
                      </th>
                      {[
                        'Référence',
                        'Compte',
                        'Date de réception',
                        "Type d'huile",
                        "Quantité d'olives (kg)",
                        "Quantité d'huile (kg)",
                        'Montant (DT)',
                        'Statut',
                      ].map((titre) => (
                        <th key={titre} className="whitespace-nowrap px-3 py-3 font-semibold">
                          <span className="inline-flex items-center gap-1.5">
                            {titre}
                            <ChevronsUpDown size={11} className="text-[#a0a9b5]" />
                          </span>
                        </th>
                      ))}
                      <th className="px-3 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#edf0e9]">
                    {bonsAffiches.map((bon) => {
                      const compte = COMPTES.find((c) => c.id === bon.compteId);
                      const coche = selection.includes(bon.id);

                      return (
                        <tr
                          key={bon.id}
                          className={`transition hover:bg-[#f7f9f4] ${coche ? 'bg-[#f1f5e9]' : 'bg-white'}`}
                        >
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={coche}
                              onChange={() => basculerSelection(bon.id)}
                              aria-label={`Sélectionner ${bon.reference}`}
                              className="size-3.5 cursor-pointer accent-[#586f32]"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#344054]">{bon.reference}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[#526174]">{compte?.nom ?? '—'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[#526174]">{formatDate(bon.date)}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[#526174]">{bon.typeHuile}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[#526174]">{formatNumber(bon.quantiteOlives)}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-[#526174]">{formatNumber(bon.quantiteHuile)}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#344054]">{formatMoney(bon.montant)}</td>
                          <td className="px-3 py-2.5">
                            <StatusBadge status={bon.statut} />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setDetailsBon(bon)}
                                aria-label={`Voir ${bon.reference}`}
                                title="Voir les détails"
                                className="flex size-7 items-center justify-center rounded-md border border-[#e5e9e1] bg-white text-[#536575] transition hover:border-[#bdcdaa] hover:bg-[#edf3e5] hover:text-[#556b2f]"
                              >
                                <Eye size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {bonsAffiches.length === 0 && (
                      <tr>
                        <td colSpan={10} className="px-4 py-14 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#687d43]">
                              <FileText size={21} />
                            </div>
                            <p className="text-sm font-semibold text-[#344054]">
                              Aucun bon de réception trouvé
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#7b8795]">
                              Aucun bon ne correspond à ces critères. Essayez une autre sélection.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e9] px-4 py-3.5 sm:px-5">
                <p className="text-[11px] text-[#667085]">
                  {bonsFiltres.length === 0
                    ? 'Aucun bon de réception'
                    : `Affichage de ${(page - 1) * taillePage + 1} à ${Math.min(page * taillePage, bonsFiltres.length)} sur ${bonsFiltres.length} bons de réception`}
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Page précédente"
                    className="flex size-8 items-center justify-center rounded-lg border border-[#e0e5dc] bg-white text-[#667085] transition hover:bg-[#f4f7ef] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from({ length: nombrePages }, (_, i) => i + 1)
                    .filter((numero) =>
                      numero === 1 ||
                      numero === nombrePages ||
                      Math.abs(numero - page) <= 1
                    )
                    .map((numero, index, numeros) => (
                      <span key={numero} className="contents">
                        {index > 0 && numero - numeros[index - 1] > 1 && (
                          <span className="px-1 text-xs text-[#98a2b3]">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(numero)}
                          aria-current={page === numero ? 'page' : undefined}
                          className={`flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                            page === numero
                              ? 'border-[#586f32] bg-[#586f32] text-white shadow-sm'
                              : 'border-[#e0e5dc] bg-white text-[#526174] hover:bg-[#f4f7ef]'
                          }`}
                        >
                          {numero}
                        </button>
                      </span>
                    ))}

                  <button
                    type="button"
                    disabled={page === nombrePages}
                    onClick={() => setPage((p) => Math.min(nombrePages, p + 1))}
                    aria-label="Page suivante"
                    className="flex size-8 items-center justify-center rounded-lg border border-[#e0e5dc] bg-white text-[#667085] transition hover:bg-[#f4f7ef] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Détails d'un bon */}
      {detailsBon && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#172b3d]/40 p-4 backdrop-blur-[2px]"
          onClick={() => setDetailsBon(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-bon-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#e2e8dc] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#edf0e9] bg-gradient-to-r from-[#f3f7ed] to-white px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71843d]">
                  Détail du bon de réception
                </p>
                <h2 id="detail-bon-title" className="mt-1 text-lg font-bold text-[#172b3d]">
                  {detailsBon.reference}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailsBon(null)}
                aria-label="Fermer les détails"
                className="rounded-lg p-2 text-[#667085] transition hover:bg-[#edf1e7] hover:text-[#344054]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              <DetailItem label="Compte" value={COMPTES.find((c) => c.id === detailsBon.compteId)?.nom ?? '—'} />
              <DetailItem label="Date de réception" value={formatDate(detailsBon.date)} />
              <DetailItem label="Type d’huile" value={detailsBon.typeHuile} />
              <DetailItem label="Statut" value={detailsBon.statut} />
              <DetailItem label="Quantité d’olives" value={`${formatNumber(detailsBon.quantiteOlives)} kg`} />
              <DetailItem label="Quantité d’huile" value={`${formatNumber(detailsBon.quantiteHuile)} kg`} />
              <DetailItem label="Montant total" value={`${formatMoney(detailsBon.montant)} DT`} />
            </div>

            <div className="flex justify-end border-t border-[#edf0e9] px-5 py-4">
              <button
                type="button"
                onClick={() => setDetailsBon(null)}
                className="rounded-lg bg-[#586f32] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#465a27]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
