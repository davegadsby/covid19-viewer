import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';

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
  // {
  //   path: '',
  //   outlet: 'loader',
  //   component: LoadingComponent
  // },

  { path: '', pathMatch: 'full', redirectTo: '/detail/country/France' },
  // { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
