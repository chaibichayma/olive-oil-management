
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
  ChevronRight,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

interface Utilisateur {
  id: number;
  displayName: string;
  userName: string;
  mail: string;
  password: string;
  userCode: string;
  isActive: boolean;
}

const utilisateursDemo: Utilisateur[] = [
  { id: 1, displayName: 'Ayah Ben Ali', userName: 'ayah', mail: 'ayah@example.com', password: 'demo123', userCode: 'U001', isActive: true },
  { id: 2, displayName: 'Mohamed', userName: 'mohamed', mail: 'mohamed@example.com', password: 'demo123', userCode: 'U002', isActive: true },
  { id: 3, displayName: 'Salma', userName: 'salma', mail: 'salma@example.com', password: 'demo123', userCode: 'U003', isActive: false },
  { id: 4, displayName: 'Youssef', userName: 'youssef', mail: 'youssef@example.com', password: 'demo123', userCode: 'U004', isActive: true },
  { id: 5, displayName: 'Amine', userName: 'amine', mail: 'amine@example.com', password: 'demo123', userCode: 'U005', isActive: true },
  { id: 6, displayName: 'Sarra', userName: 'sarra', mail: 'sarra@example.com', password: 'demo123', userCode: 'U006', isActive: false },
  { id: 7, displayName: 'Houssem', userName: 'houssem', mail: 'houssem@example.com', password: 'demo123', userCode: 'U007', isActive: true },
  { id: 8, displayName: 'Mariem', userName: 'mariem', mail: 'mariem@example.com', password: 'demo123', userCode: 'U008', isActive: true },
  { id: 9, displayName: 'Ahmed', userName: 'ahmed', mail: 'ahmed@example.com', password: 'demo123', userCode: 'U009', isActive: true },
  { id: 10, displayName: 'Ines', userName: 'ines', mail: 'ines@example.com', password: 'demo123', userCode: 'U010', isActive: false },
  { id: 11, displayName: 'Omar', userName: 'omar', mail: 'omar@example.com', password: 'demo123', userCode: 'U011', isActive: true },
  { id: 12, displayName: 'Nour', userName: 'nour', mail: 'nour@example.com', password: 'demo123', userCode: 'U012', isActive: true },
];

interface UtilisateurFormData {
  displayName: string;
  userName: string;
  mail: string;
  password: string;
  userCode: string;
  isActive: string;
}

const STORAGE_KEY = 'utilisateurs';

