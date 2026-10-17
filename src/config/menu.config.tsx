import {
  BriefcaseBusiness,
  CalendarDays,
  Container,
  FileText,
  HardHat,
  Home,
  Settings,
  UserRound,
  Users,
} from 'lucide-react';

import { type MenuConfig } from './types';

/**
 * ============================================================
 * SIDEBAR OLIVIER
 * ============================================================
 */

export const MENU_SIDEBAR: MenuConfig = [
  {
    title: 'Tableau de bord',
    icon: Home,
    path: '/store-admin/dashboard',
  },

  {
    title: 'Paramétrage',
    icon: Settings,
    children: [
      {
        title: 'Saison',
        icon: UserRound,
        path: '/store-admin/saison',
      },
      {
        title: 'Citernes',
        icon: Container,
        path: '/store-admin/tanks',
      },
      {
        title: 'Utilisateurs',
        icon: Users,
        path: '/store-admin/users',
      },
      {
        title: 'Comptes',
        icon: BriefcaseBusiness,
        path: '/store-admin/accounts',
      },
      {
        title: 'Gestion des ouvriers',
        icon: HardHat,
        path: '/store-admin/workers',
      },
      {
      title: 'Plannings des ouvriers',
      icon: CalendarDays,
      path: '/store-admin/worker-plannings',
    },
    ],
  },

  {
    title: 'Bon de réception',
    icon: FileText,
    path: '/store-admin/reception-vouchers',
  },
];

/**
 * ============================================================
 * SIDEBAR CUSTOM
 * ============================================================
 */

export const MENU_SIDEBAR_CUSTOM: MenuConfig = [
  {
    title: 'Tableau de bord',
    icon: Home,
    path: '/store-admin/dashboard',
  },

  {
    title: 'Paramétrage',
    icon: Settings,
    children: [
      {
        title: 'Saison',
        icon: UserRound,
        path: '/store-admin/saison',
      },
      {
        title: 'Citernes',
        icon: Container,
        path: '/store-admin/tanks',
      },
      {
        title: 'Utilisateurs',
        icon: Users,
        path: '/store-admin/users',
      },
      {
        title: 'Comptes',
        icon: BriefcaseBusiness,
        path: '/store-admin/accounts',
      },
    ],
  },

  {
    title: 'Bon de réception',
    icon: FileText,
    path: '/store-admin/reception-vouchers',
  },
];

/**
 * ============================================================
 * SIDEBAR COMPACT
 * ============================================================
 */

export const MENU_SIDEBAR_COMPACT: MenuConfig = [
  {
    title: 'Tableau de bord',
    icon: Home,
    path: '/store-admin/dashboard',
  },

  {
    title: 'Paramétrage',
    icon: Settings,
    children: [
      {
        title: 'Saison',
        icon: UserRound,
        path: '/store-admin/saison',
      },
      {
  title: 'Citernes',
  icon: Container,
  path: '/store-admin/tanks',
},
      {
  title: 'Utilisateurs',
  icon: Users,
  path: '/store-admin/users',
},
      {
  title: 'Comptes',
  icon: BriefcaseBusiness,
  path: '/store-admin/accounts',
},
    ],
  },

  {
  title: 'Bon de réception',
  icon: FileText,
  path: '/store-admin/reception-vouchers',
},
];

/**
 * ============================================================
 * MEGA MENU
 * ============================================================
 */

export const MENU_MEGA: MenuConfig = [];

/**
 * ============================================================
 * MEGA MENU MOBILE
 * ============================================================
 */

export const MENU_MEGA_MOBILE: MenuConfig = [];

/**
 * ============================================================
 * HELP MENU
 * ============================================================
 */

export const MENU_HELP: MenuConfig = [];

/**
 * ============================================================
 * ROOT MENU
 * ============================================================
 */

export const MENU_ROOT: MenuConfig = [
  {
    title: 'Tableau de bord',
    icon: Home,
    rootPath: '/store-admin/',
    path: '/store-admin/dashboard',
    childrenIndex: 0,
  },

  {
    title: 'Paramétrage',
    icon: Settings,
    rootPath: '/store-admin/',
    path: '/store-admin/saison',
    childrenIndex: 1,
  },

  {
    title: 'Bon de réception',
    icon: FileText,
    rootPath: '/store-admin/',
    path: '/store-admin/reception-vouchers',
    childrenIndex: 2,
  },
];