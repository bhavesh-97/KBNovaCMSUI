import { Routes } from '@angular/router';

export const routes: Routes = [
    
    {
        path: 'Web',
        loadChildren: () => import('./Web/Web.routes').then(m => m.WebRoutes),
    },
    { 
        path: '', 
        loadChildren: () => import('./Web/Web.routes').then(m => m.WebRoutes),
        pathMatch: 'full' 
    },
    {
        path: 'CMS',
        loadChildren: () => import('./CMS/CMS.routes').then(m => m.CMSRoutes)
    }
];
