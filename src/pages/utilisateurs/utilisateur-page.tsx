
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  X,
  ChevronRight,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Utilisateur, UtilisateurTable } from './utilisateur-table';

export function UtilisateurPage() {
  const navigate = useNavigate();

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([
    { id: 1, displayName: 'Ayah Ben Ali', userName: 'ayah', mail: 'ayah@example.com', password: 'demo123', userCode: 'U001', isActive: true },
    { id: 2, displayName: 'Mohamed', userName: 'mohamed', mail: 'mohamed@example.com', password: 'demo123', userCode: 'U002', isActive: true },
    { id: 3, displayName: 'Salma', userName: 'salma', mail: 'salma@example.com', password: 'demo123', userCode: 'U003', isActive: false },
    { id: 4, displayName: 'Youssef', userName: 'youssef', mail: 'youssef@example.com', password: 'demo123', userCode: 'U004', isActive: true },
    { id: 5, displayName: 'Amine', userName: 'amine', mail: 'amine@example.com', password: 'demo123', userCode: 'U005', isActive: true },
    { id: 6, displayName: 'Sarra', userName: 'sarra', mail: 'sarra@example.com', password: 'demo123', userCode: 'U006', isActive: false },
    { id: 7, displayName: 'Houssem', userName: 'houssem', mail: 'houssem@example.com', password: 'demo123', userCode: 'U007', isActive: true },
    { id: 8, displayName: 'Mariem', userName: 'mariem', mail: 'mariem@example.com', password: 'demo123', userCode: 'U008', isActive: true },
    { id: 9, displayName: 'Ahmed', userName: 'ahmed', mail: 'ahmed@example.com', password: 'demo123', userCode: 'U009', isActive: true },
    { id: 10, displayName: 'Ines', userName: 'ines', mail: 'ines@example.com', password: 'demo123', userCode: 'U010', isActive: false },
    { id: 11, displayName: 'Omar', userName: 'omar', mail: 'omar@example.com', password: 'demo123', userCode: 'U011', isActive: true },
    { id: 12, displayName: 'Nour', userName: 'nour', mail: 'nour@example.com', password: 'demo123', userCode: 'U012', isActive: true },
  ]);

  const [utilisateurToDelete, setUtilisateurToDelete] =
    useState<Utilisateur | null>(null);

  const handleEdit = (utilisateur: Utilisateur) => {
    navigate(`/store-admin/users/edit/${utilisateur.id}`);
  };

  const handleDelete = (utilisateur: Utilisateur) => {
    setUtilisateurToDelete(utilisateur);
  };

  const handleCancelDelete = () => {
    setUtilisateurToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!utilisateurToDelete) return;

    setUtilisateurs((current) =>
      current.filter((item) => item.id !== utilisateurToDelete.id),
    );

    setUtilisateurToDelete(null);
  };

  const handleAdd = () => {
    navigate('/store-admin/users/add');
  };

  return (
    <>
      {/* EN-TÊTE DE LA PAGE */}
      <Container>
        <div className="py-5 sm:py-6">
          {/* Fil d'Ariane */}
          

          {/* Titre, description et bouton */}
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

            <Button
              type="button"
              onClick={handleAdd}
              className="h-11 w-full shrink-0 gap-2 rounded-lg bg-[#556B2F] px-5 font-medium text-white shadow-sm transition-colors hover:bg-[#465A27] sm:w-auto"
            >
              <Plus className="size-4" />
              Ajouter un utilisateur
            </Button>
          </div>

          {/* BANDEAU D'INTRODUCTION - DESIGN MINIMALISTE */}
          <section className="mt-6 flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 sm:px-6">
            {/* Icône */}
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F4E9]">
              <Users className="size-6 text-[#556B2F]" />
            </div>

            {/* Séparateur olive */}
            <div className="h-11 w-px shrink-0 bg-[#C9D6B5]" />

            {/* Texte */}
            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-[#172033] sm:text-lg">
                Gérez facilement vos utilisateurs
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Ajoutez, modifiez ou désactivez des utilisateurs et définissez leurs rôles.
              </p>
            </div>
          </section>
        </div>
      </Container>

      {/* TABLEAU DES UTILISATEURS */}
      <Container>
        <UtilisateurTable
          utilisateurs={utilisateurs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>

      {/* MODALE DE SUPPRESSION */}
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
                id="delete-user-title"
                className="text-xl font-bold tracking-tight text-slate-900"
              >
                Supprimer l'utilisateur ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Cette action supprimera l'utilisateur suivant de la liste :
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {utilisateurToDelete.displayName}
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-11 min-w-[120px] rounded-lg border-slate-200"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-11 min-w-[145px] rounded-lg bg-red-500 text-white hover:bg-red-600"
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

export default UtilisateurPage;
