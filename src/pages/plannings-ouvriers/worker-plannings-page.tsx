import { useMemo, useState } from 'react';
import {
  CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3,
  Filter, MapPin, Plus, RotateCcw, UserRound, X, BriefcaseBusiness, Search,
} from 'lucide-react';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';

interface Ouvrier {
  id: number; name: string; specialite: string; statut: string;
}
interface PlanningOuvrier {
  id: number; ouvrierId: number; ouvrierName: string; poste: string;
  description: string; date: string; heureDebut: string; heureFin: string;
  lieu: string; couleur: string;
}
interface PlanningForm {
  ouvrierId: string; poste: string; description: string; startDate: string;
  startTime: string; endDate: string; endTime: string; allDay: boolean;
  lieu: string; couleur: string;
}

const ouvriers: Ouvrier[] = [
  { id: 1, name: 'Mohamed Ali', specialite: 'Manutention', statut: 'Actif' },
  { id: 2, name: 'Youssef Saidi', specialite: 'Pressage', statut: 'Actif' },
  { id: 3, name: 'Khaled Amri', specialite: 'Entretien', statut: 'En congé' },
  { id: 4, name: 'Ahmed Ben Salah', specialite: 'Contrôle qualité', statut: 'Actif' },
  { id: 5, name: 'Hichem Trabelsi', specialite: 'Manutention', statut: 'Inactif' },
];
const initialPlannings: PlanningOuvrier[] = [
  { id: 1, ouvrierId: 1, ouvrierName: 'Mohamed Ali', poste: 'Manutention', description: 'Réception des olives', date: '2026-10-06', heureDebut: '09:00', heureFin: '12:00', lieu: 'Zone de réception', couleur: '#556B2F' },
  { id: 2, ouvrierId: 2, ouvrierName: 'Youssef Saidi', poste: 'Pressage', description: 'Travail sur la ligne de production', date: '2026-10-07', heureDebut: '08:00', heureFin: '12:00', lieu: 'Salle de pressage', couleur: '#3B82F6' },
  { id: 3, ouvrierId: 3, ouvrierName: 'Khaled Amri', poste: 'Entretien', description: 'Nettoyage des équipements', date: '2026-10-07', heureDebut: '14:00', heureFin: '17:00', lieu: 'Atelier', couleur: '#F59E0B' },
  { id: 4, ouvrierId: 4, ouvrierName: 'Ahmed Ben Salah', poste: 'Contrôle qualité', description: 'Contrôle de la qualité', date: '2026-10-09', heureDebut: '10:00', heureFin: '13:00', lieu: 'Laboratoire', couleur: '#8B5CF6' },
  { id: 5, ouvrierId: 5, ouvrierName: 'Hichem Trabelsi', poste: 'Manutention', description: 'Déplacement des caisses', date: '2026-10-12', heureDebut: '08:00', heureFin: '12:00', lieu: 'Entrepôt', couleur: '#10B981' },
  { id: 6, ouvrierId: 1, ouvrierName: 'Mohamed Ali', poste: 'Manutention', description: 'Chargement des caisses', date: '2026-10-14', heureDebut: '08:00', heureFin: '11:00', lieu: 'Entrepôt', couleur: '#556B2F' },
];
const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const weekdays = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const specialties = ['Manutention','Pressage','Entretien','Contrôle qualité','Réception'];
const colors = ['#556B2F','#3B82F6','#8B5CF6','#EC4899','#10B981','#F59E0B'];
const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const monthKey = (d: Date) => dateKey(new Date(d.getFullYear(), d.getMonth(), 1)).slice(0,7);
const dateLabel = (s: string) => s ? new Date(`${s}T00:00:00`).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : '';
const timeLabel = (s: string) => { const [h,m] = s.split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`; };

export function WorkerPlanningsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 7));
  const [selectedDate, setSelectedDate] = useState('2026-10-07');
  const [plannings, setPlannings] = useState(initialPlannings);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedPlanning, setSelectedPlanning] = useState<PlanningOuvrier | null>(null);
  const [draft, setDraft] = useState({ month: '2026-10', ouvrierId: '', specialite: '', statut: '' });
  const [filters, setFilters] = useState({ month: '2026-10', ouvrierId: '', specialite: '', statut: '' });
  const [form, setForm] = useState<PlanningForm>({
    ouvrierId: '1', poste: 'Manutention', description: '', startDate: '2026-10-07',
    startTime: '08:00', endDate: '2026-10-07', endTime: '12:00', allDay: false,
    lieu: '', couleur: '#556B2F',
  });

  const filtered = useMemo(() => plannings.filter(p => {
    const worker = ouvriers.find(w => w.id === p.ouvrierId);
    return (!filters.month || p.date.startsWith(filters.month))
      && (!filters.ouvrierId || p.ouvrierId === Number(filters.ouvrierId))
      && (!filters.specialite || p.poste === filters.specialite)
      && (!filters.statut || worker?.statut === filters.statut);
  }), [plannings, filters]);

  const days = useMemo(() => {
    const y = currentDate.getFullYear(), m = currentDate.getMonth();
    const first = new Date(y,m,1), total = new Date(y,m+1,0).getDate();
    const prevTotal = new Date(y,m,0).getDate();
    const result: { date: Date; currentMonth: boolean }[] = [];
    for (let i = first.getDay()-1; i >= 0; i--) result.push({date:new Date(y,m-1,prevTotal-i),currentMonth:false});
    for (let d=1; d<=total; d++) result.push({date:new Date(y,m,d),currentMonth:true});
    let next=1;
    while(result.length<42) result.push({date:new Date(y,m+1,next++),currentMonth:false});
    return result;
  }, [currentDate]);

  const applyFilters = () => {
    const [y,m] = draft.month.split('-').map(Number);
    if (y && m) {
      const d = new Date(y,m-1,1);
      setCurrentDate(d);
      setSelectedDate(dateKey(d));
    }
    setFilters({...draft});
  };
  const resetFilters = () => {
    const clean = {month:monthKey(currentDate),ouvrierId:'',specialite:'',statut:''};
    setDraft(clean); setFilters(clean);
  };
  const changeMonth = (offset: number) => {
    const d = new Date(currentDate.getFullYear(),currentDate.getMonth()+offset,1);
    setCurrentDate(d);
    setDraft(p=>({...p,month:monthKey(d)}));
    setFilters(p=>({...p,month:monthKey(d)}));
  };
  const goToday = () => {
    const d = today(), m = monthKey(d);
    setCurrentDate(d); setSelectedDate(dateKey(d));
    setDraft(p=>({...p,month:m})); setFilters(p=>({...p,month:m}));
  };
  const openCreate = (date?: string) => {
    setEditingId(null);
    const chosen = date || selectedDate || dateKey(currentDate);
    setSelectedDate(chosen);
    setForm({
      ouvrierId:draft.ouvrierId || '1', poste:draft.specialite || 'Manutention',
      description:'', startDate:chosen, startTime:'08:00', endDate:chosen,
      endTime:'12:00', allDay:false, lieu:'', couleur:'#556B2F',
    });
    setShowModal(true);
  };
  const openEdit = (planning: PlanningOuvrier) => {
    setSelectedPlanning(null);
    setEditingId(planning.id);
    setForm({
      ouvrierId: String(planning.ouvrierId), poste: planning.poste,
      description: planning.description, startDate: planning.date,
      startTime: planning.heureDebut, endDate: planning.date,
      endTime: planning.heureFin, allDay: planning.heureDebut === '00:00' && planning.heureFin === '23:59',
      lieu: planning.lieu, couleur: planning.couleur,
    });
    setShowModal(true);
  };
  const updateForm = <K extends keyof PlanningForm>(key: K, value: PlanningForm[K]) =>
    setForm(p=>({...p,[key]:value}));
  const createPlanning = () => {
    const worker = ouvriers.find(w=>w.id===Number(form.ouvrierId));
    if (!worker || !form.startDate || !form.endDate || form.endDate<form.startDate) return;
    if (!form.allDay && form.startDate===form.endDate && form.endTime<=form.startTime) return;
    const p: PlanningOuvrier = {
      id: editingId ?? Date.now(), ouvrierId:worker.id, ouvrierName:worker.name, poste:form.poste,
      description:form.description.trim() || 'Planning de travail', date:form.startDate,
      heureDebut:form.allDay?'00:00':form.startTime, heureFin:form.allDay?'23:59':form.endTime,
      lieu:form.lieu.trim(), couleur:form.couleur,
    };
    const m = p.date.slice(0,7);
    setPlannings(old=>editingId === null ? [...old,p] : old.map(item=>item.id===editingId?p:item));
    setSelectedDate(p.date);
    setCurrentDate(new Date(Number(m.slice(0,4)),Number(m.slice(5,7))-1,1));
    setDraft(old=>({...old,month:m})); setFilters(old=>({...old,month:m}));
    setShowModal(false);
    setEditingId(null);
  };
  const selectedDayPlannings = filtered.filter(p=>p.date===selectedDate);
  const todayString = dateKey(today());

  return <div className="min-h-full  pb-8">
    <Container>
      <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#DCE8CF] bg-[#F0F5E9] shadow-sm sm:size-16"><CalendarDays className="size-7 text-[#556B2F] sm:size-8" /></div>
          <div><h1 className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl">Gestion des plannings des ouvriers</h1><p className="mt-1 text-sm text-slate-500 sm:text-base">Planifiez et suivez les horaires de travail des ouvriers.</p></div>
        </div>
        <button type="button" onClick={()=>openCreate()} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465A27] sm:self-center"><Plus className="size-4"/>Ajouter un planning</button>
      </div>
    </Container>

    <Container>
      <div className="flex flex-col gap-5">
        {/* FILTRES */}
        <section className="rounded-2xl border border-[#E6EDE0] bg-white p-4 shadow-sm sm:p-5">
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.05fr_1.2fr_1.2fr_1fr_auto] xl:items-end">
            <div className="space-y-1.5"><label htmlFor="filter-month" className="text-xs font-semibold text-slate-600">Mois</label><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#556B2F]"/><input id="filter-month" type="month" value={draft.month} onChange={e=>setDraft(p=>({...p,month:e.target.value}))} className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#91A875] focus:ring-2 focus:ring-[#556B2F]/10"/></div></div>
            <div className="space-y-1.5"><label htmlFor="filter-worker" className="text-xs font-semibold text-slate-600">Ouvrier</label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"/><select id="filter-worker" value={draft.ouvrierId} onChange={e=>setDraft(p=>({...p,ouvrierId:e.target.value}))} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#91A875]"><option value="">Tous les ouvriers</option>{ouvriers.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/></div></div>
            <div className="space-y-1.5"><label htmlFor="filter-specialty" className="text-xs font-semibold text-slate-600">Spécialité</label><div className="relative"><BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"/><select id="filter-specialty" value={draft.specialite} onChange={e=>setDraft(p=>({...p,specialite:e.target.value}))} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#91A875]"><option value="">Toutes les spécialités</option>{specialties.map(s=><option key={s} value={s}>{s}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/></div></div>
            <div className="space-y-1.5"><label htmlFor="filter-status" className="text-xs font-semibold text-slate-600">Statut de l'ouvrier</label><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#789548]"/><select id="filter-status" value={draft.statut} onChange={e=>setDraft(p=>({...p,statut:e.target.value}))} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none focus:border-[#91A875]"><option value="">Tous les statuts</option><option>Actif</option><option>En congé</option><option>Inactif</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/></div></div>
            <div className="flex flex-col gap-2 sm:flex-row xl:border-l xl:border-slate-200 xl:pl-3">
  {/* Bouton Réinitialiser — orange */}
  <button
    type="button"
    onClick={resetFilters}
    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#F3D2B3] bg-[#FFF7ED] px-4 text-sm font-medium text-[#C2672B] transition-colors hover:border-[#E9B98F] hover:bg-[#FFEDD8] hover:text-[#A94F1D]"
  >
    <RotateCcw className="size-4" />
    Réinitialiser
  </button>

  {/* Bouton Filtrer — vert clair */}
  <button
    type="button"
    onClick={applyFilters}
    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-semibold text-[#556B2F] transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
  >
    <Search className="size-4" />
    Filtrer
  </button>
</div>
          </div>
          
        </section>

        {/* CALENDRIER */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={goToday} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Aujourd'hui</button>
              <button type="button" onClick={()=>changeMonth(-1)} aria-label="Mois précédent" className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><ChevronLeft className="size-4"/></button>
              <button type="button" onClick={()=>changeMonth(1)} aria-label="Mois suivant" className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><ChevronRight className="size-4"/></button>
              <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-4"><CalendarDays className="size-5 text-[#556B2F]"/><h2 className="text-lg font-bold capitalize text-slate-800 sm:text-xl">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2></div>
            </div>
            <span className="self-start rounded-lg bg-[#F3F6EF] px-3 py-2 text-xs font-medium text-[#556B2F] sm:self-center">Vue mensuelle</span>
          </div>
          <div className="overflow-x-auto"><div className="min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">{weekdays.map(d=><div key={d} className="border-r border-slate-200 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 last:border-r-0">{d}</div>)}</div>
            <div className="grid grid-cols-7">{days.map(({date,currentMonth},index)=>{
              const key=dateKey(date), dayItems=filtered.filter(p=>p.date===key), selected=selectedDate===key, isToday=key===todayString;
              return <div key={`${key}-${index}`} onClick={()=>setSelectedDate(key)} className={`group min-h-[145px] cursor-pointer border-b border-r border-slate-200 p-2 transition ${!currentMonth?'bg-slate-50/60':'bg-white hover:bg-[#F8FAF5]'} ${selected?'bg-[#F5F8F0]':''}`}>
                <div className="mb-2 flex items-center justify-between"><span className={`flex size-7 items-center justify-center rounded-full text-sm ${!currentMonth?'text-slate-300':'text-slate-700'} ${isToday?'bg-[#556B2F] font-semibold text-white':''} ${selected&&!isToday?'ring-1 ring-[#A8BB8D]':''}`}>{date.getDate()}</span>{currentMonth&&<button type="button" aria-label={`Ajouter un planning le ${key}`} onClick={e=>{e.stopPropagation();openCreate(key);}} className="flex size-6 items-center justify-center rounded-md text-slate-400 opacity-0 hover:bg-[#EAF2E0] hover:text-[#556B2F] group-hover:opacity-100 focus:opacity-100"><Plus className="size-4"/></button>}</div>
                <div className="flex flex-col gap-1.5">{dayItems.slice(0,3).map(p=><button key={p.id} type="button" onClick={e=>{e.stopPropagation();setSelectedPlanning(p);}} className="w-full min-w-0 rounded-lg border px-2 py-1.5 text-left text-xs hover:brightness-[0.98]" style={{backgroundColor:`${p.couleur}12`,borderColor:`${p.couleur}38`}}><div className="flex items-center gap-1 font-semibold" style={{color:p.couleur}}><Clock3 className="size-3 shrink-0"/><span className="truncate">{timeLabel(p.heureDebut)}</span></div><div className="mt-0.5 truncate font-semibold text-slate-800">{p.ouvrierName}</div><div className="truncate text-slate-500">{p.poste}</div></button>)}{dayItems.length>3&&<span className="px-1 text-xs font-semibold text-[#556B2F]">+ {dayItems.length-3} autres</span>}</div>
              </div>;
            })}</div>
          </div></div>
        </section>

        
      </div>
    </Container>

    {/* MODALE DE CRÉATION / MODIFICATION */}
    {showModal&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-3 sm:p-4" onClick={()=>{setShowModal(false);setEditingId(null);}}>
      <div role="dialog" aria-modal="true" aria-labelledby="create-planning-title" className="relative flex max-h-[94vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 id="create-planning-title" className="text-lg font-bold text-slate-800">{editingId !== null ? 'Modifier le planning' : 'Créer un planning'}</h2><p className="mt-1 text-sm text-slate-500">{editingId !== null ? 'Modifiez les informations de cet événement.' : 'Planifier le travail d’un ouvrier.'}</p></div><button type="button" aria-label="Fermer" onClick={()=>{setShowModal(false);setEditingId(null);}} className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="size-5"/></button></div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6"><div className="space-y-5">
          <div><label htmlFor="planning-worker" className="mb-1.5 block text-sm font-semibold text-slate-700">Ouvrier</label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><select id="planning-worker" value={form.ouvrierId} onChange={e=>{const w=ouvriers.find(x=>x.id===Number(e.target.value));setForm(p=>({...p,ouvrierId:e.target.value,poste:w?.specialite??p.poste}));}} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#91A875]">{ouvriers.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/></div></div>
          <div><label htmlFor="planning-post" className="mb-1.5 block text-sm font-semibold text-slate-700">Poste / spécialité</label><div className="relative"><BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><select id="planning-post" value={form.poste} onChange={e=>updateForm('poste',e.target.value)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#91A875]">{specialties.map(s=><option key={s}>{s}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/></div></div>
          <div><label htmlFor="planning-description" className="mb-1.5 block text-sm font-semibold text-slate-700">Description</label><textarea id="planning-description" value={form.description} onChange={e=>updateForm('description',e.target.value)} placeholder="Ajouter une description..." rows={3} className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#91A875]"/></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label htmlFor="planning-start-date" className="mb-1.5 block text-sm font-semibold text-slate-700">Date de début</label><input id="planning-start-date" type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value,endDate:p.endDate<e.target.value?e.target.value:p.endDate}))} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875]"/></div><div><label htmlFor="planning-start-time" className="mb-1.5 block text-sm font-semibold text-slate-700">Heure de début</label><input id="planning-start-time" type="time" disabled={form.allDay} value={form.startTime} onChange={e=>updateForm('startTime',e.target.value)} required={!form.allDay} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875] disabled:bg-slate-100"/></div><div><label htmlFor="planning-end-date" className="mb-1.5 block text-sm font-semibold text-slate-700">Date de fin</label><input id="planning-end-date" type="date" min={form.startDate} value={form.endDate} onChange={e=>updateForm('endDate',e.target.value)} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875]"/></div><div><label htmlFor="planning-end-time" className="mb-1.5 block text-sm font-semibold text-slate-700">Heure de fin</label><input id="planning-end-time" type="time" disabled={form.allDay} value={form.endTime} onChange={e=>updateForm('endTime',e.target.value)} required={!form.allDay} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875] disabled:bg-slate-100"/></div></div>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 px-3 py-3"><input type="checkbox" checked={form.allDay} onChange={e=>updateForm('allDay',e.target.checked)} className="size-4 accent-[#556B2F]"/><span className="text-sm font-medium text-slate-700">Toute la journée</span></label>
          <div><label htmlFor="planning-location" className="mb-1.5 block text-sm font-semibold text-slate-700">Lieu</label><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input id="planning-location" value={form.lieu} onChange={e=>updateForm('lieu',e.target.value)} placeholder="Ex. : Salle de pressage" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-[#91A875]"/></div></div>
          <div><p className="mb-2.5 text-sm font-semibold text-slate-700">Couleur du planning</p><div className="flex flex-wrap items-center gap-3">{colors.map(c=><button key={c} type="button" aria-label={`Choisir la couleur ${c}`} onClick={()=>updateForm('couleur',c)} className="flex size-9 items-center justify-center rounded-full border-2" style={{borderColor:form.couleur===c?c:'transparent'}}><span className="size-5 rounded-full" style={{backgroundColor:c}}/></button>)}</div></div>
        </div></div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"><button type="button" onClick={()=>{setShowModal(false);setEditingId(null);}} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button><button type="button" onClick={createPlanning} disabled={!form.ouvrierId||!form.startDate||!form.endDate||form.endDate<form.startDate||(!form.allDay&&form.startDate===form.endDate&&form.endTime<=form.startTime)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white hover:bg-[#465A27] disabled:cursor-not-allowed disabled:opacity-50">{editingId !== null ? <><BriefcaseBusiness className="size-4"/>Enregistrer les modifications</> : <><Plus className="size-4"/>Créer le planning</>}</button></div>
      </div>
    </div>}

    {/* DÉTAIL DU PLANNING */}
    {selectedPlanning&&<div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center sm:p-4" onClick={()=>setSelectedPlanning(null)}><div role="dialog" aria-modal="true" aria-labelledby="planning-detail-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6" onClick={e=>e.stopPropagation()}>
      <div className="mb-5 flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl" style={{backgroundColor:`${selectedPlanning.couleur}18`}}><CalendarDays className="size-5" style={{color:selectedPlanning.couleur}}/></div><div><h2 id="planning-detail-title" className="font-bold text-slate-800">{selectedPlanning.ouvrierName}</h2><p className="mt-1 text-sm font-semibold" style={{color:selectedPlanning.couleur}}>{selectedPlanning.poste}</p></div></div><button type="button" aria-label="Fermer les détails" onClick={()=>setSelectedPlanning(null)} className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="size-4"/></button></div>
      <div className="space-y-4 border-t border-slate-100 pt-4 text-sm"><div className="flex items-start gap-3"><CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400"/><div><p className="text-xs text-slate-500">Date</p><p className="mt-0.5 font-medium text-slate-800">{dateLabel(selectedPlanning.date)}</p></div></div><div className="flex items-start gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-slate-400"/><div><p className="text-xs text-slate-500">Horaires</p><p className="mt-0.5 font-medium text-slate-800">{timeLabel(selectedPlanning.heureDebut)} – {timeLabel(selectedPlanning.heureFin)}</p></div></div>{selectedPlanning.lieu&&<div className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-slate-400"/><div><p className="text-xs text-slate-500">Lieu</p><p className="mt-0.5 font-medium text-slate-800">{selectedPlanning.lieu}</p></div></div>}<div><p className="text-xs text-slate-500">Description</p><p className="mt-1 leading-relaxed text-slate-700">{selectedPlanning.description||'Aucune description.'}</p></div></div>
      <div className="mt-5 flex gap-2"><button type="button" onClick={()=>openEdit(selectedPlanning)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#556B2F] text-sm font-semibold text-white hover:bg-[#465A27]"><BriefcaseBusiness className="size-4"/>Modifier</button><button type="button" onClick={()=>setSelectedPlanning(null)} className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Fermer</button></div>
    </div></div>}
  </div>;
}
