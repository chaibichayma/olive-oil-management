import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function AjouterOuvrierPage() {
  const navigate = useNavigate();

  /* ============================================================
     FORMULAIRE
  ============================================================ */

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

  /* ============================================================
     MODALE SUCCÈS
  ============================================================ */

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  /* ============================================================
     MODIFICATION DES CHAMPS
  ============================================================ */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ============================================================
     ANNULER
  ============================================================ */

  const handleCancel = () => {
    navigate('/store-admin/workers');
  };

  /* ============================================================
     ENREGISTRER
  ============================================================ */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nouvelOuvrier = {
      nom: formData.nom,
      telephone: formData.telephone,
      cin: formData.cin,
      specialite: formData.specialite,
      salaire: Number(formData.salaire),
      statut: formData.statut,
      dateAjout: formData.dateAjout,
    };

    console.log(
      'Nouvel ouvrier :',
      nouvelOuvrier,
    );

    /*
      Plus tard :
      appel API / Supabase ici
    */

    setShowSuccessModal(true);
  };

  /* ============================================================
     FERMER MODALE SUCCÈS
  ============================================================ */

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  /* ============================================================
     BOUTON OK
  ============================================================ */

  const handleSuccessOk = () => {
    setShowSuccessModal(false);

    navigate('/store-admin/workers');
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* ========================================================
          HEADER DE PAGE
      ======================================================== */}

      
<Container>
  <div className="flex flex-col gap-4 py-4 sm:py-5 sm:flex-row sm:items-center sm:justify-between">
    {/* ICÔNE, TITRE ET SOUS-TITRE */}
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3E6] sm:size-16">
        <HardHat className="size-7 text-[#556B2F] sm:size-8" />
      </div>

      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl">
          Ajouter un ouvrier
        </h1>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Renseignez les informations pour créer un nouvel ouvrier.
        </p>
      </div>
    </div>

    {/* BOUTON RETOUR */}
    <Button
      type="button"
      variant="outline"
      onClick={() => navigate('/store-admin/workers')}
      className="h-10 shrink-0 gap-2 self-start rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-medium text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
    >
      <ArrowLeft className="size-4" />
      Retour à la liste
    </Button>
  </div>
</Container>


      {/* ========================================================
          FORMULAIRE
      ======================================================== */}

      <Container>
        <form onSubmit={handleSubmit}>

          <div className="rounded-xl border border-border bg-white shadow-sm">

            {/* ==================================================
                HEADER CARD
            ================================================== */}

            <div className="flex flex-col gap-3 border-b border-[#E9EDE4] bg-[#FCFDFB] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
  {/* TITRE ET DESCRIPTION */}
  <div>
    <h2 className="text-lg font-bold tracking-tight text-[#1E293B]">
      Informations de l'ouvrier
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Veuillez renseigner les informations nécessaires à la création de l'ouvrier.
    </p>
  </div>

  {/* CHAMPS OBLIGATOIRES */}
  <div className="flex shrink-0 items-center gap-1.5 self-start  px-3 py-2 sm:self-center">
    <span className="text-sm font-bold text-red-500">*</span>
    <span className="text-xs font-medium text-slate-500">
      Champs obligatoires
    </span>
  </div>
</div>

            {/* ==================================================
                CHAMPS
            ================================================== */}

            <div className="px-6 py-6">

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
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

                {/* ==================================================
                    NOM COMPLET
                ================================================== */}

                <div>

                  <label
                    htmlFor="nom"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom complet

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex : Mohamed Ali"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    TÉLÉPHONE
                ================================================== */}

                <div>

                  <label
                    htmlFor="telephone"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Téléphone

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Ex : 22123456"
                      maxLength={8}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    CIN
                ================================================== */}

                <div>

                  <label
                    htmlFor="cin"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    CIN

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <CreditCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="cin"
                      name="cin"
                      type="text"
                      value={formData.cin}
                      onChange={handleChange}
                      placeholder="Ex : 12345678"
                      maxLength={8}
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    SPÉCIALITÉ
                ================================================== */}

                <div>

                  <label
                    htmlFor="specialite"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Spécialité

                    <span className="ml-1 text-red-500">
                      *
                    </span>
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

                      <option value="Manutention">
                        Manutention
                      </option>

                      <option value="Pressage">
                        Pressage
                      </option>

                      <option value="Entretien">
                        Entretien
                      </option>

                      <option value="Contrôle qualité">
                        Contrôle qualité
                      </option>

                      <option value="Réception">
                        Réception
                      </option>

                    </select>

                  </div>

                </div>


                {/* ==================================================
                    SALAIRE
                ================================================== */}

                <div>

                  <label
                    htmlFor="salaire"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Salaire

                    <span className="ml-1 text-red-500">
                      *
                    </span>
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
                      placeholder="Ex : 50.00"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background px-3 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    STATUT
                ================================================== */}

                <div>

                  <label
                    htmlFor="statut"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Statut

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="Actif">
                      Actif
                    </option>

                    <option value="En congé">
                      En congé
                    </option>

                    <option value="Inactif">
                      Inactif
                    </option>

                  </select>

                </div>


                {/* ==================================================
                    DATE D'AJOUT
                ================================================== */}

                <div>

                  <label
                    htmlFor="dateAjout"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Date d'ajout

                    <span className="ml-1 text-red-500">
                      *
                    </span>
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


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">

              {/* ANNULER */}

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[100px]"
              >
                Annuler
              </Button>


              {/* ENREGISTRER */}

              <Button
                type="submit"
                className="h-10 min-w-[125px] bg-[#556B2F] hover:bg-[#465A27]"
              >

                <Save className="size-4" />

                Enregistrer

              </Button>

            </div>

          </div>

        </form>
      </Container>


      {/* ========================================================
          MODALE SUCCÈS
      ======================================================== */}

      {showSuccessModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={handleCloseSuccess}
        >

          <div
            className="relative w-full max-w-[380px] rounded-lg bg-white px-7 py-5 text-center shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================
                FERMER
            ================================================== */}

            <button
              type="button"
              onClick={handleCloseSuccess}
              className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-700"
              aria-label="Fermer"
            >

              <X className="size-4" />

            </button>


            {/* ==================================================
                ICÔNE SUCCÈS
            ================================================== */}

            <div className="flex justify-center">

              <div className="flex size-12 items-center justify-center rounded-full bg-green-50">

                <Check className="size-6 text-[#556B2F]" />

              </div>

            </div>


            {/* ==================================================
                TITRE
            ================================================== */}

            <h2 className="mt-3 text-sm font-bold text-gray-900">
              Ouvrier ajouté
            </h2>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            <p className="mt-2 text-xs text-gray-500">
              L'ouvrier a été ajouté avec succès.
            </p>


            {/* ==================================================
                BOUTON OK
            ================================================== */}

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