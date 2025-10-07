import { Routes } from '@angular/router';

export const CMSRoutes: Routes = [    
     {
            path: 'login',
            loadComponent: () => import('./authentication/login/login').then(m => m.Login)
     },
     { path: '', redirectTo: 'login', pathMatch: 'full' },
 
     {
            path: 'dashboard',
            loadComponent: () => import('./main/dashboard/dashboard').then(m => m.Dashboard)
     },
];