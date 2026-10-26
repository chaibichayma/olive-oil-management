
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ouvrierApi } from '@/services/api';
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CreditCard,
  Phone,
  Save,
  UserRound,
  X,
  HardHat,
  ArrowLeft,
  Hash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import type { Ouvrier } from './ouvrier-table';

type OuvrierFormData = {
  id: string;
  nom: string;
  telephone: string;
  cin: string;
  specialite: string;
  salaire: string;
  statut: string;
  dateAjout: string;
};

function toInputDate(value: string): string {
  if (!value) return '';

  // Convertir JJ/MM/AAAA en AAAA-MM-JJ pour input type="date".
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  return value;
}

function toDisplayDate(value: string): string {
  if (!value) return '';

  // Convertir AAAA-MM-JJ en JJ/MM/AAAA pour la liste.
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  return value;
}

export function AjouterOuvrierPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const ouvrier = (
    location.state as { ouvrier?: Ouvrier } | null
  )?.ouvrier;

  const isEdit = Boolean(ouvrier);

  const [formData, setFormData] = useState<OuvrierFormData>(() => ({
    id: ouvrier ? String(ouvrier.id) : '',
    nom: ouvrier?.nom ?? '',
    telephone: ouvrier?.telephone ?? '',
    cin: ouvrier?.cin ?? '',
    specialite: ouvrier?.specialite ?? '',
    salaire: ouvrier ? String(ouvrier.salaire) : '',
    statut: ouvrier?.statut ?? 'Actif',
    dateAjout: toInputDate(ouvrier?.dateAjout ?? ''),
  }));

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate('/store-admin/workers');
  };

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setError('');

  const nomComplet = formData.nom.trim().split(/\s+/);
  const firstName = nomComplet.shift() ?? '';
  const lastName = nomComplet.join(' ');

  if (!firstName || !lastName) {
    setError('Veuillez saisir le prénom et le nom de l’ouvrier.');
    return;
  }

  if (!formData.id || !formData.cin || !formData.telephone) {
    setError('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  const date = formData.dateAjout
    ? `${formData.dateAjout}T00:00:00.000Z`
    : new Date().toISOString();

  const payload = {
    functionId: 0, // À remplacer par l'identifiant réel de la fonction
    employeeId: Number(formData.id),
    lastName,
    departementId: 0, // À remplacer par l'identifiant réel du département
    dateEmbauche: date,
    dateStartContrat: date,
    dateEndContrat: date,
    matricule: Number(formData.id),
    firstName,
    statusId: 0, // À remplacer par l'identifiant réel du statut
    adresse: '',
    numeroCin: formData.cin.trim(),
    mobile: formData.telephone.trim(),
    mail: '',
    fonction: formData.specialite,
    departement: '',
    dateSuspension: null,
  };

  try {
    setSaving(true);

    await ouvrierApi.ajouter(payload);

    setShowSuccessModal(true);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'ouvrier :", err);

    setError(
      err instanceof Error
        ? err.message
        : "Impossible d'ajouter l'ouvrier.",
    );
  } finally {
    setSaving(false);
  }
};

  const handleSuccessOk = () => {
  setShowSuccessModal(false);

  navigate('/store-admin/workers', {
    state: { refreshOuvriers: true },
  });
};

  return (
    <>
      <Container>
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3E6] sm:size-16">
              <HardHat className="size-7 text-[#556B2F] sm:size-8" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl">
                {isEdit ? 'Modifier un ouvrier' : 'Ajouter un ouvrier'}
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {isEdit
                  ? 'Modifiez les informations de cet ouvrier.'
                  : 'Renseignez les informations pour créer un nouvel ouvrier.'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-10 shrink-0 gap-2 self-start rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-medium text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] sm:self-center"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Button>
        </div>
      </Container>

      <Container>
        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-border bg-white shadow-sm">
            {error && (
  <div
    role="alert"
    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
  >
    {error}
  </div>
)}
            <div className="flex flex-col gap-3 border-b border-[#E9EDE4] bg-[#FCFDFB] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#1E293B]">
                  Informations de l'ouvrier
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isEdit
                    ? 'Modifiez les champs nécessaires puis enregistrez.'
                    : 'Veuillez renseigner les informations nécessaires à la création de l’ouvrier.'}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 px-3 py-2">
                <span className="text-sm font-bold text-red-500">*</span>
                <span className="text-xs font-medium text-slate-500">
                  Champs obligatoires
                </span>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="id" className="text-sm font-medium text-foreground">
                    ID de l'ouvrier <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="id"
                      name="id"
                      type="number"
                      min="1"
                      step="1"
                      required
                      disabled={isEdit}
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Ex. : 101"
                      className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nom" className="mb-2 block text-sm font-medium text-foreground">
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

                <div>
                  <label htmlFor="telephone" className="mb-2 block text-sm font-medium text-foreground">
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
                      pattern="[0-9]{8}"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cin" className="mb-2 block text-sm font-medium text-foreground">
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
                      pattern="[0-9]{8}"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="specialite" className="mb-2 block text-sm font-medium text-foreground">
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
                      <option value="">Sélectionnez une spécialité</option>
                      <option value="Manutention">Manutention</option>
                      <option value="Pressage">Pressage</option>
                      <option value="Entretien">Entretien</option>
                      <option value="Contrôle qualité">Contrôle qualité</option>
                      <option value="Réception">Réception</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="salaire" className="mb-2 block text-sm font-medium text-foreground">
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

                <div>
                  <label htmlFor="statut" className="mb-2 block text-sm font-medium text-foreground">
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

                <div>
                  <label htmlFor="dateAjout" className="mb-2 block text-sm font-medium text-foreground">
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
  disabled={saving}
  className="h-10 min-w-[125px] gap-2 bg-[#556B2F] hover:bg-[#465A27] disabled:opacity-60"
>
  <Save className="size-4" />
  {saving
    ? 'Enregistrement...'
    : isEdit
      ? 'Enregistrer les modifications'
      : 'Enregistrer'}
</Button>
            </div>
          </div>
        </form>
      </Container>

      {/* MODALE SUCCÈS */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={handleSuccessOk}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="relative w-full max-w-[380px] rounded-2xl bg-white px-7 py-6 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleSuccessOk}
              className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-700"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#eef4e6]">
                <Check className="size-6 text-[#556B2F]" />
              </div>
            </div>

            <h2 id="success-title" className="mt-3 text-lg font-bold text-gray-900">
              {isEdit ? 'Ouvrier modifié' : 'Ouvrier ajouté'}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {isEdit
                ? "Les informations de l'ouvrier ont été mises à jour avec succès."
                : "L'ouvrier a été ajouté avec succès."}
            </p>

            <div className="mt-5 flex justify-center">
              <Button
                type="button"
                onClick={handleSuccessOk}
                className="h-9 min-w-[80px] bg-[#556B2F] text-sm text-white hover:bg-[#465A27]"
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
