
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Hash,
  Leaf,
  Package,
  Save,
  ShoppingCart,
  X,
  Sprout,
  Clock3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

interface SaisonFormData {
  beginDate: string;
  endDate: string;
  statusId: string;
  year: string;
  priceKilo: string;
  priceAchat: string;
  priceVente: string;
  nbreCaisses: string;
}

const initialFormData: SaisonFormData = {
  beginDate: '2026-09-01',
  endDate: '2027-03-31',
  statusId: '1',
  year: '2026',
  priceKilo: '0.80',
  priceAchat: '18.00',
  priceVente: '20.00',
  nbreCaisses: '250',
};

export function ModifierSaisonPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<SaisonFormData>(initialFormData);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage('');
  };

  const handleCancel = () => {
    navigate('/store-admin/saison');
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage('');

    if (
      !formData.year.trim() ||
      !formData.beginDate ||
      !formData.endDate ||
      !formData.statusId ||
      !formData.priceKilo.trim() ||
      !formData.priceAchat.trim() ||
      !formData.priceVente.trim() ||
      !formData.nbreCaisses.trim()
    ) {
      setErrorMessage(
        'Veuillez remplir tous les champs obligatoires.',
      );
      return;
    }

    if (formData.endDate < formData.beginDate) {
      setErrorMessage(
        'La date de fin doit être postérieure ou égale à la date de début.',
      );
      return;
    }

    const year = Number(formData.year);
    const statusId = Number(formData.statusId);
    const priceKilo = Number(formData.priceKilo);
    const priceAchat = Number(formData.priceAchat);
    const priceVente = Number(formData.priceVente);
    const nbreCaisses = Number(formData.nbreCaisses);

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100 ||
      !Number.isInteger(statusId) ||
      !Number.isFinite(priceKilo) ||
      !Number.isFinite(priceAchat) ||
      !Number.isFinite(priceVente) ||
      !Number.isInteger(nbreCaisses) ||
      priceKilo < 0 ||
      priceAchat < 0 ||
      priceVente < 0 ||
      nbreCaisses < 0
    ) {
      setErrorMessage(
        'Veuillez vérifier les valeurs saisies.',
      );
      return;
    }

    // Démonstration frontend uniquement : aucune API n'est appelée.
    setShowSuccessModal(true);
  };

  const inputClass =
    'h-12 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10';

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-700';

  const iconClass =
    'pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#71804E]';

  const unitClass =
    'pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400';

  return (
    <>
      <div className="min-h-screen  pb-10">
        <Container>
          {/* En-tête */}
         <div className="py-7">
  <div className="flex flex-wrap items-center justify-between gap-5">
    <div>
      

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Modifier une saison
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Gérez les informations, les tarifs et les dates de votre campagne oléicole.
      </p>
    </div>

    
  </div>
</div>
 

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-15px_rgba(35,48,20,0.18)]">
              {/* Bandeau */}
              <div className="relative overflow-hidden border-b border-slate-100 px-5 py-6 sm:px-8">
                <div className="absolute inset-y-0 left-0 w-1 bg-[#556B2F]" />

                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef3e6]">
                    <Sprout className="size-6 text-[#556B2F]" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Informations de la saison
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Modifiez les champs nécessaires puis
                      enregistrez vos changements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-5 sm:p-8">
                {/* Section 1 : informations générales */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#f0f3e9] text-sm font-bold text-[#556B2F]">
                      01
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Informations générales
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Année et état de la campagne
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Année */}
                    <div>
                      <label htmlFor="year" className={labelClass}>
                        Année de la saison
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Hash className={iconClass} />
                        <input
                          id="year"
                          name="year"
                          type="number"
                          min="1900"
                          max="2100"
                          step="1"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="Ex. 2026"
                          required
                          className={`${inputClass} pl-11 pr-4`}
                        />
                      </div>
                    </div>

                    {/* Statut */}
                    <div>
                      <label htmlFor="statusId" className={labelClass}>
                        Statut
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Clock3 className={iconClass} />
                        <select
                          id="statusId"
                          name="statusId"
                          value={formData.statusId}
                          onChange={handleChange}
                          required
                          className={`${inputClass} appearance-none pl-11 pr-10`}
                        >
                          <option value="1">En cours</option>
                          <option value="2">Clôturée</option>
                        </select>

                        <ChevronRight className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 rotate-90 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="border-t border-dashed border-slate-200" />

                {/* Section 2 : période */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#f0f3e9] text-sm font-bold text-[#556B2F]">
                      02
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Période de la saison
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Définissez les dates de début et de fin
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="beginDate"
                        className={labelClass}
                      >
                        Date de début
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <CalendarDays className={iconClass} />
                        <input
                          id="beginDate"
                          name="beginDate"
                          type="date"
                          value={formData.beginDate}
                          onChange={handleChange}
                          required
                          className={`${inputClass} pl-11 pr-3`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="endDate"
                        className={labelClass}
                      >
                        Date de fin
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <CalendarDays className={iconClass} />
                        <input
                          id="endDate"
                          name="endDate"
                          type="date"
                          min={formData.beginDate || undefined}
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          className={`${inputClass} pl-11 pr-3`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="border-t border-dashed border-slate-200" />

                {/* Section 3 : tarifs */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#f0f3e9] text-sm font-bold text-[#556B2F]">
                      03
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Tarification
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Renseignez les prix en dinars tunisiens
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Prix production */}
                    <div>
                      <label
                        htmlFor="priceKilo"
                        className={labelClass}
                      >
                        Prix de production d’un kilo d’olives
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <CircleDollarSign className={iconClass} />
                        <input
                          id="priceKilo"
                          name="priceKilo"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.priceKilo}
                          onChange={handleChange}
                          placeholder="Ex. 0.80"
                          required
                          className={`${inputClass} pl-11 pr-16`}
                        />
                        <span className={unitClass}>DT/kg</span>
                      </div>
                    </div>

                    {/* Prix achat */}
                    <div>
                      <label
                        htmlFor="priceAchat"
                        className={labelClass}
                      >
                        Prix d’achat d’un litre d’huile
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <ShoppingCart className={iconClass} />
                        <input
                          id="priceAchat"
                          name="priceAchat"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.priceAchat}
                          onChange={handleChange}
                          placeholder="Ex. 18.00"
                          required
                          className={`${inputClass} pl-11 pr-14`}
                        />
                        <span className={unitClass}>DT/L</span>
                      </div>
                    </div>

                    {/* Prix vente */}
                    <div>
                      <label
                        htmlFor="priceVente"
                        className={labelClass}
                      >
                        Prix de vente d’un litre d’huile
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <CircleDollarSign className={iconClass} />
                        <input
                          id="priceVente"
                          name="priceVente"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.priceVente}
                          onChange={handleChange}
                          placeholder="Ex. 20.00"
                          required
                          className={`${inputClass} pl-11 pr-14`}
                        />
                        <span className={unitClass}>DT/L</span>
                      </div>
                    </div>

                    {/* Nombre de caisses */}
                    <div>
                      <label
                        htmlFor="nbreCaisses"
                        className={labelClass}
                      >
                        Nombre de caisses
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Package className={iconClass} />
                        <input
                          id="nbreCaisses"
                          name="nbreCaisses"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.nbreCaisses}
                          onChange={handleChange}
                          placeholder="Ex. 250"
                          required
                          className={`${inputClass} pl-11 pr-4`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Note */}
                

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* Actions */}
<div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-8">
  <div className="flex flex-col-reverse gap-3 sm:flex-row">
    <Button
      type="button"
      variant="outline"
      onClick={handleCancel}
      className="h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600 transition hover:bg-slate-100"
    >
      <X className="mr-2 size-4" />
      Annuler
    </Button>

    <Button
      type="submit"
      className="h-11 rounded-xl bg-[#556B2F] px-6 font-semibold text-white shadow-sm transition hover:bg-[#465A27] hover:shadow-md"
    >
      <Save className="mr-2 size-4" />
      Enregistrer les modifications
    </Button>
  </div>
</div>
            </div>
          </form>
        </Container>
      </div>

      {/* Confirmation frontend */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[3px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="h-1.5 bg-[#556B2F]" />

            <div className="px-7 pb-7 pt-8 text-center sm:px-9">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#eef3e6]">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#556B2F]">
                  <Check className="size-6 text-white" />
                </div>
              </div>

              <h2
                id="success-title"
                className="mt-5 text-xl font-bold text-slate-900"
              >
                Modification confirmée
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Les modifications sont affichées comme confirmées
                dans cette démonstration frontend. Aucune donnée
                n’a été envoyée au serveur.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSuccessModal(false)}
                  className="h-11 rounded-xl px-5"
                >
                  Continuer à modifier
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate('/store-admin/saison')}
                  className="h-11 rounded-xl bg-[#556B2F] px-6 font-semibold text-white hover:bg-[#465A27]"
                >
                  <Check className="mr-2 size-4" />
                  Terminer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
