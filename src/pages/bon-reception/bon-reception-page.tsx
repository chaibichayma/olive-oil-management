
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  FileText,
  ChevronRight,
  Leaf,
  TrendingUp,
  UserRound,
  Scale,
  Clock3,
  Factory,
  CreditCard,
  CircleCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

import {
  BonReception,
  BonReceptionTable,
} from './bon-reception-table';


const API_URL = '/olive_app/reception/getListBean';
const OLIVE_BANNER = '/images/olive-banner.png';

type ApiObject = Record<string, unknown>;


function extractList(data: unknown): ApiObject[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is ApiObject =>
        typeof item === 'object' && item !== null
    );
  }

  if (typeof data !== 'object' || data === null) {
    return [];
  }

  const obj = data as ApiObject;

  for (const key of [
    'data',
    'content',
    'result',
    'results',
    'items',
    'list',
    'receptions',
  ]) {
    const value = obj[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is ApiObject =>
          typeof item === 'object' && item !== null
      );
    }
  }

  return [];
}

function readValue(
  obj: ApiObject,
  keys: string[]
): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return undefined;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const result = Number(value.replace(',', '.').trim());
    return Number.isFinite(result) ? result : 0;
  }

  return 0;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;

  if (typeof value === 'string') {
    return ['true', '1', 'oui', 'yes'].includes(
      value.trim().toLowerCase()
    );
  }

  return false;
}

function formatDate(value: unknown): string {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return '';
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;

    return `${String(day).padStart(2, '0')}/${String(
      month
    ).padStart(2, '0')}/${year}`;
  }

  const raw = String(value).trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  return raw;
}

function normalizeBonReception(
  item: ApiObject
): BonReception | null {
  const rawId = readValue(item, [
    'id',
    'receptionId',
    'idReception',
    'id_reception',
  ]);

  if (rawId === undefined || rawId === '') {
    console.warn('Identifiant absent pour ce bon :', item);
    return null;
  }

  const reference = readValue(item, [
    'reference',
    'ref',
    'referenceReception',
    'referenceBon',
  ]);

  return {
    id: toNumber(rawId),

    reference: String(reference ?? ''),

    compteId: toNumber(
      readValue(item, ['compteId', 'idCompte', 'compte_id'])
    ),

    name: String(
      readValue(item, ['name', 'nom', 'client', 'nomClient']) ?? ''
    ),

    mobile: String(
      readValue(item, ['mobile', 'telephone', 'tel', 'phone']) ?? ''
    ),

    quantityOil: toNumber(
      readValue(item, [
        'quantityOil',
        'quantiteHuile',
        'quantite_huile',
      ])
    ),

    quantityOlive: toNumber(
      readValue(item, [
        'quantityOlive',
        'quantiteOlive',
        'quantite_olive',
      ])
    ),

    priceKg: toNumber(
      readValue(item, ['priceKg', 'prixKg', 'prix_kg'])
    ),

    price: toNumber(
      readValue(item, ['price', 'prix', 'montant'])
    ),

    payement: toNumber(
      readValue(item, ['payement', 'payment', 'paiement'])
    ),

    acompte: toNumber(
      readValue(item, ['acompte', 'avance'])
    ),

    statusId: String(
      readValue(item, ['statusId', 'idStatut', 'status_id']) ?? ''
    ),

    statusLib: String(
      readValue(item, ['statusLib', 'libelleStatut', 'status']) ?? ''
    ),

    caisse: String(
      readValue(item, ['caisse', 'nomCaisse']) ?? ''
    ),

    natureId: toNumber(
      readValue(item, ['natureId', 'idNature', 'nature_id'])
    ),

    priceOil: toNumber(
      readValue(item, ['priceOil', 'prixHuile', 'prix_huile'])
    ),

    observation: String(
      readValue(item, ['observation', 'remarque']) ?? ''
    ),

    typeHuile: toNumber(
      readValue(item, ['typeHuile', 'idTypeHuile', 'type_huile'])
    ),

    isBaseCompte: toBoolean(
      readValue(item, [
        'isBaseCompte',
        'baseCompte',
        'is_base_compte',
      ])
    ),

    dateCreation: formatDate(
      readValue(item, ['dateCreation', 'date', 'createdDate'])
    ),

    dateDebProduction: formatDate(
      readValue(item, ['dateDebProduction', 'dateDebutProduction'])
    ),

    dateFinProduction: formatDate(
      readValue(item, ['dateFinProduction', 'dateFinProduction'])
    ),
  };
}


