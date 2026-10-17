import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  UserRound,
  X,
} from 'lucide-react';

import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';

/* ============================================================
   TYPES
============================================================ */

interface PlanningOuvrier {
  id: number;
  ouvrierId: number;
  ouvrierName: string;
  poste: string;
  description: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  couleur: string;
}

/* ============================================================
   DONNÉES STATIQUES
============================================================ */

const ouvriers = [
  {
    id: 1,
    name: 'Mohamed Ali',
  },
  {
    id: 2,
    name: 'Youssef Saidi',
  },
  {
    id: 3,
    name: 'Khaled Amri',
  },
  {
    id: 4,
    name: 'Ahmed Ben Salah',
  },
  {
    id: 5,
    name: 'Hichem Trabelsi',
  },
];

const initialPlannings: PlanningOuvrier[] = [
  {
    id: 1,
    ouvrierId: 1,
    ouvrierName: 'Mohamed Ali',
    poste: 'Manutention',
    description: 'Réception des olives',
    date: '2026-10-06',
    heureDebut: '09:00',
    heureFin: '12:00',
    lieu: 'Zone de réception',
    couleur: '#556B2F',
  },
  {
    id: 2,
    ouvrierId: 2,
    ouvrierName: 'Youssef Saidi',
    poste: 'Pressage',
    description: 'Travail sur la ligne de production',
    date: '2026-10-07',
    heureDebut: '08:00',
    heureFin: '12:00',
    lieu: 'Salle de pressage',
    couleur: '#3B82F6',
  },
  {
    id: 3,
    ouvrierId: 3,
    ouvrierName: 'Khaled Amri',
    poste: 'Entretien',
    description: 'Nettoyage et entretien des équipements',
    date: '2026-10-07',
    heureDebut: '14:00',
    heureFin: '17:00',
    lieu: 'Atelier',
    couleur: '#F59E0B',
  },
  {
    id: 4,
    ouvrierId: 4,
    ouvrierName: 'Ahmed Ben Salah',
    poste: 'Contrôle qualité',
    description: 'Contrôle de la qualité de production',
    date: '2026-10-09',
    heureDebut: '10:00',
    heureFin: '13:00',
    lieu: 'Laboratoire',
    couleur: '#8B5CF6',
  },
  {
    id: 5,
    ouvrierId: 5,
    ouvrierName: 'Hichem Trabelsi',
    poste: 'Manutention',
    description: 'Déplacement des caisses',
    date: '2026-10-12',
    heureDebut: '08:00',
    heureFin: '12:00',
    lieu: 'Entrepôt',
    couleur: '#10B981',
  },
  {
    id: 6,
    ouvrierId: 1,
    ouvrierName: 'Mohamed Ali',
    poste: 'Manutention',
    description: 'Chargement des caisses',
    date: '2026-10-14',
    heureDebut: '08:00',
    heureFin: '11:00',
    lieu: 'Entrepôt',
    couleur: '#556B2F',
  },
];

/* ============================================================
   UTILITAIRES DATE
============================================================ */

const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const weekDays = [
  'Dim',
  'Lun',
  'Mar',
  'Mer',
  'Jeu',
  'Ven',
  'Sam',
];



