import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Jan Felip',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'projectes',
    title: 'Projectes · Jan Felip',
    loadComponent: () => import('./pages/projects-page').then((m) => m.ProjectsPage),
  },
  {
    path: 'curriculum',
    title: 'Currículum · Jan Felip',
    loadComponent: () => import('./pages/curriculum-page').then((m) => m.CurriculumPage),
  },
  {
    path: 'sobre-mi',
    title: 'Sobre mi · Jan Felip',
    loadComponent: () => import('./pages/about-page').then((m) => m.AboutPage),
  },
  { path: '**', redirectTo: '' },
];
