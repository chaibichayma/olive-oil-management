
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  Users,
  RefreshCcw,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

import {
  UtilisateurTable,
  type Utilisateur,
} from './utilisateur-table';

import { utilisateurApi } from '@/services/api';

// ======================================================
// PAGE UTILISATEURS
// ======================================================

export function UtilisateurPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [utilisateurToDelete, setUtilisateurToDelete] =
    useState<Utilisateur | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ======================================================
  // CHARGEMENT DES UTILISATEURS DEPUIS L'API
  // ======================================================

  const chargerUtilisateurs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await utilisateurApi.getList('');

      let data: unknown = response;

      // Normaliser les différents formats possibles de réponse.
      if (!Array.isArray(data) && data && typeof data === 'object') {
        const objet = data as Record<string, unknown>;

        data =
          objet.data ??
          objet.content ??
          objet.result ??
          objet.utilisateurs ??
          objet.users ??
          objet.list ??
          objet.body ??
          [];
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Le format de la réponse API n'est pas un tableau d'utilisateurs.",
        );
      }

      const liste: Utilisateur[] = data.map(
        (element: unknown, index: number) => {
          const item = element as Record<string, unknown>;

          return {
            id: Number(item.id ?? item.userId ?? index + 1),
            displayName: String(
              item.displayName ??
                item.name ??
                item.nom ??
                item.fullName ??
                '',
            ),
            userName: String(
              item.userName ??
                item.username ??
                item.login ??
                item.nomUtilisateur ??
                '',
            ),
            mail: String(
              item.mail ??
                item.email ??
                item.emailAddress ??
                '',
            ),

            // Ne jamais afficher le mot de passe reçu de l'API.
            password: '',

            userCode: String(
              item.userCode ??
                item.code ??
                item.codeUtilisateur ??
                '',
            ),

            isActive:
              item.isActive === true ||
              item.isActive === 1 ||
              item.isActive === 'true' ||
              item.active === true ||
              item.actif === true,
          };
        },
      );

      setUtilisateurs(liste);
    } catch (err: unknown) {
      console.error(
        'Erreur de chargement des utilisateurs :',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de récupérer les utilisateurs.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial et actualisation après navigation.
  useEffect(() => {
    void chargerUtilisateurs();
  }, [chargerUtilisateurs, location.key]);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleAdd = () => {
    navigate('/store-admin/users/ajouter');
  };

  const handleEdit = (utilisateur: Utilisateur) => {
    navigate('/store-admin/users/ajouter', {
      state: { utilisateur },
    });
  };

  // ======================================================
  // SUPPRESSION
  // ======================================================

  const handleDelete = (utilisateur: Utilisateur) => {
    setDeleteError(null);
    setUtilisateurToDelete(utilisateur);
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeleteError(null);
    setUtilisateurToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!utilisateurToDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await utilisateurApi.delete(
        utilisateurToDelete.id,
      );

      if (response?.isValid === false) {
        throw new Error(
          response.message || 'La suppression a échoué.',
        );
      }

      // Recharger les données du backend après suppression.
      setUtilisateurToDelete(null);
      await chargerUtilisateurs();
    } catch (err: unknown) {
      console.error(
        'Erreur lors de la suppression :',
        err,
      );

      setDeleteError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer cet utilisateur.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // AFFICHAGE
  // ======================================================

  return (
    <>
      <Container>
        <div className="py-5 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Utilisateurs
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Gérez les utilisateurs du système, leurs rôles et leurs
                permissions.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => void chargerUtilisateurs()}
                disabled={loading}
                className="h-11 gap-2 rounded-lg border-slate-200"
              >
                <RefreshCcw
                  className={`size-4 ${loading ? 'animate-spin' : ''}`}
                />
                Actualiser
              </Button>

              <Button
                type="button"
                onClick={handleAdd}
                className="h-11 w-full shrink-0 gap-2 rounded-lg bg-[#556B2F] px-5 font-medium text-white shadow-sm transition-colors hover:bg-[#465A27] sm:w-auto"
              >
                <Plus className="size-4" />
                Ajouter un utilisateur
              </Button>
            </div>
          </div>

          <section className="mt-6 flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 sm:px-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F4E9]">
              <Users className="size-6 text-[#556B2F]" />
            </div>

            <div className="h-11 w-px shrink-0 bg-[#C9D6B5]" />

            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-[#172033] sm:text-lg">
                Gérez facilement vos utilisateurs
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Ajoutez, modifiez ou désactivez des utilisateurs et
                définissez leurs rôles.
              </p>
            </div>
          </section>
        </div>
      </Container>

      <Container>
        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white">
            <RefreshCcw className="size-7 animate-spin text-[#556B2F]" />
            <p className="text-sm text-slate-500">
              Chargement des utilisateurs...
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-red-800">
                  Erreur de chargement
                </h2>

                <p className="mt-1 break-words text-sm text-red-700">
                  {error}
                </p>

                <Button
                  type="button"
                  onClick={() => void chargerUtilisateurs()}
                  className="mt-4 h-9 rounded-lg bg-[#556B2F] text-white hover:bg-[#465A27]"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <UtilisateurTable
            utilisateurs={utilisateurs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Container>

      {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
      {utilisateurToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="relative w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={deleting}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
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
                id="delete-user-title"
                className="text-xl font-bold tracking-tight text-slate-900"
              >
                Supprimer l'utilisateur ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Cette action supprimera définitivement cet utilisateur
                du système.
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {utilisateurToDelete.displayName}
              </p>

              {deleteError && (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>{deleteError}</p>
                  </div>
                </div>
              )}
            </div>

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
                  <RefreshCcw className="mr-2 size-4 animate-spin" />
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

export default UtilisateurPage;