function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateFrench(date: string) {
  const value = new Date(`${date}T00:00:00`);

  return value.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

/* ============================================================
   COMPOSANT PRINCIPAL
============================================================ */

export function WorkerPlanningsPage() {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 9, 7),
  );

  const [selectedDate, setSelectedDate] = useState(
    '2026-10-07',
  );

  const [showModal, setShowModal] = useState(false);

  const [plannings, setPlannings] =
    useState<PlanningOuvrier[]>(initialPlannings);
  const [selectedPlanning, setSelectedPlanning] =
    useState<PlanningOuvrier | null>(null);

  const [form, setForm] = useState({
    ouvrierId: '1',
    poste: 'Manutention',
    description: '',
    startDate: '2026-10-07',
    startTime: '08:00',
    endDate: '2026-10-07',
    endTime: '12:00',
    allDay: false,
    lieu: '',
    couleur: '#556B2F',
  });

  /* ============================================================
     CALENDRIER
  ============================================================ */

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();

    const daysInMonth = lastDay.getDate();

    const previousMonthLastDay = new Date(
      year,
      month,
      0,
    ).getDate();

    const days: {
      date: Date;
      currentMonth: boolean;
    }[] = [];

    // Jours du mois précédent
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          year,
          month - 1,
          previousMonthLastDay - i,
        ),
        currentMonth: false,
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    // Jours du mois suivant
    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false,
      });

      nextDay++;
    }

    return days;
  }, [currentDate]);

  /* ============================================================
     NAVIGATION MOIS
  ============================================================ */

  const goPreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      ),
    );
  };

  const goNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      ),
    );
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(formatDate(today));
  };

  /* ============================================================
     OUVERTURE DU MODAL
  ============================================================ */

  const openCreateModal = (date?: string) => {
    const dateToUse =
      date || selectedDate || formatDate(currentDate);

    setSelectedDate(dateToUse);

    setForm({
      ouvrierId: '1',
      poste: 'Manutention',
      description: '',
      startDate: dateToUse,
      startTime: '08:00',
      endDate: dateToUse,
      endTime: '12:00',
      allDay: false,
      lieu: '',
      couleur: '#556B2F',
    });

    setShowModal(true);
  };

  /* ============================================================
     CRÉATION DU PLANNING
  ============================================================ */

  const handleCreatePlanning = () => {
    const worker = ouvriers.find(
      (item) => item.id === Number(form.ouvrierId),
    );

    if (!worker) return;

    const newPlanning: PlanningOuvrier = {
      id: Date.now(),
      ouvrierId: worker.id,
      ouvrierName: worker.name,
      poste: form.poste,
      description:
        form.description || 'Planning de travail',
      date: form.startDate,
      heureDebut: form.allDay
        ? '00:00'
        : form.startTime,
      heureFin: form.allDay
        ? '23:59'
        : form.endTime,
      lieu: form.lieu,
      couleur: form.couleur,
    };

    setPlannings((previous) => [
      ...previous,
      newPlanning,
    ]);

    setSelectedDate(form.startDate);
    setShowModal(false);
  };

  /* ============================================================
     PLANNINGS D'UNE DATE
  ============================================================ */

  const getPlanningsForDate = (date: Date) => {
    const dateString = formatDate(date);

    return plannings.filter(
      (planning) => planning.date === dateString,
    );
  };

  const selectedDayPlannings =
    plannings.filter(
      (planning) => planning.date === selectedDate,
    );

  /* ============================================================
     AUJOURD'HUI
  ============================================================ */

  const todayString = '2026-10-07';

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-full">
      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <Container>
        <Toolbar>
          <ToolbarHeading>
  <ToolbarPageTitle text="Gestion des plannings des ouvriers" />

  <ToolbarDescription>
    Planifiez et suivez les horaires de travail des ouvriers
  </ToolbarDescription>
