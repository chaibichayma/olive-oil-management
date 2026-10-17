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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export function AjouterOuvrierPage() {
  const navigate = useNavigate();

  /* ============================================================
     FORMULAIRE
  ============================================================ */

  const [formData, setFormData] = useState({
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
  <div className="min-w-0 py-4 sm:py-5">
    <h1 className="text-xl font-bold text-foreground sm:text-2xl">
      Ajouter un ouvrier
    </h1>

    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
      <span>Accueil</span>
      <span>/</span>
      <span>Paramétrage</span>
      <span>/</span>
      <span>Gestion des ouvriers</span>
      <span>/</span>
      <span className="font-medium text-foreground">
        Ajouter
      </span>
    </div>
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

            <div className="border-b border-border px-6 py-5">

              <h2 className="text-lg font-bold text-foreground">
                Informations de l'ouvrier
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Veuillez remplir les informations de l'ouvrier.
              </p>

            </div>


            {/* ==================================================
                CHAMPS
            ================================================== */}

            <div className="px-6 py-6">

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

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