export function BonReceptionPage() {
  const navigate = useNavigate();

  const [bons, setBons] = useState<BonReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [bonToDelete, setBonToDelete] =
    useState<BonReception | null>(null);
  
const receptionStats = [
  {
    label: 'Total des bons',
    value: 40,
    icon: FileText,
    color: 'bg-[#edf4e5] text-[#556B2F]',
    trend: true,
  },
  {
    label: 'Non affectés',
    value: 12,
    icon: UserRound,
    color: 'bg-blue-50 text-blue-500',
  },
  {
    label: 'Non pesés',
    value: 8,
    icon: Scale,
    color: 'bg-orange-50 text-orange-500',
  },
  {
    label: 'En attente',
    value: 6,
    icon: Clock3,
    color: 'bg-purple-50 text-purple-500',
  },
  {
    label: 'Fin production',
    value: 10,
    icon: Factory,
    color: 'bg-green-50 text-green-600',
  },
  {
    label: 'Non payés',
    value: 4,
    icon: CreditCard,
    color: 'bg-rose-50 text-rose-500',
  },
  {
    label: 'Validés',
    value: 20,
    icon: CircleCheck,
    color: 'bg-cyan-50 text-cyan-600',
  },
];

function ReceptionStats() {
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 lg:grid-cols-7 lg:divide-y-0">
        {receptionStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex min-w-0 items-center gap-2.5 px-3 py-3 transition-colors hover:bg-slate-50/80 sm:px-4"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon className="size-5" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold leading-none tracking-tight text-slate-800">
                    {stat.value}
                  </span>

                  {stat.trend && (
                    <TrendingUp className="size-3.5 text-green-500" />
                  )}
                </div>

                <p className="mt-1 truncate text-[10px] font-medium leading-tight text-slate-500 sm:text-[11px]">
                  {stat.label}
                </p>

                {stat.trend && (
                  <p className="mt-0.5 text-[9px] font-semibold text-green-600">
                    +12%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


  const loadBons = useCallback(async (searchValue: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}?searche=${encodeURIComponent(searchValue.trim())}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Erreur HTTP ${response.status}${
            details ? ` : ${details}` : ''
          }`
        );
      }

      const data: unknown = await response.json();

      console.log('Réponse GET bons de réception :', data);

      const normalized = extractList(data)
        .map(normalizeBonReception)
        .filter(
          (item): item is BonReception => item !== null
        );

      setBons(normalized);
    } catch (err) {
      console.error('Erreur chargement des bons :', err);
      setBons([]);

      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de récupérer les bons de réception.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBons('a');
  }, [loadBons]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      setError('Veuillez saisir un terme de recherche.');
      return;
    }

    void loadBons(searchValue);
  };

  const handleResetSearch = () => {
    setSearch('');
    void loadBons('a');
  };

  const handleAdd = () => {
  navigate('/store-admin/reception-vouchers/add');
};

const handleEdit = (bon: BonReception) => {
  navigate(`/store-admin/reception-vouchers/edit/${bon.id}`);
};

  const handleDelete = (bon: BonReception) => {
    setBonToDelete(bon);
  };

  const handleCancelDelete = () => {
    setBonToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!bonToDelete) return;

    // Suppression locale uniquement : prévoir l'appel à l'API DELETE.
    setBons((current) =>
      current.filter((item) => item.id !== bonToDelete.id)
    );

    setBonToDelete(null);
  };

  return (
    <>
      <Container>
        <div className="py-4 sm:py-6">

          <section className="relative isolate overflow-hidden rounded-2xl border border-[#e7ebdf] bg-gradient-to-r from-[#fbfcf7] via-[#f5f7ed] to-[#edf2df] shadow-sm">

            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-90 sm:w-[58%]"
              aria-hidden="true"
            >
              <img
                src={OLIVE_BANNER}
                alt=""
                className="h-full w-full object-cover object-center"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbfcf7] via-[#f7f8f0]/85 to-transparent" />
            </div>

            <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:min-h-[190px] lg:flex-row lg:items-center lg:justify-between lg:px-7">

              {/* TITRE ET DESCRIPTION */}

              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#e1e9d3] bg-[#edf3e3]/95 text-[#556B2F] shadow-sm sm:size-16">
                  <FileText className="size-7 sm:size-8" strokeWidth={1.8} />
                </div>

                <div className="min-w-0 pt-0.5">
                  <h1 className="text-2xl font-bold tracking-tight text-[#25351e] sm:text-3xl">
                    Bon de réception
                  </h1>

                  <p className="mt-2 max-w-[480px] text-sm leading-6 text-slate-600 sm:text-base">
                    Consultez, gérez et suivez tous les bons de
                    réception d’olives reçues de vos fournisseurs.
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#62764b] sm:text-sm">
                    <Leaf className="size-4" />
                    <span>Gestion des olives et de la production d’huile</span>
                  </div>
                </div>
              </div>

              {/* ACTIONS À DROITE */}

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:max-w-[260px] lg:flex-col">
                <Button
                  type="button"
                  onClick={handleAdd}
                  className="h-11 w-full rounded-xl bg-[#556B2F] px-5 font-semibold text-white shadow-md shadow-[#556B2F]/15 transition-all hover:-translate-y-0.5 hover:bg-[#465A27] hover:shadow-lg"
                >
                  <Plus className="mr-2 size-5" />
                  Ajouter un bon de réception
                </Button>

                <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/85 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3e3] text-[#556B2F]">
                    <Leaf className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 sm:text-sm">
                      Traçabilité garantie
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                      De la réception à la production
                    </p>
                  </div>

                  <ChevronRight className="ml-auto size-4 shrink-0 text-slate-400" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>

<Container>


            <BonReceptionTable
  bons={bons}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
      </Container>

      {bonToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="relative w-full max-w-[460px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 className="size-8" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2
                id="delete-dialog-title"
                className="text-xl font-bold text-slate-900 sm:text-2xl"
              >
                Supprimer le bon de réception ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Cette action retirera le bon suivant de la liste :
              </p>

              <p className="mt-2 inline-flex rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-800">
                {bonToDelete.reference || `Bon n° ${bonToDelete.id}`}
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-11 rounded-xl px-5"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-11 rounded-xl bg-red-500 px-5 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
