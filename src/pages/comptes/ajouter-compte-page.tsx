import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BadgeDollarSign,
  Check,
  Hash,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export function AjouterComptePage() {
  const navigate = useNavigate();

  /* ============================================================
     FORMULAIRE
  ============================================================ */

 const [formData, setFormData] = useState({
  name: '',
  adresse: '',
  mobile: '',
  mail: '',
  statusId: '1',
  priceConv: '',
  isBaseCompte: false,
  baseCompteId: '',
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

  const handleToggleBaseCompte = () => {
  setFormData((current) => ({
    ...current,
    isBaseCompte: !current.isBaseCompte,
  }));
};
  /* ============================================================
     COMPTE DE BASE
  ============================================================ */

  const handleBaseCompteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      isBaseCompte: event.target.checked,
      baseCompteId: event.target.checked
        ? ''
        : current.baseCompteId,
    }));
  };

  /* ============================================================
     ANNULER
  ============================================================ */

  const handleCancel = () => {
    navigate('/store-admin/accounts');
  };

  /* ============================================================
     ENREGISTRER
  ============================================================ */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    console.log('Nouveau compte :', {
      ...formData,
      statusId: Number(formData.statusId),
      priceConv: Number(formData.priceConv),
      baseCompteId:
        formData.baseCompteId === ''
          ? null
          : Number(formData.baseCompteId),
    });

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

    navigate('/store-admin/accounts');
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
            Ajouter un compte
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">

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
              Comptes
            </span>

            <span>
              /
            </span>

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

          <div className="mx-auto w-full max-w-6xl rounded-xl border border-border bg-white shadow-sm">

            {/* ==================================================
                HEADER CARD
            ================================================== */}

            <div className="border-b border-border px-6 py-5">

              <h2 className="text-lg font-bold text-foreground">
                Informations du compte
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Veuillez remplir les informations du compte.
              </p>

            </div>


            {/* ==================================================
                CHAMPS
            ================================================== */}

            <div className="px-6 py-6">

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

                {/* ==================================================
                    NOM
                ================================================== */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nom

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Entrez le nom du compte"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    ADRESSE
                ================================================== */}

                <div>

                  <label
                    htmlFor="adresse"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Adresse

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Entrez l'adresse"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                  </div>

                </div>


                {/* ==================================================
                    MOBILE
                ================================================== */}

                <div>

                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Mobile

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Entrez le numéro de mobile"
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
                    STATUT
                ================================================== */}

                <div>

                  <label
                    htmlFor="statusId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Statut

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="statusId"
                    name="statusId"
                    value={formData.statusId}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  >

                    <option value="1">
                      Actif
                    </option>

                    <option value="2">
                      Inactif
                    </option>

                  </select>

                </div>


                {/* ==================================================
                    PRIX CONVERSION
                ================================================== */}

                <div>

                  <label
                    htmlFor="priceConv"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Prix conversion

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <BadgeDollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="priceConv"
                      name="priceConv"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceConv}
                      onChange={handleChange}
                      placeholder="Entrez le prix de conversion"
                      required
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-12 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      DT
                    </span>

                  </div>

                </div>


                {/* ==================================================
                    COMPTE DE BASE
                ================================================== */}

                {/* ==================================================
    COMPTE DE BASE
================================================== */}

{/* ==================================================
    COMPTE DE BASE
================================================== */}

{/* ==================================================
    COMPTE DE BASE
================================================== */}

{/* ==================================================
    COMPTE DE BASE
================================================== */}

<div className="md:col-span-2">

  <label className="mb-2 block text-sm font-medium text-foreground">
    Compte de base

    <span className="ml-1 text-red-500">
      *
    </span>
  </label>

  <button
    type="button"
    onClick={handleToggleBaseCompte}
    className="flex items-center gap-3"
  >

    <span
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        formData.isBaseCompte
          ? 'bg-[#556B2F]'
          : 'bg-gray-300'
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

    <span className="text-sm font-medium text-foreground">
      {formData.isBaseCompte
        ? 'Oui'
        : 'Non'}
    </span>

  </button>

</div>
                {/* ==================================================
                    ID COMPTE DE BASE
                ================================================== */}

                <div>

                  <label
                    htmlFor="baseCompteId"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    ID compte de base
                  </label>

                  <div className="relative">

                    <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="baseCompteId"
                      name="baseCompteId"
                      type="number"
                      min="1"
                      value={formData.baseCompteId}
                      onChange={handleChange}
                      placeholder="Entrez l'ID du compte de base"
                      disabled={formData.isBaseCompte}
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] disabled:cursor-not-allowed disabled:bg-muted"
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
              Compte ajouté
            </h2>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            <p className="mt-2 text-xs text-gray-500">
              Le compte a été ajouté avec succès.
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