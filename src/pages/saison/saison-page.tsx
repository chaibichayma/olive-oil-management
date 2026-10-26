
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  Sprout,
  Search,
  RefreshCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

import { Saison, SaisonTable } from './saison-table';
import { deleteSeason, getSeasons } from '@/api/season.api';

export function SaisonPage() {
  const navigate = useNavigate();

  const [saisons, setSaisons] = useState<Saison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searche, setSearche] = useState('');
  const [saisonToDelete, setSaisonToDelete] =
    useState<Saison | null>(null);

  // ======================================================
  // CHARGEMENT DES SAISONS DEPUIS L'API
  // ======================================================

  const chargerSaisons = useCallback(async (recherche: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await getSeasons(recherche);
      setSaisons(data as Saison[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les saisons.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void chargerSaisons(searche);
  }, [chargerSaisons, searche]);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleAdd = () => {
    navigate('/store-admin/saison/ajouter');
  };

  const handleEdit = (saison: Saison) => {
    navigate('/store-admin/saison/ajouter', {
      state: { saison },
    });
  };

  // ======================================================
  // SUPPRESSION
  // ======================================================

  const handleDelete = (saison: Saison) => {
    setSaisonToDelete(saison);
  };

  const handleCancelDelete = () => {
    if (deleteLoading) return;
    setSaisonToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!saisonToDelete || deleteLoading) return;

    const id = saisonToDelete.id;

    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ''
    ) {
      setError('Identifiant de saison introuvable.');
      return;
    }

    setDeleteLoading(true);
    setError('');

    try {
      await deleteSeason(String(id));

      setSaisonToDelete(null);
      await chargerSaisons(searche);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la suppression de la saison.',
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ======================================================
  // AFFICHAGE
  // ======================================================

  return (
    <>
      {/* EN-TÊTE */}
      <Container>
        <div className="py-4 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#e2ead7] bg-[#f1f6eb]">
                <Sprout
                  className="size-7 text-[#526B2F]"
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-[28px]">
                  Saisons
                </h1>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Gérez les campagnes et les paramètres de production
                  d'huile d'olive.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-xl border border-[#526B2F] bg-[#526B2F] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#435725]"
            >
              <Plus className="size-[18px]" strokeWidth={2.2} />
              Ajouter une saison
            </Button>
          </div>

          {/* RECHERCHE ET ACTUALISATION */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searche}
                onChange={(event) => setSearche(event.target.value)}
                placeholder="Rechercher une saison..."
                aria-label="Rechercher une saison"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void chargerSaisons(searche)}
              disabled={loading}
              className="h-11 gap-2 rounded-lg"
            >
              <RefreshCcw
                className={`size-4 ${loading ? 'animate-spin' : ''}`}
              />
              Actualiser
            </Button>
          </div>
        </div>
      </Container>

      {/* TABLEAU DES SAISONS */}
      <Container>
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => void chargerSaisons(searche)}
              className="shrink-0 font-semibold underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-sm text-slate-500">
            <RefreshCcw className="size-6 animate-spin text-[#526B2F]" />
            Chargement des saisons...
          </div>
        ) : (
          <SaisonTable
            saisons={saisons}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Container>

      {/* MODALE DE SUPPRESSION */}
      {saisonToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-season-title"
            className="relative w-full max-w-[500px] rounded-xl bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={deleteLoading}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <X className="size-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="size-10 text-red-500" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2
                id="delete-season-title"
                className="text-2xl font-bold text-gray-900"
              >
                Supprimer la saison
              </h2>

              <p className="mt-3 text-base text-gray-500">
                Voulez-vous vraiment supprimer la saison
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {saisonToDelete.year} ?
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse justify-center gap-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
                className="h-12 min-w-[125px] rounded-lg"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={deleteLoading}
                className="h-12 min-w-[150px] rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="mr-2 size-5" />
                {deleteLoading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SaisonPage;
