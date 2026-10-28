
import { useMemo, useState, type FormEvent } from "react";
import {
  ShoppingCart,
  Plus,
  Phone,
  RefreshCw,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  UserRound,
  FileText,
} from "lucide-react";

type VenteHuile = {
  id: number;
  compte: string;
  telephone: string;
  quantite: number;
  prixLitre: number;
};

const VENTES_INITIALES: VenteHuile[] = [
  { id: 1, compte: "CPT001", telephone: "06 12 34 56 78", quantite: 120, prixLitre: 35 },
  { id: 2, compte: "CPT002", telephone: "06 98 76 54 32", quantite: 50, prixLitre: 36 },
  { id: 3, compte: "CPT003", telephone: "06 55 66 77 88", quantite: 200, prixLitre: 34.5 },
  { id: 4, compte: "CPT004", telephone: "06 11 22 33 44", quantite: 75, prixLitre: 35.5 },
  { id: 5, compte: "CPT005", telephone: "06 44 55 66 77", quantite: 100, prixLitre: 36 },
  { id: 6, compte: "CPT006", telephone: "06 88 77 66 55", quantite: 30, prixLitre: 37 },
  { id: 7, compte: "CPT007", telephone: "06 21 43 65 87", quantite: 150, prixLitre: 34 },
  { id: 8, compte: "CPT008", telephone: "06 19 28 37 46", quantite: 60, prixLitre: 35 },
];

const PAGE_SIZE = 8;

