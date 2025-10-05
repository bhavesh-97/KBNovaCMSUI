import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./CMS/CMS.routes').then(m => m.CMSRoutes)
    }
];
