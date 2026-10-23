
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CreditCard,
  Hash,
  HardHat,
  Phone,
  Save,
  UserRound,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

/* ============================================================
   TYPE OUVRIER
============================================================ */

interface Ouvrier {
  id: number;
  nom: string;
  telephone: string;
  cin: string;
  specialite: string;
  salaire: number;
  statut: string;
  dateAjout: string;
}

/* ============================================================
   DONNÉES STATIQUES
   À remplacer plus tard par les données de l'API / Supabase.
============================================================ */

const defaultOuvriers: Ouvrier[] = [
  {
    id: 1,
    nom: 'Mohamed Ali',
    telephone: '22123456',
    cin: '12345678',
    specialite: 'Manutention',
    salaire: 50,
    statut: 'Actif',
    dateAjout: '15/09/2026',
  },
  {
    id: 2,
    nom: 'Youssef Saidi',
    telephone: '22234567',
    cin: '87654321',
    specialite: 'Pressage',
    salaire: 60,
    statut: 'Actif',
    dateAjout: '14/09/2026',
  },
  {
    id: 3,
    nom: 'Khaled Amri',
    telephone: '22345678',
    cin: '11223344',
    specialite: 'Entretien',
    salaire: 55,
    statut: 'En congé',
    dateAjout: '12/09/2026',
  },
  {
    id: 4,
    nom: 'Nour Reda',
    telephone: '23456789',
    cin: '44332211',
    specialite: 'Manutention',
    salaire: 50,
    statut: 'Actif',
    dateAjout: '10/09/2026',
  },
  {
    id: 5,
    nom: 'Salem Ben Khaled',
    telephone: '22567890',
    cin: '55667788',
    specialite: 'Pressage',
    salaire: 60,
    statut: 'Actif',
    dateAjout: '08/09/2026',
  },
  {
    id: 6,
    nom: 'Fathi Abdelli',
    telephone: '21678901',
    cin: '99887766',
    specialite: 'Contrôle qualité',
    salaire: 65,
    statut: 'Actif',
    dateAjout: '05/09/2026',
  },
  {
    id: 7,
    nom: 'Hichem Mansouri',
    telephone: '22789012',
    cin: '66778899',
    specialite: 'Entretien',
    salaire: 55,
    statut: 'Inactif',
    dateAjout: '02/09/2026',
  },
  {
    id: 8,
    nom: 'Adel Mrad',
    telephone: '23890123',
    cin: '33445566',
    specialite: 'Manutention',
    salaire: 50,
    statut: 'Actif',
    dateAjout: '01/09/2026',
  },
  {
    id: 9,
    nom: 'Sami Trabelsi',
    telephone: '22990123',
    cin: '77889900',
    specialite: 'Pressage',
    salaire: 60,
    statut: 'Actif',
    dateAjout: '29/08/2026',
  },
  {
    id: 10,
    nom: 'Ahmed Jaziri',
    telephone: '22112233',
    cin: '88990011',
    specialite: 'Entretien',
    salaire: 55,
    statut: 'Actif',
    dateAjout: '27/08/2026',
  },
  {
    id: 11,
    nom: 'Walid Ben Amor',
    telephone: '22334455',
    cin: '99001122',
    specialite: 'Manutention',
    salaire: 50,
    statut: 'En congé',
    dateAjout: '25/08/2026',
  },
  {
    id: 12,
    nom: 'Amine Gharbi',
    telephone: '22556677',
    cin: '10112233',
    specialite: 'Contrôle qualité',
    salaire: 65,
    statut: 'Actif',
    dateAjout: '22/08/2026',
  },
];

/* ============================================================
   CONVERSION DATE : DD/MM/YYYY → YYYY-MM-DD
============================================================ */