</ToolbarHeading>
        </Toolbar>
      </Container>

      <Container>
        <div className="flex flex-col gap-5 pb-8">
          {/* ==================================================
              HEADER CALENDRIER
          ================================================== */}

          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToday}
                  className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Aujourd'hui
                </button>

                <button
                  type="button"
                  onClick={goPreviousMonth}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-muted-foreground transition hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={goNextMonth}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-muted-foreground transition hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="ml-2 flex items-center gap-2">
                  <CalendarDays
                    className="h-5 w-5"
                    style={{ color: '#556B2F' }}
                  />

                  <h2 className="text-xl font-semibold capitalize text-foreground">
                    {monthNames[currentDate.getMonth()]}{' '}
                    {currentDate.getFullYear()}
                  </h2>
                </div>
              </div>

              {/* Ajouter */}
              <button
                type="button"
                onClick={() =>
                  openCreateModal(selectedDate)
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{
                  backgroundColor: '#556B2F',
                }}
              >
                <Plus className="h-4 w-4" />

                Ajouter un planning
              </button>
            </div>

            {/* ==================================================
                CALENDRIER
            ================================================== */}

            <div className="overflow-hidden">
              {/* Jours */}
              <div className="grid grid-cols-7 border-b border-border bg-slate-50">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="border-r border-border px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Cases */}
              <div className="grid grid-cols-7">
                {calendarDays.map(
                  ({ date, currentMonth }, index) => {
                    const dateString = formatDate(date);

                    const dayPlannings =
                      getPlanningsForDate(date);

                    const isSelected =
                      selectedDate === dateString;

                    const isToday =
                      todayString === dateString;

                    return (
                      <div
                        key={`${dateString}-${index}`}
                        onClick={() => {
                          setSelectedDate(dateString);
                        }}
                        className={[
                          'group relative min-h-[145px] cursor-pointer border-b border-r border-border p-2 transition',
                          'hover:bg-[#556B2F]/[0.035]',
                          !currentMonth
                            ? 'bg-slate-50/60'
                            : 'bg-white',
                          isSelected
                            ? 'bg-[#556B2F]/[0.04]'
                            : '',
                        ].join(' ')}
                      >
                        {/* Numéro du jour */}
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={[
                              'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                              !currentMonth
                                ? 'text-muted-foreground/50'
                                : 'text-foreground',
                              isToday
                                ? 'font-semibold text-white'
                                : '',
                            ].join(' ')}
                            style={
                              isToday
                                ? {
                                    backgroundColor:
                                      '#556B2F',
                                  }
                                : undefined
                            }
                          >
                            {date.getDate()}
                          </span>

                          {/* + */}
                          {currentMonth && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openCreateModal(dateString);
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-muted group-hover:opacity-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {/* Plannings */}
                        
{/* Plannings */}
<div className="flex flex-col gap-1.5">
  {dayPlannings.slice(0, 3).map((planning) => (
    <button
      key={planning.id}
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        setSelectedPlanning(planning);
      }}
      className="w-full min-w-0 rounded-md border px-1.5 py-1.5 text-left text-xs transition hover:brightness-95 sm:px-2"
      style={{
        backgroundColor: `${planning.couleur}12`,
        borderColor: `${planning.couleur}30`,
      }}
    >
      {/* Téléphone : affichage compact */}
      <div className="sm:hidden">
        <div className="flex items-center gap-1">
          <Clock3
            className="h-3 w-3 shrink-0"
            style={{ color: planning.couleur }}
          />
          <span
            className="truncate font-semibold"
            style={{ color: planning.couleur }}
          >
            {planning.heureDebut}
          </span>
        </div>

        <div className="mt-0.5 truncate font-medium text-foreground">
          {planning.ouvrierName.split(' ')[0]}
        </div>
      </div>

      {/* PC : affichage actuel */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-1 font-semibold">
          <Clock3
            className="h-3 w-3 shrink-0"
            style={{ color: planning.couleur }}
          />
          <span
            className="truncate"
            style={{ color: planning.couleur }}
          >
            {formatTime(planning.heureDebut)}
          </span>
        </div>

        <div className="mt-0.5 truncate font-medium text-foreground">
          {planning.ouvrierName}
        </div>

        <div className="truncate text-muted-foreground">
          {planning.poste}
        </div>
      </div>
    </button>
  ))}

  {dayPlannings.length > 3 && (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        setSelectedDate(dateString);
      }}
      className="px-1 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      + {dayPlannings.length - 3} autres
    </button>
  )}
</div>

                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              DÉTAIL DU JOUR SÉLECTIONNÉ
          ================================================== */}

          

            
        </div>
      </Container>

      {/* ======================================================
          MODAL AJOUTER PLANNING
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="relative flex max-h-[92vh] w-full max-w-[620px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Créer un planning
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Planifier le travail d'un ouvrier
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                {/* Ouvrier */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Ouvrier
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <select
                      value={form.ouvrierId}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          ouvrierId:
                            event.target.value,
                        }))
                      }
                      className="h-11 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-10 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    >
                      {ouvriers.map((ouvrier) => (
                        <option
                          key={ouvrier.id}
                          value={ouvrier.id}
                        >
                          {ouvrier.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Poste */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Poste
                  </label>

                  <div className="relative">
                    <select
                      value={form.poste}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          poste: event.target.value,
                        }))
                      }
                      className="h-11 w-full appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    >
                      <option value="Manutention">
                        Manutention
                      </option>

                      <option value="Pressage">
                        Pressage
                      </option>

                      <option value="Entretien">
                        Entretien
                      </option>

                      <option value="Contrôle qualité">
                        Contrôle qualité
                      </option>

                      <option value="Réception">
                        Réception
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        description:
                          event.target.value,
                      }))
                    }
                    placeholder="Ajouter une description..."
                    rows={3}
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Date début */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Date de début
                    </label>

                    <div className="relative">
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            startDate:
                              event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                      />
                    </div>
                  </div>

                  {/* Heure début */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Heure de début
                    </label>

                    <input
                      type="time"
                      disabled={form.allDay}
                      value={form.startTime}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          startTime:
                            event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] disabled:cursor-not-allowed disabled:bg-muted"
                    />
                  </div>

                  {/* Date fin */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Date de fin
                    </label>

                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          endDate:
                            event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>

                  {/* Heure fin */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Heure de fin
                    </label>

                    <input
                      type="time"
                      disabled={form.allDay}
                      value={form.endTime}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          endTime:
                            event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] disabled:cursor-not-allowed disabled:bg-muted"
                    />
                  </div>
                </div>

                {/* Toute la journée */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.allDay}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        allDay:
                          event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300"
                    style={{
                      accentColor: '#556B2F',
                    }}
                  />

                  <span className="text-sm font-medium text-foreground">
                    Toute la journée
                  </span>
                </label>

                {/* Lieu */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Lieu
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="text"
                      value={form.lieu}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          lieu: event.target.value,
                        }))
                      }
                      placeholder="Ex : Salle de pressage"
                      className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* Étiquette */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">
                    Étiquette
                  </label>

                  <div className="flex items-center gap-3">
                    {[
                      '#556B2F',
                      '#3B82F6',
                      '#8B5CF6',
                      '#EC4899',
                      '#10B981',
                      '#F59E0B',
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            couleur: color,
                          }))
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-transparent transition hover:scale-105"
                        style={
                          form.couleur === color
                            ? {
                                borderColor: color,
                              }
                            : undefined
                        }
                      >
                        <span
                          className="h-5 w-5 rounded-full"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-10 rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleCreatePlanning}
                className="h-10 rounded-md px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{
                  backgroundColor: '#556B2F',
                }}
              >
                Créer le planning
              </button>
            </div>
          </div>
        </div>
        
      )}
      
