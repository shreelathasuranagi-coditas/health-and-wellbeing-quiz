import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [

 {
   path: '',
    loadComponent: () => import('./pages/general-info/general-info').then((m) => m.GeneralInfo),
 },

  {
    path: 'family-info',
    loadComponent: () => import('./pages/family-info/family-info').then((m) => m.FamilyInfo),
  },
  
  {
    path: 'general-info',
    loadComponent: () => import('./pages/general-info/general-info').then((m) => m.GeneralInfo),
  },
  {
    path: 'personal-info',
    loadComponent: () => import('./pages/personal-info/personal-info').then((m) => m.PersonalInfo),
  },
  {
    path: 'summary',
    loadComponent: () => import('./pages/summary/summary').then((m) => m.Summary),
  },
];
