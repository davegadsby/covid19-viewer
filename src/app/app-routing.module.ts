import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'detail',
    pathMatch: 'prefix',
    loadChildren: () => import('../../projects/data-viewer/src/lib/data-viewer.module').then(m => m.DataViewerModule),
  },
  {
    path: 'dashboard',
    pathMatch: 'prefix',
    loadChildren: () => import('../../projects/dashboard/src/lib/dashboard.module').then(m => m.DashboardModule),
  },

  { path: '', pathMatch: 'full', redirectTo: '/detail/(content:France//nav:all)' },
  // { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
