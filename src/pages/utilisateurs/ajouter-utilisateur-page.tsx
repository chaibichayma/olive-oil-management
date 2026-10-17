import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Eye,
  EyeOff,
  Mail,
  User,
  Hash,
  Lock,
  Save,
  Check,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export function AjouterUtilisateurPage() {
  const navigate = useNavigate();

  /* ============================================================
     FORMULAIRE
  ============================================================ */

  const [formData, setFormData] = useState({
    displayName: '',
    userName: '',
    mail: '',
    password: '',
    userCode: '',
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  /* ============================================================
     MODALE SUCCÈS
  ============================================================ */

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  /* ============================================================
     MODIFICATION DES CHAMPS
  ============================================================ */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ============================================================
     STATUT
  ============================================================ */

  const handleToggleStatus = () => {
    setFormData((current) => ({
      ...current,
      isActive: !current.isActive,
    }));
  };

  /* ============================================================
     ANNULER
  ============================================================ */

  const handleCancel = () => {
    navigate('/store-admin/users');
  };

  /* ============================================================
     ENREGISTRER
  ============================================================ */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    console.log(
      'Nouvel utilisateur :',
      formData,
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

    navigate('/store-admin/users');
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
        <div className="py-5">

          <h1 className="text-2xl font-bold text-foreground">
            Ajouter un utilisateur
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">

           

            <span>
              Paramétrage
            </span>

            <span>
              /
            </span>

            <span>
              Utilisateurs
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
                Informations utilisateur
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Veuillez remplir les informations de l'utilisateur.
              </p>

            </div>


            {/* ==================================================
                CHAMPS
            ================================================== */}

            <div className="px-6 py-6">

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                {/* ==================================================
                    NOM D'AFFICHAGE
                ================================================== */}

                <div>

                  <label
                    htmlFor="displayName"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom d'affichage
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Entrez le nom d'affichage"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    NOM UTILISATEUR
                ================================================== */}

                <div>

                  <label
                    htmlFor="userName"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom utilisateur
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Entrez le nom utilisateur"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    EMAIL
                ================================================== */}

                <div>

                  <label
                    htmlFor="mail"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="mail"
                      name="mail"
                      type="email"
                      value={formData.mail}
                      onChange={handleChange}
                      placeholder="Entrez l'adresse email"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    CODE UTILISATEUR
                ================================================== */}

                <div>

                  <label
                    htmlFor="userCode"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Code utilisateur
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="userCode"
                      name="userCode"
                      type="text"
                      value={formData.userCode}
                      onChange={handleChange}
                      placeholder="Entrez le code utilisateur"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    MOT DE PASSE
                ================================================== */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Mot de passe
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Entrez le mot de passe"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-11 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                      aria-label={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>

                  </div>

                </div>


                {/* ==================================================
                    STATUT
                ================================================== */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Statut
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className="flex items-center gap-3"
                  >

                    <span
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isActive
                          ? 'bg-[#556B2F]'
                          : 'bg-gray-300'
                      }`}
                    >

                      <span
                        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                          formData.isActive
                            ? 'translate-x-5'
                            : 'translate-x-0.5'
                        }`}
                      />

                    </span>

                    <span className="text-sm font-medium text-foreground">
                      {formData.isActive
                        ? 'Actif'
                        : 'Inactif'}
                    </span>

                  </button>

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

          {/* ==================================================
              CONTENU MODALE
          ================================================== */}

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
              Utilisateur ajouté
            </h2>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            <p className="mt-2 text-xs text-gray-500">
              L'utilisateur a été ajouté avec succès.
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