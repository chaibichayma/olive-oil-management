import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  FileText,
  Hash,
  Phone,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';

import { BonReception } from './bon-reception-table';


interface BonReceptionHistoryProps {
  compteId: number | null;

  bons: BonReception[];

  onClose: () => void;
}


export function BonReceptionHistory({
  compteId,
  bons,
  onClose,
}: BonReceptionHistoryProps) {

  if (compteId === null) {
    return null;
  }


  const compteBons = bons.filter(
    (bon) =>
      bon.compteId === compteId,
  );


  const currentBon =
    compteBons[0];

  const accountName =
    currentBon?.name ||
    'Compte inconnu';


  const mobile =
    currentBon?.mobile ||
    '—';


  const totalBons =
    compteBons.length;


  const totalOlives =
    compteBons.reduce(
      (total, bon) =>
        total + bon.quantityOlive,
      0,
    );


  const totalOil =
    compteBons.reduce(
      (total, bon) =>
        total + bon.quantityOil,
      0,
    );


  const totalPrice =
    compteBons.reduce(
      (total, bon) =>
        total + bon.price,
      0,
    );


  /* ==========================================================
     FORMAT NOMBRE
  ========================================================== */

  const formatNumber = (
    value: number,
  ) => {

    return value.toLocaleString(
      'fr-FR',
      {
        maximumFractionDigits: 2,
      },
    );

  };



  const formatPrice = (
    value: number,
  ) => {

    return value.toLocaleString(
      'fr-FR',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  };


  const getStatusStyle = (
    status: string,
  ) => {

    if (status === 'En cours') {

      return {
        container:
          'bg-[#dcfce7] text-[#16833b]',

        icon:
          <CheckCircle2 className="size-3.5" />,
      };

    }


    if (status === 'Terminé') {

      return {
        container:
          'bg-[#dbeafe] text-[#2563eb]',

        icon:
          <CheckCircle2 className="size-3.5" />,
      };

    }


    if (status === 'En attente') {

      return {
        container:
          'bg-[#ffedd5] text-[#ea580c]',

        icon:
          <Clock3 className="size-3.5" />,
      };

    }


    if (status === 'Annulé') {

      return {
        container:
          'bg-[#fee2e2] text-[#dc2626]',

        icon:
          <XCircle className="size-3.5" />,
      };

    }


    return {
      container:
        'bg-gray-100 text-gray-600',

      icon:
        <Clock3 className="size-3.5" />,
    };

  };


  return (

    <div
      className="fixed inset-0 z-[60] bg-black/30"
      onClick={onClose}
    >

      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#eef4e6]">

              <FileText className="size-5 text-[#556B2F]" />

            </div>

            <div>

              <h2 className="text-lg font-bold text-[#172033]">
                Historique des bons
              </h2>

              <p className="mt-0.5 text-xs text-[#94a3b8]">
                Historique du compte
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#172033]"
            aria-label="Fermer"
          >

            <X className="size-5" />

          </button>

        </div>

        <div className="flex-1 overflow-y-auto">

          <div className="border-b border-[#edf0f2] bg-[#fafcf9] px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e6f0dc]">

                <UserRound className="size-7 text-[#556B2F]" />

              </div>
              <div className="min-w-0">

                <h3 className="truncate text-lg font-bold text-[#172033]">
                  {accountName}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b]">

                  <span className="flex items-center gap-1.5">

                    <Hash className="size-3.5" />

                    Compte #{compteId}

                  </span>


                  <span className="flex items-center gap-1.5">

                    <Phone className="size-3.5" />

                    {mobile}

                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 border-b border-[#edf0f2] p-5">


            {/* TOTAL BONS */}

            <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

              <div className="flex items-center gap-2">

                <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6]">

                  <FileText className="size-4 text-[#556B2F]" />

                </div>

                <span className="text-xs text-[#64748b]">
                  Total bons
                </span>

              </div>

              <p className="mt-2 text-xl font-bold text-[#172033]">
                {totalBons}
              </p>

            </div>


            {/* OLIVES */}

            <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

              <div className="flex items-center gap-2">

                <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff1df]">

                  <Droplets className="size-4 text-[#ea580c]" />

                </div>

                <span className="text-xs text-[#64748b]">
                  Olives
                </span>

              </div>

              <p className="mt-2 text-xl font-bold text-[#172033]">

                {formatNumber(
                  totalOlives,
                )}

                <span className="ml-1 text-xs font-medium text-[#94a3b8]">
                  kg
                </span>

              </p>

            </div>


            {/* HUILE */}

            <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

              <div className="flex items-center gap-2">

                <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f1ff]">

                  <Droplets className="size-4 text-[#2563eb]" />

                </div>

                <span className="text-xs text-[#64748b]">
                  Huile produite
                </span>

              </div>

              <p className="mt-2 text-xl font-bold text-[#172033]">

                {formatNumber(
                  totalOil,
                )}

                <span className="ml-1 text-xs font-medium text-[#94a3b8]">
                  L
                </span>

              </p>

            </div>


            {/* TOTAL */}

            <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">

              <div className="flex items-center gap-2">

                <div className="flex size-8 items-center justify-center rounded-lg bg-[#e8f7ed]">

                  <span className="text-sm font-bold text-[#16833b]">
                    DT
                  </span>

                </div>

                <span className="text-xs text-[#64748b]">
                  Montant total
                </span>

              </div>

              <p className="mt-2 text-xl font-bold text-[#172033]">

                {formatPrice(
                  totalPrice,
                )}

                <span className="ml-1 text-xs font-medium text-[#94a3b8]">
                  DT
                </span>

              </p>

            </div>

          </div>

          <div className="px-6 pt-5">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-sm font-bold text-[#172033]">
                  Historique des réceptions
                </h3>

                <p className="mt-1 text-xs text-[#94a3b8]">
                  Les bons associés à ce compte
                </p>

              </div>

              <span className="rounded-full bg-[#eef4e6] px-3 py-1 text-xs font-semibold text-[#556B2F]">
                {totalBons} bon{totalBons > 1 ? 's' : ''}
              </span>

            </div>

          </div>

          <div className="px-6 pb-6 pt-5">

            {compteBons.length === 0 ? (

              <div className="rounded-xl border border-dashed border-[#d9dee5] p-8 text-center">

                <FileText className="mx-auto size-8 text-[#94a3b8]" />

                <p className="mt-3 text-sm font-medium text-[#64748b]">
                  Aucun bon de réception
                </p>

              </div>

            ) : (

              <div className="relative">

                {/* Ligne verticale */}

                <div className="absolute bottom-4 left-[17px] top-4 w-px bg-[#e5e7eb]" />


                <div className="space-y-5">

                  {compteBons.map(
                    (bon) => {

                      const statusStyle =
                        getStatusStyle(
                          bon.statusLib,
                        );

                      return (

                        <div
                          key={bon.id}
                          className="relative flex gap-4"
                        >

                          {/* POINT */}

                          <div className="relative z-10 flex size-[35px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#eef4e6]">

                            <div className="size-2 rounded-full bg-[#556B2F]" />

                          </div>


                          {/* CARTE */}

                          <div className="min-w-0 flex-1 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">


                            {/* HEADER BON */}

                            <div className="flex items-start justify-between gap-3">

                              <div>

                                <div className="flex items-center gap-2">

                                  <span className="text-sm font-bold text-[#172033]">
                                    {bon.reference}
                                  </span>

                                  <span className="text-[11px] text-[#94a3b8]">
                                    #{bon.id}
                                  </span>

                                </div>


                                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">

                                  <CalendarDays className="size-3.5" />

                                  {bon.dateCreation}

                                </div>

                              </div>


                              {/* STATUT */}

                              <span
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${statusStyle.container}`}
                              >

                                {statusStyle.icon}

                                {bon.statusLib}

                              </span>

                            </div>


                            {/* INFORMATIONS */}

                            <div className="mt-4 grid grid-cols-2 gap-3">

                              <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                <p className="text-[10px] text-[#94a3b8]">
                                  Olives
                                </p>

                                <p className="mt-0.5 text-xs font-semibold text-[#334155]">

                                  {formatNumber(
                                    bon.quantityOlive,
                                  )}

                                  {' kg'}

                                </p>

                              </div>


                              <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                <p className="text-[10px] text-[#94a3b8]">
                                  Huile
                                </p>

                                <p className="mt-0.5 text-xs font-semibold text-[#334155]">

                                  {formatNumber(
                                    bon.quantityOil,
                                  )}

                                  {' L'}

                                </p>

                              </div>


                              <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                <p className="text-[10px] text-[#94a3b8]">
                                  Prix/kg
                                </p>

                                <p className="mt-0.5 text-xs font-semibold text-[#334155]">

                                  {formatPrice(
                                    bon.priceKg,
                                  )}

                                  {' DT'}

                                </p>

                              </div>


                              <div className="rounded-lg bg-[#f8fafc] p-2.5">

                                <p className="text-[10px] text-[#94a3b8]">
                                  Montant
                                </p>

                                <p className="mt-0.5 text-xs font-bold text-[#556B2F]">

                                  {formatPrice(
                                    bon.price,
                                  )}

                                  {' DT'}

                                </p>

                              </div>

                            </div>


                            {/* PAIEMENT */}

                            <div className="mt-3 flex items-center justify-between border-t border-[#edf0f2] pt-3 text-xs">

                              <span className="text-[#64748b]">
                                Paiement
                              </span>

                              <span className="font-semibold text-[#334155]">

                                {formatPrice(
                                  bon.payement,
                                )}

                                {' DT'}

                              </span>

                            </div>


                            <div className="mt-1 flex items-center justify-between text-xs">

                              <span className="text-[#64748b]">
                                Acompte
                              </span>

                              <span className="font-semibold text-[#334155]">

                                {formatPrice(
                                  bon.acompte,
                                )}

                                {' DT'}

                              </span>

                            </div>


                            {bon.observation && (

                              <div className="mt-3 rounded-lg bg-[#f8fafc] p-3">

                                <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">
                                  Observation
                                </p>

                                <p className="mt-1 text-xs text-[#475569]">
                                  {bon.observation}
                                </p>

                              </div>

                            )}

                          </div>

                        </div>

                      );

                    },
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

        <div className="border-t border-[#e5e7eb] bg-white px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white text-sm font-semibold text-[#334155] transition hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
          >

            Fermer

          </button>

        </div>

      </div>

    </div>
  );
}