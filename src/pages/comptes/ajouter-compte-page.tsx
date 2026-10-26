
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Compte } from './compte-table';
import { saveCompte, updateCompte } from '@/services/compte.api';

import {
  ArrowLeft,
  BadgeDollarSign,
  Check,
  ChevronRight,
  Hash,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
  Building2,
  CircleCheck,
  GitBranch,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

/* ============================================================
   PAGE AJOUTER UN COMPTE
============================================================ */

interface CompteFormData {
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: string;
  priceConv: string;
  isBaseCompte: boolean;
  baseCompteId: string;
}

export function AjouterComptePage() {
  const navigate = useNavigate();
const location = useLocation();

const compte = (location.state as { compte?: Compte } | null)?.compte;
const isEdit = Boolean(compte);

const [formData, setFormData] = useState<CompteFormData>(() => ({
  name: compte?.name ?? '',
  adresse: compte?.adresse ?? '',
  mobile: compte?.mobile ?? '',
  mail: compte?.mail ?? '',
  statusId: String(compte?.statusId ?? 1),
  priceConv: String(compte?.priceConv ?? 0),
  isBaseCompte: compte?.isBaseCompte ?? false,
  baseCompteId: compte?.baseCompteId == null
    ? ''
    : String(compte.baseCompteId),
}));

const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleToggleBaseCompte = () => {
    setFormData((current) => ({
      ...current,
      isBaseCompte: !current.isBaseCompte,
      baseCompteId: !current.isBaseCompte ? '' : current.baseCompteId,
    }));
  };

  /* ==========================================================
     ANNULER
  ========================================================== */

  const handleCancel = () => {
    navigate('/store-admin/accounts');
  };

  /* ==========================================================
     ENREGISTRER
  ========================================================== */

  

const [isSaving, setIsSaving] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (isSaving) return;

  const priceConv = Number(formData.priceConv);

  if (!formData.name.trim()) {
    setErrorMessage('Veuillez saisir le nom du compte.');
    return;
  }

  if (!formData.mobile.trim()) {
    setErrorMessage('Veuillez saisir le numéro de téléphone.');
    return;
  }

  if (!Number.isFinite(priceConv) || priceConv < 0) {
    setErrorMessage('Le prix de conversion est invalide.');
    return;
  }

  if (isEdit && compte?.compteId == null) {
    setErrorMessage(
      "Impossible de modifier ce compte : son identifiant est absent.",
    );
    return;
  }

  const payload = {
    ...(isEdit ? {} : {}),
    ...(isEdit && compte?.compteId != null
      ? { compteId: Number(compte.compteId) }
      : {}),
    name: formData.name.trim(),
    mobile: formData.mobile.trim(),
    priceKg: priceConv,
    isBaseCompte: formData.isBaseCompte,
  };

  setIsSaving(true);
  setErrorMessage('');

  try {
    if (isEdit) {
      await updateCompte({
        ...payload,
        id: Number((compte as Compte & { id?: number }).id ?? 0),
        reference:
          (compte as Compte & { reference?: string }).reference ?? '',
        compteId: Number(compte!.compteId),
      });
    } else {
      await saveCompte(payload);
    }

    setShowSuccessModal(true);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du compte :', error);

    setErrorMessage(
      error instanceof Error
        ? error.message
        : 'Une erreur est survenue lors de la sauvegarde.',
    );
  } finally {
    setIsSaving(false);
  }
};



  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <Container>
        <div className="w-full py-5 sm:py-6">
          {/* FIL D'ARIANE */}
          

          {/* HEADER DE PAGE */}
          <div className="flex flex-col gap-5 border-b border-[#e9ede4] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#dfe8d2] bg-[#eef4e6]">
                <Wallet className="size-6 text-[#556B2F]" />
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[#172033] sm:text-2xl">
                    {isEdit ? 'Modifier un compte' : 'Ajouter un compte'}
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe8d2] bg-[#f5f8f0] px-2.5 py-1 text-[10px] font-semibold text-[#556B2F] sm:text-xs">
                    <span className="size-1.5 rounded-full bg-[#718b4b]" />
                    {isEdit ? 'Modification du compte' : 'Nouveau compte'}
                  </span>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                  Créez un compte et configurez ses coordonnées,
                  son statut et ses paramètres de conversion.
                </p>
              </div>
            </div>

            <Button
  type="button"
  variant="outline"
  onClick={handleCancel}
  className="h-10 shrink-0 gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-medium text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
>
  <ArrowLeft className="size-4 text-[#718747]" />
  Retour à la liste
</Button>
          </div>
        </div>
      </Container>

      {/* FORMULAIRE PLEINE LARGEUR */}
      <Container>
        <form onSubmit={handleSubmit} className="w-full pb-8">
          <div className="w-full overflow-hidden rounded-xl border border-[#e5e9e1] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">
            {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
            <section className="px-5 py-6 sm:px-7 lg:px-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eef4e6]">
                  <Building2 className="size-5 text-[#556B2F]" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#172033] sm:text-base">
                    Informations générales
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Coordonnées et informations principales du compte
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                {/* NOM */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Nom du compte <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex. : Ahmed Ben Ali"
                      autoComplete="organization"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* ADRESSE */}
                <div>
                  <label
                    htmlFor="adresse"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Adresse <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Ex. : Sousse"
                      autoComplete="street-address"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* TÉLÉPHONE */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Téléphone mobile <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Ex. : 12345678"
                      autoComplete="tel"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="mail"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Adresse e-mail <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="mail"
                      name="mail"
                      type="email"
                      value={formData.mail}
                      onChange={handleChange}
                      placeholder="Ex. : contact@example.com"
                      autoComplete="email"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-[#edf0e9]" />

            {/* SECTION 2 : STATUT ET CONVERSION */}
            <section className="px-5 py-6 sm:px-7 lg:px-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eef4e6]">
                  <BadgeDollarSign className="size-5 text-[#556B2F]" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#172033] sm:text-base">
                    Statut et conversion
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Définissez l’état du compte et son prix de conversion
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                {/* STATUT */}
                <div>
                  <label
                    htmlFor="statusId"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Statut du compte <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CircleCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <select
                      id="statusId"
                      name="statusId"
                      value={formData.statusId}
                      onChange={handleChange}
                      required
                      className="h-11 w-full appearance-none rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                    >
                      <option value="1">Actif</option>
                      <option value="2">Inactif</option>
                    </select>
                  </div>
                </div>

                {/* PRIX CONVERSION */}
                <div>
                  <label
                    htmlFor="priceConv"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Prix de conversion <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <BadgeDollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="priceConv"
                      name="priceConv"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceConv}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                      DT
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-[#edf0e9]" />

            {/* SECTION 3 : RATTACHEMENT */}
            <section className="px-5 py-6 sm:px-7 lg:px-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eef4e6]">
                  <GitBranch className="size-5 text-[#556B2F]" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#172033] sm:text-base">
                    Rattachement du compte
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Choisissez si le compte est principal ou rattaché à un autre
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                {/* COMPTE DE BASE */}
                <div>
                  <span className="mb-3 block text-sm font-medium text-[#334155]">
                    Compte de base <span className="text-red-500">*</span>
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isBaseCompte}
                    onClick={handleToggleBaseCompte}
                    className="flex min-h-11 items-center gap-3 rounded-lg border border-[#e5e9e1] px-3.5 py-2.5 transition hover:border-[#cbd8bc] hover:bg-[#fbfcf9]"
                  >
                    <span
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                        formData.isBaseCompte
                          ? 'bg-[#556B2F]'
                          : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                          formData.isBaseCompte
                            ? 'translate-x-5'
                            : 'translate-x-0.5'
                        }`}
                      />
                    </span>

                    <span className="text-sm font-medium text-slate-700">
                      {formData.isBaseCompte
                        ? 'Oui, compte principal'
                        : 'Non, compte rattaché'}
                    </span>
                  </button>
                </div>

                {/* ID COMPTE DE BASE */}
                <div>
                  <label
                    htmlFor="baseCompteId"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    ID du compte de base
                    {!formData.isBaseCompte && (
                      <span className="ml-1 text-slate-400">(facultatif)</span>
                    )}
                  </label>

                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="baseCompteId"
                      name="baseCompteId"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.baseCompteId}
                      onChange={handleChange}
                      placeholder="Ex. : 1"
                      disabled={formData.isBaseCompte}
                      className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#829663] focus:ring-2 focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {formData.isBaseCompte
                      ? 'Un compte principal ne dépend d’aucun autre compte.'
                      : 'Renseignez l’identifiant du compte principal auquel ce compte est rattaché.'}
                  </p>
                </div>
              </div>
            </section>
            {errorMessage && (
  <div
    role="alert"
    className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7 lg:mx-8"
  >
    {errorMessage}
  </div>
)}

            {/* FOOTER */}
<div className="flex flex-col-reverse gap-3 border-t border-[#e9ede4] bg-[#fcfdfb] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7 lg:px-8">
  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <Button
      type="button"
      variant="outline"
      onClick={handleCancel}
      className="h-10 gap-2 rounded-lg border-[#dfe4e9] px-5 text-slate-600 hover:bg-slate-50"
    >
      <X className="size-4" />
      Annuler
    </Button>

    <Button
  type="submit"
  disabled={isSaving}
  className="h-10 gap-2 rounded-lg bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27] disabled:opacity-60"
>
  <Save className="size-4" />
  {isSaving
    ? 'Enregistrement...'
    : isEdit
      ? 'Enregistrer les modifications'
      : 'Enregistrer le compte'}
</Button>
  </div>
</div>
          </div>
        </form>
      </Container>

      {/* MODALE SUCCÈS */}
      {/* MODALE SUCCÈS */}
{showSuccessModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]"
    onClick={() => {
      setShowSuccessModal(false);
      navigate('/store-admin/accounts', {
        state: { refreshComptes: true },
      });
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      className="w-full max-w-[390px] rounded-2xl border border-slate-100 bg-white p-7 text-center shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => {
          setShowSuccessModal(false);
          navigate('/store-admin/accounts', {
            state: { refreshComptes: true },
          });
        }}
        className="absolute right-4 top-4 hidden"
        aria-label="Fermer"
      >
        <X className="size-4" />
      </button>

      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eef4e6]">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#556B2F]">
          <Check className="size-5 text-white" />
        </div>
      </div>

      <h2
        id="success-title"
        className="mt-4 text-lg font-bold text-[#172033]"
      >
        {isEdit ? 'Compte modifié' : 'Compte ajouté'}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {isEdit
          ? 'Les informations du compte ont été mises à jour avec succès.'
          : 'Le nouveau compte a été ajouté avec succès.'}
      </p>

      <Button
        type="button"
        onClick={() => {
          setShowSuccessModal(false);
          navigate('/store-admin/accounts', {
            state: { refreshComptes: true },
          });
        }}
        className="mt-5 h-10 min-w-[100px] rounded-lg bg-[#556B2F] px-5 font-semibold text-white hover:bg-[#465A27]"
      >
        OK
      </Button>
    </div>
  </div>
)}
    </>
  );
}
