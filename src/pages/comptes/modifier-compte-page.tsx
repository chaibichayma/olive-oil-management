
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  BadgeDollarSign,
  Check,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

/* ============================================================
   TYPE COMPTE
============================================================ */

interface Compte {
  compteId: number;
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: number;
  priceConv: number;
  isBaseCompte: boolean;
  baseCompteId: number | null;
}

interface FormData {
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: string;
  priceConv: string;
  isBaseCompte: boolean;
  baseCompteId: string;
}

/* ============================================================
   DONNÉES DE DÉMONSTRATION
   À remplacer par les données de ton API / Supabase
============================================================ */

const defaultComptes: Compte[] = [
  {
    compteId: 1,
    name: 'Ahmed Ben Ali',
    adresse: 'Sousse',
    mobile: '12345678',
    mail: 'ahmed@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 2,
    name: 'Client 1',
    adresse: 'Monastir',
    mobile: '98765432',
    mail: 'client1@gmail.com',
    statusId: 1,
    priceConv: 1.25,
    isBaseCompte: false,
    baseCompteId: 1,
  },
  {
    compteId: 3,
    name: 'Fournisseur 1',
    adresse: 'Sfax',
    mobile: '55667788',
    mail: 'fournisseur@gmail.com',
    statusId: 2,
    priceConv: 0.8,
    isBaseCompte: false,
    baseCompteId: 1,
  },
  {
    compteId: 4,
    name: 'Coopérative',
    adresse: 'Mahdia',
    mobile: '22334455',
    mail: 'coop@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 5,
    name: 'Client 2',
    adresse: 'Tunis',
    mobile: '22113344',
    mail: 'client2@gmail.com',
    statusId: 1,
    priceConv: 1.1,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 6,
    name: 'Fournisseur 2',
    adresse: 'Gabès',
    mobile: '55664433',
    mail: 'fournisseur2@gmail.com',
    statusId: 1,
    priceConv: 0.9,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 7,
    name: 'Client 3',
    adresse: 'Nabeul',
    mobile: '99887766',
    mail: 'client3@gmail.com',
    statusId: 2,
    priceConv: 1.15,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 8,
    name: 'Coopérative 2',
    adresse: 'Kairouan',
    mobile: '44556677',
    mail: 'coop2@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 9,
    name: 'Client 4',
    adresse: 'Bizerte',
    mobile: '77889900',
    mail: 'client4@gmail.com',
    statusId: 1,
    priceConv: 0.95,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 10,
    name: 'Fournisseur 3',
    adresse: 'Béja',
    mobile: '11223344',
    mail: 'fournisseur3@gmail.com',
    statusId: 2,
    priceConv: 0.75,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 11,
    name: 'Client 5',
    adresse: 'Zaghouan',
    mobile: '33445566',
    mail: 'client5@gmail.com',
    statusId: 1,
    priceConv: 1.2,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 12,
    name: 'Coopérative 3',
    adresse: 'Le Kef',
    mobile: '66778899',
    mail: 'coop3@gmail.com',
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
];

const initialFormData: FormData = {
  name: '',
  adresse: '',
  mobile: '',
  mail: '',
  statusId: '1',
  priceConv: '',
  isBaseCompte: false,
  baseCompteId: '',
};

/* ============================================================
   PAGE MODIFIER COMPTE
============================================================ */

export function ModifierComptePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  /* ============================================================
     COMPTES DE BASE DISPONIBLES
  ============================================================ */

  const comptesDeBase = useMemo(
    () =>
      defaultComptes.filter(
        (compte) =>
          compte.isBaseCompte &&
          compte.compteId !== Number(id),
      ),
    [id],
  );

  /* ============================================================
     CHARGER LE COMPTE À MODIFIER
  ============================================================ */

  useEffect(() => {
    if (!id) {
      navigate('/store-admin/accounts');
      return;
    }

    const compte = defaultComptes.find(
      (item) => item.compteId === Number(id),
    );

    if (!compte) {
      navigate('/store-admin/accounts');
      return;
    }

    setFormData({
      name: compte.name,
      adresse: compte.adresse,
      mobile: compte.mobile,
      mail: compte.mail,
      statusId: String(compte.statusId),
      priceConv: String(compte.priceConv),
      isBaseCompte: compte.isBaseCompte,
      baseCompteId:
        compte.baseCompteId === null
          ? ''
          : String(compte.baseCompteId),
    });
  }, [id, navigate]);

  /* ============================================================
     MODIFICATION DES CHAMPS
  ============================================================ */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setErrorMessage('');

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ============================================================
     COMPTE DE BASE
  ============================================================ */

  const handleBaseCompteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;

    setErrorMessage('');

    setFormData((current) => ({
      ...current,
      isBaseCompte: checked,
      baseCompteId: checked ? '' : current.baseCompteId,
    }));
  };

  /* ============================================================
     ANNULER
  ============================================================ */

  const handleCancel = () => {
    navigate('/store-admin/accounts');
  };

  /* ============================================================
     ENREGISTRER LES MODIFICATIONS
  ============================================================ */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage('');

    if (!id) {
      setErrorMessage('Identifiant du compte introuvable.');
      return;
    }

    if (
      !formData.isBaseCompte &&
      !formData.baseCompteId
    ) {
      setErrorMessage(
        'Veuillez sélectionner un compte de base associé.',
      );
      return;
    }

    const selectedBaseId =
      formData.baseCompteId === ''
        ? null
        : Number(formData.baseCompteId);

    const modifiedCompte: Compte = {
      compteId: Number(id),
      name: formData.name.trim(),
      adresse: formData.adresse.trim(),
      mobile: formData.mobile.trim(),
      mail: formData.mail.trim(),
      statusId: Number(formData.statusId),
      priceConv: Number(formData.priceConv),
      isBaseCompte: formData.isBaseCompte,
      baseCompteId: formData.isBaseCompte
        ? null
        : selectedBaseId,
    };

    /*
      INTÉGRATION À PRÉVOIR :
      Envoyer modifiedCompte à ton API ou à Supabase.
      Le console.log ci-dessous permet seulement de vérifier
      les données ; il ne modifie pas encore la liste réelle.
    */

    console.log('Compte modifié :', modifiedCompte);

    setShowSuccessModal(true);
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate('/store-admin/accounts');
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* ========================================================
          EN-TÊTE DE PAGE
      ======================================================== */}

      <Container>
        <div className="border-b border-[#e8ece5] py-5 sm:py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#dce7cf] bg-[#eef4e6] text-[#556B2F] shadow-sm">
                <UserRound className="size-6" />
              </div>

              <div className="min-w-0">
                <nav
                  aria-label="Fil d'Ariane"
                  className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[#94a3b8] sm:text-sm"
                >
                  <span>Paramétrage</span>
                  <ChevronRight className="size-3.5" />
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="transition hover:text-[#556B2F]"
                  >
                    Comptes
                  </button>
                  <ChevronRight className="size-3.5" />
                  <span className="font-medium text-[#556B2F]">
                    Modification
                  </span>
                </nav>

                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                    Modifier le compte
                  </h1>

                  <span className="inline-flex items-center rounded-md border border-[#dce7cf] bg-[#f4f7ef] px-2.5 py-1 text-[11px] font-semibold text-[#556B2F]">
                    <span className="mr-1.5 size-1.5 rounded-full bg-[#6d873f]" />
                    Modification
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
                  Modifiez les informations du compte et
                  enregistrez les changements.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 shrink-0 border-[#dfe5db] bg-white px-4 text-sm font-medium text-[#475569] hover:border-[#c9d9b6] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
            >
              <ArrowLeft className="mr-2 size-4" />
              Retour aux comptes
            </Button>
          </div>
        </div>
      </Container>

      {/* ========================================================
          FORMULAIRE PLEINE LARGEUR
      ======================================================== */}

      <Container>
        <div className="w-full py-6 sm:py-8">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-hidden rounded-xl border border-[#e2e8df] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.045)]"
          >
            {/* EN-TÊTE DU FORMULAIRE */}

            <div className="flex items-start gap-3 border-b border-[#edf0eb] px-5 py-5 sm:px-8">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f2f6ed] text-[#556B2F]">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#172033] sm:text-lg">
                  Informations du compte
                </h2>

                <p className="mt-1 text-sm leading-5 text-[#64748b]">
                  Les champs marqués d'un astérisque sont
                  obligatoires.
                </p>
              </div>
            </div>

            {/* CHAMPS DU FORMULAIRE */}

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                {/* NOM */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Nom du compte
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Entrez le nom du compte"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe5db] bg-white pl-10 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-[#a0a9b5] focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* ADRESSE */}

                <div>
                  <label
                    htmlFor="adresse"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Adresse
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />

                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Entrez l'adresse"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe5db] bg-white pl-10 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-[#a0a9b5] focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* TÉLÉPHONE */}

                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Téléphone
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Ex. : 22123456"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe5db] bg-white pl-10 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-[#a0a9b5] focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* E-MAIL */}

                <div>
                  <label
                    htmlFor="mail"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Adresse e-mail
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />

                    <input
                      id="mail"
                      name="mail"
                      type="email"
                      value={formData.mail}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe5db] bg-white pl-10 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-[#a0a9b5] focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10"
                    />
                  </div>
                </div>

                {/* STATUT */}

                <div>
                  <label
                    htmlFor="statusId"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Statut du compte
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />

                    <select
                      id="statusId"
                      name="statusId"
                      value={formData.statusId}
                      onChange={handleChange}
                      required
                      className="h-11 w-full appearance-none rounded-lg border border-[#dfe5db] bg-white pl-10 pr-10 text-sm text-[#172033] outline-none transition focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10"
                    >
                      <option value="1">Actif</option>
                      <option value="2">Inactif</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>

                {/* PRIX DE CONVERSION */}

                <div>
                  <label
                    htmlFor="priceConv"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Prix de conversion
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <BadgeDollarSign className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />

                    <input
                      id="priceConv"
                      name="priceConv"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceConv}
                      onChange={handleChange}
                      placeholder="Ex. : 1.25"
                      required
                      className="h-11 w-full rounded-lg border border-[#dfe5db] bg-white pl-10 pr-12 text-sm text-[#172033] outline-none transition placeholder:text-[#a0a9b5] focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10"
                    />

                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#94a3b8]">
                      DT
                    </span>
                  </div>
                </div>

                {/* COMPTE DE BASE */}

                <div className="flex flex-col">
                  <label className="mb-2 block text-sm font-semibold text-[#334155]">
                    Compte de base
                  </label>

                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#dfe5db] bg-white px-3.5 transition hover:border-[#c9d9b6]">
                    <input
                      type="checkbox"
                      checked={formData.isBaseCompte}
                      onChange={handleBaseCompteChange}
                      className="size-4 accent-[#556B2F]"
                    />

                    <span className="text-sm text-[#334155]">
                      Ce compte est un compte de base
                    </span>
                  </label>

                  <p className="mt-2 text-xs leading-5 text-[#94a3b8]">
                    Un compte de base n'est rattaché à aucun
                    autre compte.
                  </p>
                </div>

                {/* SÉLECTION DU COMPTE DE BASE */}

                <div>
                  <label
                    htmlFor="baseCompteId"
                    className="mb-2 block text-sm font-semibold text-[#334155]"
                  >
                    Compte de base associé
                    {!formData.isBaseCompte && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>

                  <div className="relative">
                    <select
                      id="baseCompteId"
                      name="baseCompteId"
                      value={formData.baseCompteId}
                      onChange={handleChange}
                      disabled={formData.isBaseCompte}
                      required={!formData.isBaseCompte}
                      className="h-11 w-full appearance-none rounded-lg border border-[#dfe5db] bg-white px-3.5 pr-10 text-sm text-[#172033] outline-none transition focus:border-[#71894d] focus:ring-4 focus:ring-[#556B2F]/10 disabled:cursor-not-allowed disabled:bg-[#f5f6f4] disabled:text-[#a0a9b5]"
                    >
                      <option value="">
                        {formData.isBaseCompte
                          ? 'Non applicable'
                          : 'Sélectionnez un compte de base'}
                      </option>

                      {comptesDeBase.map((compte) => (
                        <option
                          key={compte.compteId}
                          value={String(compte.compteId)}
                        >
                          {compte.name} — ID {compte.compteId}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#94a3b8]">
                    Sélectionnez le compte auquel ce compte
                    sera rattaché.
                  </p>
                </div>
              </div>

              {/* MESSAGE D'ERREUR */}

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}
            </div>

            {/* PIED DU FORMULAIRE */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] bg-[#fcfdfb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-[#94a3b8]">
                Vérifiez les informations avant de les enregistrer.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-11 border-[#dfe5db] bg-white px-5 text-sm text-[#475569] hover:bg-[#f5f8f1]"
                >
                  <X className="mr-2 size-4" />
                  Annuler
                </Button>

                <Button
                  type="submit"
                  className="h-11 bg-[#556B2F] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465A27]"
                >
                  <Save className="mr-2 size-4" />
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Container>

      {/* ========================================================
          MODALE DE SUCCÈS
      ======================================================== */}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 backdrop-blur-[2px]"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-[400px] rounded-2xl border border-[#edf0eb] bg-white p-7 text-center shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Fermer"
              className="absolute"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eef4e6]">
              <Check className="size-7 text-[#556B2F]" />
            </div>

            <h2
              id="success-title"
              className="mt-4 text-xl font-bold text-[#172033]"
            >
              Modifications enregistrées
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Les informations du compte ont été préparées
              avec succès.
            </p>

            <Button
              type="button"
              onClick={handleSuccessOk}
              className="mt-6 h-11 w-full bg-[#556B2F] font-semibold text-white hover:bg-[#465A27]"
            >
              Retour aux comptes
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModifierComptePage;