export function ModifierUtilisateurPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState<UtilisateurFormData>({
    displayName: '',
    userName: '',
    mail: '',
    password: '',
    userCode: '',
    isActive: 'true',
  });

  const getUtilisateurs = (): Utilisateur[] => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (storedData) {
        const parsedData: unknown = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          return parsedData as Utilisateur[];
        }
      }
    } catch (error) {
      console.error('Erreur de lecture des utilisateurs :', error);
    }

    return utilisateursDemo;
  };

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const utilisateur = getUtilisateurs().find(
      (item) => String(item.id) === id,
    );

    if (!utilisateur) {
      setNotFound(true);
      return;
    }

    setFormData({
      displayName: utilisateur.displayName,
      userName: utilisateur.userName,
      mail: utilisateur.mail,
      password: utilisateur.password,
      userCode: utilisateur.userCode,
      isActive: utilisateur.isActive ? 'true' : 'false',
    });
  }, [id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage('');
  };

  const handleCancel = () => {
    navigate('/store-admin/users');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!id) {
      setErrorMessage('Identifiant utilisateur introuvable.');
      return;
    }

    const utilisateurs = getUtilisateurs();
    const utilisateurExistant = utilisateurs.find(
      (item) => String(item.id) === id,
    );

    if (!utilisateurExistant) {
      setErrorMessage("L'utilisateur sélectionné n'existe pas.");
      return;
    }

    const doublon = utilisateurs.find(
      (item) =>
        String(item.id) !== id &&
        (
          item.userName.toLowerCase() === formData.userName.trim().toLowerCase() ||
          item.mail.toLowerCase() === formData.mail.trim().toLowerCase() ||
          item.userCode.toLowerCase() === formData.userCode.trim().toLowerCase()
        ),
    );

    if (doublon) {
      setErrorMessage(
        'Ce nom utilisateur, cette adresse email ou ce code est déjà utilisé.',
      );
      return;
    }

    const utilisateurModifie: Utilisateur = {
      id: utilisateurExistant.id,
      displayName: formData.displayName.trim(),
      userName: formData.userName.trim(),
      mail: formData.mail.trim(),
      password: formData.password,
      userCode: formData.userCode.trim(),
      isActive: formData.isActive === 'true',
    };

    const utilisateursMisAJour = utilisateurs.map((item) =>
      String(item.id) === id ? utilisateurModifie : item,
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(utilisateursMisAJour),
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erreur de sauvegarde :', error);
      setErrorMessage('Impossible de sauvegarder les modifications.');
    }
  };

  if (notFound) {
    return (
      <Container>
        <div className="w-full py-16 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#eef4e6]">
            <UserRound className="size-6 text-[#556B2F]" />
          </div>

          <h1 className="text-xl font-semibold text-[#172033]">
            Utilisateur introuvable
          </h1>

          <p className="mt-2 text-sm text-[#64748b]">
            L'utilisateur demandé n'existe pas ou n'est plus disponible.
          </p>

          <Button
            type="button"
            onClick={handleCancel}
            className="mt-6 h-10 bg-[#556B2F] text-white hover:bg-[#465A27]"
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour à la liste
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        {/* LARGEUR COMPLÈTE : AUCUN MAX-W LIMITANT */}

        <div className="w-full max-w-none pb-10">

          {/* HEADER */}
{/* HEADER */}
<header className="mb-8 w-full border-b border-[#e8ebdf] pb-8">
  {/* Fil d'Ariane + badge */}
    

  {/* Titre + description + retour */}
  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
    <div className="flex items-start gap-5">
      <div className="flex size-[60px] shrink-0 items-center justify-center rounded-2xl border border-[#dce5ce] bg-[#eef4e6]">
        <UserRound className="size-7 text-[#556B2F]" />
      </div>

      <div>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-[#172033]">
          Modifier un utilisateur
        </h1>

        <p className="mt-3 text-base leading-6 text-[#64748b]">
          Mettez à jour les informations du compte utilisateur et ses
          paramètres d'accès.
        </p>
      </div>
    </div>

    <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="h-12 shrink-0 rounded-xl border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] shadow-sm transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
>
  <ArrowLeft className="mr-3 size-4 text-[#718747]" />
  Retour à la liste
</Button>
  </div>
</header>

          {/* FORMULAIRE SUR TOUTE LA LARGEUR */}

          <div className="w-full overflow-hidden rounded-xl border border-[#e6e9e1] bg-white shadow-[0_2px_12px_rgba(23,32,51,0.035)]">
            <form onSubmit={handleSubmit}>

              {/* CHAMPS 1 ET 2 */}

              <section className="border-b border-[#edf0e9] px-5 py-6 sm:px-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f1f5e9]">
                    <UserRound className="size-[18px] text-[#556B2F]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#172033]">Identité</h2>
                    <p className="mt-0.5 text-xs text-[#879080]">
                      Informations générales de l'utilisateur
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-[#334155]">
                      Nom d'affichage <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleChange}
                      required
                      placeholder="Ex. : Ayah Ben Ali"
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] px-3.5 text-sm outline-none transition placeholder:text-[#a0a8b4] focus:border-[#718747] focus:ring-2 focus:ring-[#718747]/15"
                    />
                  </div>

                  <div>
                    <label htmlFor="userName" className="mb-2 block text-sm font-medium text-[#334155]">
                      Nom utilisateur <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      placeholder="Ex. : ayah"
                      autoComplete="username"
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] px-3.5 text-sm outline-none transition placeholder:text-[#a0a8b4] focus:border-[#718747] focus:ring-2 focus:ring-[#718747]/15"
                    />
                  </div>
                </div>
              </section>

              {/* CHAMPS 3 ET 4 */}

              <section className="border-b border-[#edf0e9] px-5 py-6 sm:px-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f1f5e9]">
                    <Mail className="size-[18px] text-[#556B2F]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#172033]">Coordonnées</h2>
                    <p className="mt-0.5 text-xs text-[#879080]">
                      Adresse email et identifiant interne
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="mail" className="mb-2 block text-sm font-medium text-[#334155]">
                      Adresse email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id="mail"
                        name="mail"
                        type="email"
                        value={formData.mail}
                        onChange={handleChange}
                        required
                        placeholder="Ex. : ayah@example.com"
                        autoComplete="email"
                        className="h-11 w-full rounded-lg border border-[#dfe4e9] pl-10 pr-3.5 text-sm outline-none transition placeholder:text-[#a0a8b4] focus:border-[#718747] focus:ring-2 focus:ring-[#718747]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="userCode" className="mb-2 block text-sm font-medium text-[#334155]">
                      Code utilisateur <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id="userCode"
                        name="userCode"
                        type="text"
                        value={formData.userCode}
                        onChange={handleChange}
                        required
                        placeholder="Ex. : U001"
                        className="h-11 w-full rounded-lg border border-[#dfe4e9] pl-10 pr-3.5 text-sm outline-none transition placeholder:text-[#a0a8b4] focus:border-[#718747] focus:ring-2 focus:ring-[#718747]/15"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* CHAMPS 5 ET 6 */}

              <section className="px-5 py-6 sm:px-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f1f5e9]">
                    <LockKeyhole className="size-[18px] text-[#556B2F]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#172033]">Sécurité et statut</h2>
                    <p className="mt-0.5 text-xs text-[#879080]">
                      Paramètres de connexion et état du compte
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#334155]">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        placeholder="Saisir le mot de passe"
                        autoComplete="new-password"
                        className="h-11 w-full rounded-lg border border-[#dfe4e9] pl-10 pr-3.5 text-sm outline-none transition placeholder:text-[#a0a8b4] focus:border-[#718747] focus:ring-2 focus:ring-[#718747]/15"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-[#94a3b8]">6 caractères minimum.</p>
                  </div>

                  <div>
                    <label htmlFor="isActive" className="mb-2 block text-sm font-medium text-[#334155]">
                      Statut du compte <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                      <select
                        id="isActive"
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleChange}
                        required
                        className="h-11 w-full appearance-none rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3.5 text-sm outline-none transition focus:border-[#718747] focus:ring-2 focus:ring-[#718747]/15"
                      >
                        <option value="true">Actif</option>
                        <option value="false">Inactif</option>
                      </select>
                    </div>
                    <p className="mt-1.5 text-xs text-[#94a3b8]">
                      Détermine si le compte est actif.
                    </p>
                  </div>
                </div>
              </section>

              {/* ERREUR */}

              {errorMessage && (
                <div role="alert" className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8">
                  {errorMessage}
                </div>
              )}

              {/* BOUTONS */}

              <footer className="flex flex-col-reverse gap-3 border-t border-[#edf0e9] bg-[#fcfcfa] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-11 w-full rounded-lg border-[#dfe4e9] bg-white px-5 text-sm font-medium text-[#475569] hover:bg-[#f5f7f2] sm:w-auto"
                >
                  <X className="mr-2 size-4" />
                  Annuler
                </Button>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#465A27] sm:w-auto"
                >
                  <Save className="mr-2 size-4" />
                  Enregistrer les modifications
                </Button>
              </footer>
            </form>
          </div>

          
        </div>
      </Container>

      {/* MODAL SUCCÈS */}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div className="w-full max-w-[400px] rounded-2xl border border-[#e6e9e1] bg-white p-7 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-[#eef4e6]">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#556B2F]">
                  <Check className="size-6 text-white" />
                </div>
              </div>

              <h2 id="success-title" className="text-xl font-semibold text-[#172033]">
                Modifications enregistrées
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Les informations de l'utilisateur ont été mises à jour avec succès.
              </p>

              <Button
                type="button"
                onClick={handleCancel}
                className="mt-6 h-11 w-full rounded-lg bg-[#556B2F] font-semibold text-white hover:bg-[#465A27]"
              >
                Retour à la liste
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
