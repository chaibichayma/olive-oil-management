import { useEffect, useState } from 'react';

import {
  Check,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

/* ============================================================
   TYPE UTILISATEUR
============================================================ */

interface Utilisateur {
  id: number;
  displayName: string;
  userName: string;
  mail: string;
  password: string;
  userCode: string;
  isActive: boolean;
}

/* ============================================================
   DONNÉES STATIQUES
============================================================ */

const utilisateurs: Utilisateur[] = [
  {
    id: 1,
    displayName: 'Ayah Ben Ali',
    userName: 'ayah',
    mail: 'ayah@example.com',
    password: 'demo123',
    userCode: 'U001',
    isActive: true,
  },
  {
    id: 2,
    displayName: 'Mohamed',
    userName: 'mohamed',
    mail: 'mohamed@example.com',
    password: 'demo123',
    userCode: 'U002',
    isActive: true,
  },
  {
    id: 3,
    displayName: 'Salma',
    userName: 'salma',
    mail: 'salma@example.com',
    password: 'demo123',
    userCode: 'U003',
    isActive: false,
  },
  {
    id: 4,
    displayName: 'Youssef',
    userName: 'youssef',
    mail: 'youssef@example.com',
    password: 'demo123',
    userCode: 'U004',
    isActive: true,
  },
  {
    id: 5,
    displayName: 'Amine',
    userName: 'amine',
    mail: 'amine@example.com',
    password: 'demo123',
    userCode: 'U005',
    isActive: true,
  },
  {
    id: 6,
    displayName: 'Sarra',
    userName: 'sarra',
    mail: 'sarra@example.com',
    password: 'demo123',
    userCode: 'U006',
    isActive: false,
  },
  {
    id: 7,
    displayName: 'Houssem',
    userName: 'houssem',
    mail: 'houssem@example.com',
    password: 'demo123',
    userCode: 'U007',
    isActive: true,
  },
  {
    id: 8,
    displayName: 'Mariem',
    userName: 'mariem',
    mail: 'mariem@example.com',
    password: 'demo123',
    userCode: 'U008',
    isActive: true,
  },
  {
    id: 9,
    displayName: 'Ahmed',
    userName: 'ahmed',
    mail: 'ahmed@example.com',
    password: 'demo123',
    userCode: 'U009',
    isActive: true,
  },
  {
    id: 10,
    displayName: 'Ines',
    userName: 'ines',
    mail: 'ines@example.com',
    password: 'demo123',
    userCode: 'U010',
    isActive: false,
  },
  {
    id: 11,
    displayName: 'Omar',
    userName: 'omar',
    mail: 'omar@example.com',
    password: 'demo123',
    userCode: 'U011',
    isActive: true,
  },
  {
    id: 12,
    displayName: 'Nour',
    userName: 'nour',
    mail: 'nour@example.com',
    password: 'demo123',
    userCode: 'U012',
    isActive: true,
  },
];

/* ============================================================
   TYPE FORMULAIRE
============================================================ */

interface UtilisateurFormData {
  displayName: string;
  userName: string;
  mail: string;
  password: string;
  userCode: string;
  isActive: string;
}

/* ============================================================
   PAGE MODIFIER UTILISATEUR
============================================================ */

export function ModifierUtilisateurPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [formData, setFormData] =
    useState<UtilisateurFormData>({
      displayName: '',
      userName: '',
      mail: '',
      password: '',
      userCode: '',
      isActive: 'true',
    });

  /* ==========================================================
     CHARGER L'UTILISATEUR
  ========================================================== */

  useEffect(() => {
    if (!id) {
      navigate('/store-admin/users');
      return;
    }

    const utilisateur = utilisateurs.find(
      (item) => item.id.toString() === id,
    );

    if (!utilisateur) {
      navigate('/store-admin/users');
      return;
    }

    setFormData({
      displayName: utilisateur.displayName,
      userName: utilisateur.userName,
      mail: utilisateur.mail,
      password: utilisateur.password,
      userCode: utilisateur.userCode,
      isActive: utilisateur.isActive
        ? 'true'
        : 'false',
    });
  }, [id, navigate]);

  /* ==========================================================
     HANDLE CHANGE
  ========================================================== */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================================
     ANNULER
  ========================================================== */

  const handleCancel = () => {
    navigate('/store-admin/users');
  };

  /* ==========================================================
     ENREGISTRER
  ========================================================== */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const utilisateurModifie = {
      id: Number(id),
      displayName: formData.displayName,
      userName: formData.userName,
      mail: formData.mail,
      password: formData.password,
      userCode: formData.userCode,
      isActive: formData.isActive === 'true',
    };

    console.log(
      'Utilisateur modifié :',
      utilisateurModifie,
    );

    setShowSuccessModal(true);
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <Container>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-6 flex flex-col gap-1">

          <h1 className="text-xl font-semibold text-[#172033]">
            Modifier un utilisateur
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#64748b]">

            <span>
              Accueil
            </span>

            <span>
              /
            </span>

            <span>
              Paramétrage
            </span>

            <span>
              /
            </span>

            <span>
              Utilisateurs
            </span>

            <span>
              /
            </span>

            <span className="font-medium text-[#556B2F]">
              Modifier
            </span>

          </div>

        </div>

        {/* ====================================================
            CARD
        ==================================================== */}

        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-white shadow-sm">

          {/* ==================================================
              HEADER CARD
          ================================================== */}

          <div className="border-b border-border px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-lg bg-[#eef4e6]">

                <Users className="size-5 text-[#556B2F]" />

              </div>

              <div>

                <h2 className="text-base font-semibold text-[#172033]">
                  Informations de l'utilisateur
                </h2>

                <p className="mt-0.5 text-sm text-[#64748b]">
                  Modifiez les informations de l'utilisateur sélectionné.
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              FORMULAIRE
          ================================================== */}

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-6 md:grid-cols-2">

              {/* =================================================
                  NOM D'AFFICHAGE
              ================================================= */}

              <div>

                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Nom d'affichage
                </label>

                <div className="relative">

                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    placeholder="Ex : Ayah Ben Ali"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>

              </div>

              {/* =================================================
                  NOM UTILISATEUR
              ================================================= */}

              <div>

                <label
                  htmlFor="userName"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Nom utilisateur
                </label>

                <div className="relative">

                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="Ex : ayah"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  htmlFor="mail"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Adresse email
                </label>

                <div className="relative">

                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                  <input
                    id="mail"
                    name="mail"
                    type="email"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                    placeholder="Ex : ayah@example.com"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>

              </div>

              {/* =================================================
                  CODE UTILISATEUR
              ================================================= */}

              <div>

                <label
                  htmlFor="userCode"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Code utilisateur
                </label>

                <div className="relative">

                  <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                  <input
                    id="userCode"
                    name="userCode"
                    type="text"
                    value={formData.userCode}
                    onChange={handleChange}
                    required
                    placeholder="Ex : U001"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>

              </div>

              {/* =================================================
                  MOT DE PASSE
              ================================================= */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Mot de passe
                </label>

                <div className="relative">

                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Mot de passe"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />

                </div>

              </div>

              {/* =================================================
                  STATUT
              ================================================= */}

              <div>

                <label
                  htmlFor="isActive"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Statut
                </label>

                <div className="relative">

                  <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                  <select
                    id="isActive"
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleChange}
                    required
                    className="h-11 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="true">
                      Actif
                    </option>

                    <option value="false">
                      Inactif
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            
<div className="flex flex-col-reverse gap-2 border-t border-border px-3 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
  <Button
    type="button"
    variant="outline"
    onClick={handleCancel}
    className="h-11 w-full rounded-md border-[#dfe4e9] px-5 text-[#475569] hover:bg-[#f8fafc] sm:w-auto"
  >
    <X className="size-4 shrink-0" />
    Annuler
  </Button>

  <Button
    type="submit"
    className="h-11 w-full rounded-md bg-[#556B2F] px-5 font-semibold text-white shadow-sm transition-all hover:bg-[#465A27] hover:shadow-md sm:w-auto"
  >
    <Save className="size-4 shrink-0" />
    Enregistrer les modifications
  </Button>
</div>

</form>
</div>


      </Container>

      {/* ======================================================
          MODAL SUCCÈS
      ====================================================== */}

      {showSuccessModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-[380px] rounded-xl bg-white p-6 shadow-2xl">

            <div className="flex flex-col items-center text-center">

              {/* =================================================
                  ICÔNE
              ================================================= */}

              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#eef4e6]">

                <div className="flex size-9 items-center justify-center rounded-full bg-[#556B2F]">

                  <Check className="size-5 text-white" />

                </div>

              </div>

              {/* =================================================
                  TITRE
              ================================================= */}

              <h3 className="text-lg font-semibold text-[#172033]">
                Utilisateur modifié
              </h3>

              {/* =================================================
                  MESSAGE
              ================================================= */}

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Les informations de l'utilisateur ont été modifiées avec succès.
              </p>

              {/* =================================================
                  OK
              ================================================= */}

              <Button
                type="button"
                onClick={() =>
                  navigate('/store-admin/users')
                }
                className="mt-5 h-10 min-w-[100px] rounded-md bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27]"
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