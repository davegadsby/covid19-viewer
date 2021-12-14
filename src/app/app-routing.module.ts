import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'country/:country',
    pathMatch: 'prefix',
    children: [
      {
        path: 'cases',
        outlet: 'data-viewer',
        loadChildren: () => import('../../projects/data-viewer/src/lib/data-viewer.module').then(m => m.DataViewerModule),
      },
      {
        path: 'nav',
        outlet: 'nav',
        loadChildren: () => import('../../projects/nav/src/lib/nav.module').then(m => m.NavModule),
      },
    ]
  },
  {path: '', pathMatch: 'full', redirectTo: '/country/United Kingdom/(data-viewer:cases//nav:nav)'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
