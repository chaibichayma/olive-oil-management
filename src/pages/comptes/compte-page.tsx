
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  X,
  BriefcaseBusiness,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { deleteCompte, getComptes } from '@/services/api';

import { type Compte, CompteTable } from './compte-table';

export function ComptePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compteToDelete, setCompteToDelete] =
    useState<Compte | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Charger les comptes depuis le backend.
  const chargerComptes = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response: unknown = await getComptes();

      console.log('Réponse API des comptes :', response);

      let data: unknown = response;

      if (!Array.isArray(data) && data && typeof data === 'object') {
        const result = data as Record<string, unknown>;

        data =
          result.data ??
          result.result ??
          result.content ??
          result.comptes ??
          result.list ??
          result.body;
      }

      if (!Array.isArray(data)) {
        throw new Error(
          'Le format de la réponse API des comptes est invalide.',
        );
      }

      // Remplacer complètement les données affichées par celles de l'API.
      setComptes(data as Compte[]);
    } catch (err) {
      console.error('Erreur de chargement des comptes :', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les comptes.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial et rechargement lors d'un retour vers la liste.
  useEffect(() => {
    void chargerComptes();
  }, [chargerComptes, location.key]);

  // Navigation vers le formulaire d'ajout.
  const handleAdd = () => {
    navigate('/store-admin/accounts/form');
  };

  // Navigation vers le formulaire de modification.
  const handleEdit = (compte: Compte) => {
    navigate('/store-admin/accounts/form', {
      state: { compte },
    });
  };

  // Ouvrir la confirmation de suppression.
  const handleDelete = (compte: Compte) => {
    setDeleteError('');
    setError('');
    setCompteToDelete(compte);
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setCompteToDelete(null);
    setDeleteError('');
  };

  // Supprimer le compte depuis le backend.
  const handleConfirmDelete = async () => {
    if (!compteToDelete || deleting) return;

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteCompte(compteToDelete.compteId);

      setCompteToDelete(null);

      // Recharger les données réelles du backend.
      await chargerComptes();
    } catch (err) {
      console.error('Erreur de suppression :', err);

      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Impossible de supprimer ce compte.',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Container>
        <header className="w-full py-5 sm:py-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e1e9d7] bg-[#f0f5e8]">
                <BriefcaseBusiness className="size-6 text-[#556B2F]" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-[#172033] sm:text-2xl">
                  Gestion des comptes
                </h1>

                <p className="mt-1 text-sm leading-5 text-slate-500 sm:text-[15px]">
                  Centralisez les comptes, les coordonnées et les paramètres de conversion.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => void chargerComptes()}
                disabled={loading}
                className="h-10 gap-2 rounded-lg border-[#dfe4d9] px-4 text-sm font-medium text-[#556B2F]"
              >
                <RefreshCw
                  className={`size-4 ${loading ? 'animate-spin' : ''}`}
                />
                Actualiser
              </Button>

              <Button
                type="button"
                onClick={handleAdd}
                className="h-10 gap-2 rounded-lg bg-[#556B2F] px-4 text-sm font-semibold text-white hover:bg-[#465A27]"
              >
                <Plus className="size-4" />
                Ajouter un compte
              </Button>
            </div>
          </div>

          <div className="mt-6 border-b border-[#e8ebdf]" />
        </header>
      </Container>

      <Container>
        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>

            <Button
              type="button"
              variant="outline"
              onClick={() => void chargerComptes()}
              className="gap-2 border-red-200 bg-white"
            >
              <RefreshCw className="size-4" />
              Réessayer
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
            <RefreshCw className="size-5 animate-spin text-[#556B2F]" />
            Chargement des comptes...
          </div>
        ) : (
          <CompteTable
            comptes={comptes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Container>

      {compteToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={deleting}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="size-7 text-red-500" />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2
                id="delete-account-title"
                className="text-xl font-bold tracking-tight text-slate-900"
              >
                Supprimer le compte ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Voulez-vous vraiment supprimer le compte suivant ?
              </p>

              <p className="mt-2 break-words font-semibold text-slate-800">
                {compteToDelete.name}
              </p>
            </div>

            {deleteError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700"
              >
                {deleteError}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                disabled={deleting}
                className="h-11 min-w-[120px] rounded-lg border-slate-200"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={deleting}
                className="h-11 min-w-[145px] rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4" />
                )}
                {deleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ComptePage;