const formatNombre = (valeur: number) =>
  valeur.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function OilSalesPage() {
  const [ventes, setVentes] = useState<VenteHuile[]>(VENTES_INITIALES);
  const [filtreCompte, setFiltreCompte] = useState("tous");
  const [filtreTelephone, setFiltreTelephone] = useState("tous");
  const [page, setPage] = useState(1);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [venteEnEdition, setVenteEnEdition] = useState<VenteHuile | null>(null);

  const [formulaire, setFormulaire] = useState({
    compte: "",
    telephone: "",
    quantite: "",
    prixLitre: "",
  });

  const comptes = [...new Set(ventes.map((v) => v.compte))];
  const telephones = [...new Set(ventes.map((v) => v.telephone))];

  const ventesFiltrees = useMemo(
    () =>
      ventes.filter(
        (v) =>
          (filtreCompte === "tous" || v.compte === filtreCompte) &&
          (filtreTelephone === "tous" || v.telephone === filtreTelephone)
      ),
    [ventes, filtreCompte, filtreTelephone]
  );

  const totalPages = Math.max(1, Math.ceil(ventesFiltrees.length / PAGE_SIZE));
  const pageCourante = Math.min(page, totalPages);
  const debut = ventesFiltrees.length === 0 ? 0 : (pageCourante - 1) * PAGE_SIZE + 1;
  const fin = Math.min(pageCourante * PAGE_SIZE, ventesFiltrees.length);

  const ventesAffichees = ventesFiltrees.slice(
    (pageCourante - 1) * PAGE_SIZE,
    pageCourante * PAGE_SIZE
  );

  function ouvrirAjout() {
    setVenteEnEdition(null);
    setFormulaire({
      compte: "",
      telephone: "",
      quantite: "",
      prixLitre: "",
    });
    setModalOuverte(true);
  }

  function ouvrirModification(vente: VenteHuile) {
    setVenteEnEdition(vente);
    setFormulaire({
      compte: vente.compte,
      telephone: vente.telephone,
      quantite: String(vente.quantite),
      prixLitre: String(vente.prixLitre),
    });
    setModalOuverte(true);
  }

  function enregistrerVente(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const quantite = Number(formulaire.quantite);
    const prixLitre = Number(formulaire.prixLitre);
    const compte = formulaire.compte.trim();
    const telephone = formulaire.telephone.trim();

    if (
      !compte ||
      !telephone ||
      !Number.isFinite(quantite) ||
      !Number.isFinite(prixLitre) ||
      quantite <= 0 ||
      prixLitre <= 0
    ) {
      window.alert("Veuillez saisir des informations valides.");
      return;
    }

    if (venteEnEdition) {
      setVentes((prev) =>
        prev.map((v) =>
          v.id === venteEnEdition.id
            ? { ...v, compte, telephone, quantite, prixLitre }
            : v
        )
      );
    } else {
      const nouvelleVente: VenteHuile = {
        id: Math.max(0, ...ventes.map((v) => v.id)) + 1,
        compte,
        telephone,
        quantite,
        prixLitre,
      };
      setVentes((prev) => [...prev, nouvelleVente]);
    }

    setPage(1);
    setModalOuverte(false);
  }

  function supprimerVente(vente: VenteHuile) {
    if (!window.confirm(`Supprimer la vente du compte ${vente.compte} ?`)) return;

    setVentes((prev) => prev.filter((v) => v.id !== vente.id));
    setPage(1);
  }

  function reinitialiserFiltres() {
    setFiltreCompte("tous");
    setFiltreTelephone("tous");
    setPage(1);
  }

  function exporterCSV() {
    const lignes = [
      ["N° compte", "Téléphone", "Quantité huile (L)", "Prix litre (DT)", "Total (DT)"],
      ...ventesFiltrees.map((v) => [
        v.compte,
        v.telephone,
        String(v.quantite),
        String(v.prixLitre),
        String(v.quantite * v.prixLitre),
      ]),
    ];

    const contenu =
      "\uFEFF" +
      lignes
        .map((ligne) => ligne.map((cellule) => `"${cellule.replace(/"/g, '""')}"`).join(";"))
        .join("\r\n");

    const blob = new Blob([contenu], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "ventes-huile.csv";
    lien.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f5f7f2] p-4 text-[#243047] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* En-tête */}
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e8ede1] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-7">
          <div className="flex items-center gap-5">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#78934a] to-[#526b2e] text-white shadow-md">
              <ShoppingCart size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#18351b]">
                Vente huile
              </h1>
              <p className="mt-1 text-sm text-[#68766b]">
                Gérez les ventes d'huile et consultez vos enregistrements.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={ouvrirAjout}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#586f2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#455a24]"
          >
            <Plus size={19} />
            Ajouter une vente
          </button>
        </header>

        {/* Filtres */}
        <section className="rounded-2xl border border-[#e8ede1] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_1fr_auto]">

            <div>
              <label htmlFor="filtre-compte" className="mb-2 block text-sm font-medium text-[#29364b]">
                Compte
              </label>
              <div className="relative">
                <FileText size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#526b32]" />
                <select
                  id="filtre-compte"
                  value={filtreCompte}
                  onChange={(e) => {
                    setFiltreCompte(e.target.value);
                    setPage(1);
                  }}
                  className="h-[54px] w-full appearance-none rounded-xl border border-[#dfe6dc] bg-white pl-12 pr-10 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                >
                  <option value="tous">Tous les comptes</option>
                  {comptes.map((compte) => (
                    <option key={compte} value={compte}>{compte}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#596778]">▾</span>
              </div>
            </div>

            <div>
              <label htmlFor="filtre-telephone" className="mb-2 block text-sm font-medium text-[#29364b]">
                Téléphone
              </label>
              <div className="relative">
                <Phone size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#526b32]" />
                <select
                  id="filtre-telephone"
                  value={filtreTelephone}
                  onChange={(e) => {
                    setFiltreTelephone(e.target.value);
                    setPage(1);
                  }}
                  className="h-[54px] w-full appearance-none rounded-xl border border-[#dfe6dc] bg-white pl-12 pr-10 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                >
                  <option value="tous">Tous les numéros</option>
                  {telephones.map((telephone) => (
                    <option key={telephone} value={telephone}>{telephone}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#596778]">▾</span>
              </div>
            </div>

            <button
              type="button"
              onClick={reinitialiserFiltres}
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f4f7ef] px-5 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
            >
              <RefreshCw size={18} />
              Réinitialiser
            </button>
          </div>
        </section>

        {/* Tableau */}
        <section className="overflow-hidden rounded-2xl border border-[#e8ede1] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#526b32]">
                <ShoppingCart size={25} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#26364a]">Liste des ventes d’huile</h2>
                <p className="mt-1 text-sm text-[#839080]">
                  Consultez et gérez toutes les ventes enregistrées.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={exporterCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce6d3] bg-[#f7f9f4] px-4 py-3 text-sm font-semibold text-[#456020] transition hover:bg-[#eaf0e1]"
            >
              <Download size={18} />
              Exporter
            </button>
          </div>

          <div className="overflow-x-auto px-4 pt-3 sm:px-6">
            <table className="w-full min-w-[1000px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f1f5ed] text-left">
                  <th className="w-16 rounded-l-lg px-4 py-4 text-xs font-bold">#</th>
                  <th className="px-4 py-4 text-xs font-bold">N° compte</th>
                  <th className="px-4 py-4 text-xs font-bold">Téléphone</th>
                  <th className="px-4 py-4 text-center text-xs font-bold">Quantité huile (L)</th>
                  <th className="px-4 py-4 text-center text-xs font-bold">Prix litre (DT)</th>
                  <th className="px-4 py-4 text-center text-xs font-bold">Total (DT)</th>
                  <th className="w-32 px-3 py-4 text-center text-xs font-bold">Modifier</th>
                  <th className="w-32 rounded-r-lg px-3 py-4 text-center text-xs font-bold">Supprimer</th>
                </tr>
              </thead>

              <tbody>
                {ventesAffichees.map((vente, index) => (
                  <tr key={vente.id} className="transition hover:bg-[#f7f9f4]">
                    <td className="border-b border-[#edf0e9] px-4 py-3.5 text-sm text-[#526075]">
                      {(pageCourante - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="border-b border-[#edf0e9] px-4 py-3.5">
                      <span className="inline-flex min-w-[104px] justify-center rounded-xl bg-[#eaf0e3] px-3 py-2 font-mono text-xs font-bold text-[#3c571f]">
                        {vente.compte}
                      </span>
                    </td>

                    <td className="border-b border-[#edf0e9] px-4 py-3.5 text-sm text-[#39465b]">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf3e5] text-[#526b32]">
                          <Phone size={15} />
                        </span>
                        {vente.telephone}
                      </span>
                    </td>

                    <td className="border-b border-[#edf0e9] px-4 py-3.5 text-center">
                      <span className="inline-flex min-w-[108px] justify-center rounded-full bg-[#e8f7e8] px-4 py-2 text-sm font-semibold text-[#218333]">
                        {formatNombre(vente.quantite)}
                      </span>
                    </td>

                    <td className="border-b border-[#edf0e9] px-4 py-3.5 text-center">
                      <span className="inline-flex min-w-[105px] justify-center rounded-full bg-[#f0f2f6] px-4 py-2 text-sm font-medium text-[#344054]">
                        {formatNombre(vente.prixLitre)}
                      </span>
                    </td>

                    <td className="border-b border-[#edf0e9] px-4 py-3.5 text-center">
                      <span className="inline-flex min-w-[120px] justify-center rounded-full bg-[#e8f7e8] px-4 py-2 text-sm font-bold text-[#218333]">
                        {formatNombre(vente.quantite * vente.prixLitre)}
                      </span>
                    </td>

                    <td className="border-b border-[#edf0e9] px-3 py-3 text-center">
                      <button
                        type="button"
                        title="Modifier"
                        aria-label={`Modifier la vente ${vente.compte}`}
                        onClick={() => ouvrirModification(vente)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce4f0] bg-[#f0f4fa] text-[#34465f] transition hover:bg-[#e2eaf6]"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>

                    <td className="border-b border-[#edf0e9] px-3 py-3 text-center">
                      <button
                        type="button"
                        title="Supprimer"
                        aria-label={`Supprimer la vente ${vente.compte}`}
                        onClick={() => supprimerVente(vente)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd8d8] bg-[#fff0f0] text-[#e32626] transition hover:bg-[#ffe1e1]"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {ventesAffichees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <ShoppingCart size={30} className="mx-auto text-[#9aa58e]" />
                      <p className="mt-3 text-sm font-semibold text-[#344054]">
                        Aucune vente trouvée
                      </p>
                      <p className="mt-1 text-xs text-[#839080]">
                        Modifiez les filtres pour afficher les ventes.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <p className="text-sm text-[#526075]">
              Affichage de{" "}
              <span className="font-bold text-[#456020]">{debut}</span>
              {" à "}
              <span className="font-bold text-[#456020]">{fin}</span>
              {" sur "}
              <span className="font-bold text-[#456020]">{ventesFiltrees.length}</span>
              {" vente(s)"}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={pageCourante <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Page précédente"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e7df] text-[#526b32] hover:bg-[#f1f5ed] disabled:opacity-40"
              >
                <ChevronLeft size={19} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  aria-current={pageCourante === p ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                    pageCourante === p
                      ? "bg-[#586f2e] text-white shadow-sm"
                      : "border border-[#e1e7df] bg-white text-[#526b32] hover:bg-[#f1f5ed]"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={pageCourante >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Page suivante"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e7df] text-[#526b32] hover:bg-[#f1f5ed] disabled:opacity-40"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Formulaire d'ajout et de modification */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18251a]/40 p-4 backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOuverte(false);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf0e9] px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#26364a]">
                  {venteEnEdition ? "Modifier la vente" : "Ajouter une vente"}
                </h2>
                <p className="mt-1 text-xs text-[#839080]">
                  Renseignez les informations de la vente d'huile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOuverte(false)}
                aria-label="Fermer"
                className="rounded-lg p-2 text-[#68766b] hover:bg-[#f1f5ed]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={enregistrerVente} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Numéro de compte
                </label>
                <input
                  required
                  maxLength={30}
                  value={formulaire.compte}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, compte: e.target.value }))
                  }
                  placeholder="Ex. CPT009"
                  className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Téléphone
                </label>
                <input
                  required
                  value={formulaire.telephone}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, telephone: e.target.value }))
                  }
                  placeholder="Ex. 06 12 34 56 78"
                  className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#344054]">
                    Quantité d'huile (L)
                  </label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="any"
                    value={formulaire.quantite}
                    onChange={(e) =>
                      setFormulaire((f) => ({ ...f, quantite: e.target.value }))
                    }
                    placeholder="120"
                    className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#344054]">
                    Prix par litre (DT)
                  </label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="any"
                    value={formulaire.prixLitre}
                    onChange={(e) =>
                      setFormulaire((f) => ({ ...f, prixLitre: e.target.value }))
                    }
                    placeholder="35"
                    className="h-11 w-full rounded-xl border border-[#dfe6dc] px-3.5 text-sm outline-none focus:border-[#82995e] focus:ring-4 focus:ring-[#82995e]/10"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#f3f7ed] p-4">
                <p className="text-xs font-medium text-[#68766b]">Total calculé</p>
                <p className="mt-1 text-xl font-bold text-[#456020]">
                  {formatNombre(
                    (Number(formulaire.quantite) || 0) *
                    (Number(formulaire.prixLitre) || 0)
                  )}{" "}
                  DT
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#edf0e9] pt-5">
                <button
                  type="button"
                  onClick={() => setModalOuverte(false)}
                  className="rounded-xl border border-[#dfe6dc] px-4 py-2.5 text-sm font-semibold text-[#526075] hover:bg-[#f7f9f4]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#586f2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#455a24]"
                >
                  <Plus size={17} />
                  {venteEnEdition ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