{/* CARTE DÉTAIL DU PLANNING — MOBILE */}
{selectedPlanning && (
  <div
    className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 p-3 sm:hidden"
    onClick={() => setSelectedPlanning(null)}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Détails du planning"
      onClick={(event) => event.stopPropagation()}
      className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${selectedPlanning.couleur}18`,
            }}
          >
            <CalendarDays
              className="h-5 w-5"
              style={{ color: selectedPlanning.couleur }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">
              {selectedPlanning.ouvrierName}
            </h3>
            <p
              className="mt-1 text-sm font-medium"
              style={{ color: selectedPlanning.couleur }}
            >
              {selectedPlanning.poste}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedPlanning(null)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium text-foreground">
              {formatDateFrench(selectedPlanning.date)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Horaires</p>
            <p className="font-medium text-foreground">
              {formatTime(selectedPlanning.heureDebut)} –{" "}
              {formatTime(selectedPlanning.heureFin)}
            </p>
          </div>
        </div>

        {selectedPlanning.lieu && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Lieu</p>
              <p className="font-medium text-foreground">
                {selectedPlanning.lieu}
              </p>
            </div>
          </div>
        )}

        {selectedPlanning.description && (
          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              Description
            </p>
            <p className="leading-relaxed text-foreground">
              {selectedPlanning.description}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setSelectedPlanning(null)}
        className="mt-5 h-10 w-full rounded-lg font-semibold text-white"
        style={{ backgroundColor: "#556B2F" }}
      >
        Fermer
      </button>
    </div>
  </div>
)}

    </div>
  );
}