const convertDateToInput = (date: string): string => {
  const parts = date.split('/');

  if (parts.length !== 3) {
    return date;
  }

  const [day, month, year] = parts;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/* ============================================================
   CONVERSION DATE : YYYY-MM-DD → DD/MM/YYYY
============================================================ */

const convertDateToDisplay = (date: string): string => {
  const parts = date.split('-');

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};

/* ============================================================
   PAGE MODIFIER OUVRIER
============================================================ */

export function ModifierOuvrierPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  /* ==========================================================
     FORMULAIRE
  ========================================================== */

  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    telephone: '',
    cin: '',
    specialite: '',
    salaire: '',
    statut: 'Actif',
    dateAjout: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ouvrierNotFound, setOuvrierNotFound] = useState(false);

  /* ==========================================================
     CHARGER LES DONNÉES DE L'OUVRIER
  ========================================================== */

  useEffect(() => {
    if (!id) {
      setOuvrierNotFound(true);
      return;
    }

    const ouvrierId = Number(id);

    const ouvrier = defaultOuvriers.find(
      (item) => item.id === ouvrierId,
    );

    if (!ouvrier) {
      setOuvrierNotFound(true);
      return;
    }

    setFormData({
      id: ouvrier.id.toString(),
      nom: ouvrier.nom,
      telephone: ouvrier.telephone,
      cin: ouvrier.cin,
      specialite: ouvrier.specialite,
      salaire: ouvrier.salaire.toString(),
      statut: ouvrier.statut,
      dateAjout: convertDateToInput(ouvrier.dateAjout),
    });

    setOuvrierNotFound(false);
  }, [id]);

  /* ==========================================================
     MODIFICATION DES CHAMPS
  ========================================================== */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ==========================================================
     ANNULER
  ========================================================== */

  const handleCancel = () => {
    navigate('/store-admin/workers');
  };

  /* ==========================================================
     METTRE À JOUR
  ========================================================== */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ouvrierModifie: Ouvrier = {
      id: Number(formData.id),
      nom: formData.nom.trim(),
      telephone: formData.telephone,
      cin: formData.cin,
      specialite: formData.specialite,
      salaire: Number(formData.salaire),
      statut: formData.statut,
      dateAjout: convertDateToDisplay(formData.dateAjout),
    };

    console.log('Ouvrier modifié :', ouvrierModifie);

    /*
      À connecter plus tard à l'API ou à Supabase.
      Pour le moment, les modifications ne sont pas persistées.
    */

    setShowSuccessModal(true);
  };

  /* ==========================================================
     FERMER LA MODALE
  ========================================================== */

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate('/store-admin/workers');
  };

  /* ==========================================================
     OUVRIER INTROUVABLE
  ========================================================== */

  if (ouvrierNotFound) {
    return (
      <Container>
        <div className="py-12 text-center">
          <h1 className="text-xl font-bold text-[#1E293B]">
            Ouvrier introuvable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Aucun ouvrier ne correspond à cet identifiant.
          </p>

          <Button
            type="button"
            onClick={handleCancel}
            className="mt-5 gap-2 bg-[#556B2F] hover:bg-[#465A27]"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Button>
        </div>
      </Container>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* HEADER DE PAGE */}

      <Container>
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3E6] sm:size-16">
              <HardHat className="size-7 text-[#556B2F] sm:size-8" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl">
                Modifier un ouvrier
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Modifiez les informations de l'ouvrier sélectionné.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-10 shrink-0 gap-2 self-start rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-medium text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Button>
        </div>
      </Container>

      {/* FORMULAIRE */}

      <Container>
        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-border bg-white shadow-sm">
            {/* HEADER CARD */}

            <div className="flex flex-col gap-3 border-b border-[#E9EDE4] bg-[#FCFDFB] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#1E293B]">
                  Informations de l'ouvrier
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Modifiez les informations nécessaires, puis enregistrez les changements.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 self-start px-3 py-2 sm:self-center">
                <span className="text-sm font-bold text-red-500">*</span>
                <span className="text-xs font-medium text-slate-500">
                  Champs obligatoires
                </span>
              </div>
            </div>

            {/* CHAMPS */}

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                {/* ID */}

                <div className="space-y-2">
                  <label
                    htmlFor="id"
                    className="text-sm font-medium text-foreground"
                  >
                    ID de l'ouvrier <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Hash
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      id="id"
                      name="id"
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Ex. : 101"
                      className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20"
                    />
                  </div>
                </div>

                {/* NOM COMPLET */}

                <div>
                  <label
                    htmlFor="nom"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom complet <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex. : Mohamed Ali"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* TÉLÉPHONE */}

                <div>
                  <label
                    htmlFor="telephone"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Téléphone <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Ex. : 22123456"
                      maxLength={8}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* CIN */}

                <div>
                  <label
                    htmlFor="cin"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    CIN <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="cin"
                      name="cin"
                      type="text"
                      value={formData.cin}
                      onChange={handleChange}
                      placeholder="Ex. : 12345678"
                      maxLength={8}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* SPÉCIALITÉ */}

                <div>
                  <label
                    htmlFor="specialite"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Spécialité <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <select
                      id="specialite"
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      required
                      className="h-11 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    >
                      <option value="">
                        Sélectionnez une spécialité
                      </option>
                      <option value="Manutention">Manutention</option>
                      <option value="Pressage">Pressage</option>
                      <option value="Entretien">Entretien</option>
                      <option value="Contrôle qualité">Contrôle qualité</option>
                      <option value="Réception">Réception</option>
                    </select>
                  </div>
                </div>

                {/* SALAIRE */}

                <div>
                  <label
                    htmlFor="salaire"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Salaire <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="salaire"
                      name="salaire"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.salaire}
                      onChange={handleChange}
                      placeholder="Ex. : 50.00"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>
                  </div>
                </div>

                {/* STATUT */}

                <div>
                  <label
                    htmlFor="statut"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Statut <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En congé">En congé</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>

                {/* DATE D'AJOUT */}

                <div>
                  <label
                    htmlFor="dateAjout"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date d'ajout <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="dateAjout"
                      name="dateAjout"
                      type="date"
                      value={formData.dateAjout}
                      onChange={handleChange}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[100px]"
              >
                Annuler
              </Button>

              <Button
                type="submit"
                className="h-10 min-w-[145px] gap-2 bg-[#556B2F] hover:bg-[#465A27]"
              >
                <Save className="size-4" />
                Mettre à jour
              </Button>
            </div>
          </div>
        </form>
      </Container>

      {/* MODALE DE SUCCÈS */}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={handleCloseSuccess}
        >
          <div
            className="relative w-full max-w-[380px] rounded-lg bg-white px-7 py-5 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseSuccess}
              className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-700"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-50">
                <Check className="size-6 text-[#556B2F]" />
              </div>
            </div>

            <h2 className="mt-3 text-sm font-bold text-gray-900">
              Modifications enregistrées
            </h2>

            <p className="mt-2 text-xs text-gray-500">
              Les informations de l'ouvrier ont été mises à jour avec succès.
            </p>

            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                onClick={handleSuccessOk}
                className="h-9 min-w-[70px] bg-[#556B2F] text-xs text-white hover:bg-[#465A27]"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
