
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  Search,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

import {
  BonReception,
  BonReceptionTable,
} from './bon-reception-table';

/* ============================================================
   PAGE BON DE RÉCEPTION
============================================================ */

const API_URL = '/olive_app/reception/getListBean';

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
  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const navigate = useNavigate();

  /* ==========================================================
     ÉTATS
  ========================================================== */

  const [bons, setBons] = useState<BonReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Valeur saisie dans le champ de recherche
  const [search, setSearch] = useState('');

  /* ==========================================================
     CHARGEMENT DES BONS DE RÉCEPTION
  ========================================================== */

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

      const records = extractList(data);

      const normalized = records
        .map(normalizeBonReception)
        .filter(
          (item): item is BonReception => item !== null
        );

      setBons(normalized);
    } catch (err) {
      console.error(
        'Erreur chargement bons de réception :',
        err
      );

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

  /* ==========================================================
     CHARGEMENT INITIAL
  ========================================================== */

  useEffect(() => {
    // L'API retourne actuellement une erreur 500 si searche est vide.
    // Cette valeur temporaire permet de tester le chargement initial.
    void loadBons('a');
  }, [loadBons]);

  /* ==========================================================
     RECHERCHE
  ========================================================== */

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
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
    setError('');

    // On recharge avec la valeur de recherche connue comme fonctionnelle.
    void loadBons('a');
  };

  /* ==========================================================
     BON À SUPPRIMER
  ========================================================== */

  const [bonToDelete, setBonToDelete] =
    useState<BonReception | null>(null);

  /* ==========================================================
     MODIFIER
  ========================================================== */

  const handleEdit = (bon: BonReception) => {
  navigate(`/store-admin/reception-vouchers/edit/${bon.id}`);
};

  /* ==========================================================
     SUPPRIMER
  ========================================================== */

  const handleDelete = (bon: BonReception) => {
    setBonToDelete(bon);
  };

  /* ==========================================================
     ANNULER SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {
    setBonToDelete(null);
  };

  /* ==========================================================
     CONFIRMER SUPPRESSION
  ========================================================== */

  const handleConfirmDelete = () => {
    if (!bonToDelete) return;

    // Suppression locale uniquement.
    // Il faudra appeler l'API DELETE pour supprimer en base de données.
    setBons((current) =>
      current.filter((item) => item.id !== bonToDelete.id)
    );

    setBonToDelete(null);
  };

  /* ==========================================================
     AJOUTER
  ========================================================== */

  const handleAdd = () => {
    navigate('/store-admin/reception-vouchers/add');
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* HEADER */}

      <Container>
        <div className="flex min-w-0 flex-col gap-4 py-4 sm:py-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Bon de réception
            </h1>

            
          </div>

          <Button
            onClick={handleAdd}
            className="w-full shrink-0 bg-[#556B2F] hover:bg-[#465A27] md:w-auto"
          >
            <Plus className="size-4 shrink-0" />
            Ajouter un bon de réception
          </Button>
        </div>
      </Container>

      {/* RECHERCHE ET TABLEAU */}

      <Container>
        

        {loading && (
          <p className="py-4 text-sm text-muted-foreground">
            Chargement des bons de réception...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={() => void loadBons(search.trim() || 'a')}
              className="ml-3 font-semibold underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              {bons.length} bon(s) de réception affiché(s).
            </p>

            <BonReceptionTable
              bons={bons}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </Container>

      {/* MODALE SUPPRESSION */}

      {bonToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={handleCancelDelete}
        >
          <div
            className="relative w-full max-w-[500px] rounded-xl bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-5 top-5 text-gray-500 transition hover:text-gray-800"
              aria-label="Fermer"
            >
              <X className="size-6" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="size-10 text-red-500" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Supprimer le bon de réception
              </h2>

              <p className="mt-3 text-base text-gray-500">
                Voulez-vous vraiment supprimer
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                le bon {bonToDelete.reference} ?
              </p>
            </div>

            <div className="mt-7 flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-12 min-w-[125px]"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-12 min-w-[150px] bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-5" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
