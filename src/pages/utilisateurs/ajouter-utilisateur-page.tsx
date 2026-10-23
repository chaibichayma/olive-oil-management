
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Hash,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserRound,
  X,
} from 'lucide-react';

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

export function AjouterUtilisateurPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    userName: '',
    mail: '',
    password: '',
    userCode: '',
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrorMessage('');
  };

  const handleToggleStatus = () => {
    setFormData((current) => ({
      ...current,
      isActive: !current.isActive,
    }));
  };

  const handleCancel = () => {
    navigate('/store-admin/users');
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !formData.displayName.trim() ||
      !formData.userName.trim() ||
      !formData.mail.trim() ||
      !formData.password ||
      !formData.userCode.trim()
    ) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      setErrorMessage('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    // Démonstration locale uniquement.
    const utilisateurs: Utilisateur[] = JSON.parse(
      localStorage.getItem('utilisateurs') || '[]',
    );

    const usernameExists = utilisateurs.some(
      (user) =>
        user.userName.toLowerCase() ===
        formData.userName.trim().toLowerCase(),
    );

    const emailExists = utilisateurs.some(
      (user) =>
        user.mail.toLowerCase() === formData.mail.trim().toLowerCase(),
    );

    const codeExists = utilisateurs.some(
      (user) =>
        user.userCode.toLowerCase() ===
        formData.userCode.trim().toLowerCase(),
    );

    if (usernameExists || emailExists || codeExists) {
      setErrorMessage(
        "Le nom d'utilisateur, l'e-mail ou le code existe déjà.",
      );
      return;
    }

    const newUser: Utilisateur = {
      id: Date.now(),
      displayName: formData.displayName.trim(),
      userName: formData.userName.trim(),
      mail: formData.mail.trim(),
      password: formData.password,
      userCode: formData.userCode.trim(),
      isActive: formData.isActive,
    };

    utilisateurs.push(newUser);
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));

    setShowSuccessModal(true);
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate('/store-admin/users');
  };

  const inputClassName =
    'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10';

  const labelClassName =
    'mb-2 block text-sm font-semibold text-slate-700';

  return (
    <>
      <Container>
        {/* HEADER PROFESSIONNEL */}
        <div className="pb-6 pt-5 sm:pb-8 sm:pt-7">
          {/* FIL D'ARIANE */}
          

          {/* TITRE + ACTION */}
          <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e0e8d5] bg-[#f2f6ed]">
                <UserRound className="size-6 text-[#556B2F]" />
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    Ajouter un utilisateur
                  </h1>
                  <span className="rounded-md border border-[#dce7d0] bg-[#f5f8f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#556B2F]">
                    Nouveau compte
                  </span>
                </div>

                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  Créez un compte utilisateur et configurez ses informations
                  de connexion et son statut.
                </p>
              </div>
            </div>

            <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="h-10 shrink-0 gap-2 self-start rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-medium text-[#556B2F] shadow-sm transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B] sm:self-center"
>
  <ArrowLeft className="size-4 text-[#718747]" />
  Retour à la liste
</Button>
          </div>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="pb-8">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* EN-TÊTE DU FORMULAIRE */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f2f6ed]">
                <UserRound className="size-5 text-[#556B2F]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Informations du compte
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Complétez les informations ci-dessous pour créer le compte.
                </p>
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              {/* IDENTITÉ */}
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <User className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Identité
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="displayName" className={labelClassName}>
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Ex. Ayah Ben Ali"
                        autoComplete="name"
                        required
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="userName" className={labelClassName}>
                      Nom d'utilisateur <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        @
                      </span>
                      <input
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="Ex. ayah"
                        autoComplete="username"
                        required
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* COORDONNÉES */}
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <Mail className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Coordonnées
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="mail" className={labelClassName}>
                      Adresse e-mail <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="mail"
                        name="mail"
                        type="email"
                        value={formData.mail}
                        onChange={handleChange}
                        placeholder="nom@exemple.com"
                        autoComplete="email"
                        required
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="userCode" className={labelClassName}>
                      Code utilisateur <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="userCode"
                        name="userCode"
                        value={formData.userCode}
                        onChange={handleChange}
                        placeholder="Ex. U013"
                        required
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* SÉCURITÉ ET STATUT */}
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#556B2F]" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Sécurité et statut
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="password" className={labelClassName}>
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Saisissez un mot de passe"
                        autoComplete="new-password"
                        required
                        className={`${inputClassName} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword
                            ? 'Masquer le mot de passe'
                            : 'Afficher le mot de passe'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#556B2F]"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Choisissez un mot de passe sécurisé.
                    </p>
                  </div>

                  <div>
                    <label className={labelClassName}>
                      Statut du compte
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.isActive}
                      onClick={handleToggleStatus}
                      className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-200 px-3 transition hover:border-[#c9d9b6]"
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`size-2.5 rounded-full ${
                            formData.isActive
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {formData.isActive ? 'Compte actif' : 'Compte inactif'}
                        </span>
                      </span>

                      <span
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          formData.isActive ? 'bg-[#556B2F]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`size-5 rounded-full bg-white shadow-sm transition-transform ${
                            formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </span>
                    </button>
                    <p className="mt-2 text-xs text-slate-400">
                      {formData.isActive
                        ? "L'utilisateur pourra accéder à son compte."
                        : "L'accès au compte sera désactivé."}
                    </p>
                  </div>
                </div>
              </section>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}
            </div>

            {/* BOUTONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 gap-2 border-slate-200 bg-white px-5"
              >
                <X className="size-4" />
                Annuler
              </Button>

              <Button
                type="submit"
                className="h-10 gap-2 bg-[#556B2F] px-5 text-white hover:bg-[#465A27]"
              >
                <Check className="size-4" />
                Enregistrer l'utilisateur
              </Button>
            </div>
          </div>
        </form>
      </Container>

      {/* MODALE DE SUCCÈS */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eef4e6]">
              <CheckCircle2 className="size-7 text-[#556B2F]" />
            </div>

            <h2
              id="success-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Utilisateur ajouté
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Le compte a été enregistré avec succès.
            </p>

            <Button
              type="button"
              onClick={handleSuccessOk}
              className="mt-5 h-10 w-full bg-[#556B2F] hover:bg-[#465A27]"
            >
              Continuer
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
