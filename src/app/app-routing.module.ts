import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'detail',
    pathMatch: 'prefix',
    children: [
      {
        path: ':country',
        pathMatch: 'prefix',
        loadChildren: () => import('../../projects/data-viewer/src/lib/data-viewer.module').then(m => m.DataViewerModule),
      },
      {
        path: '',
        pathMatch: 'prefix',
        outlet: 'nav',
        loadChildren: () => import('../../projects/nav/src/lib/nav.module').then(m => m.NavModule),
      },

    ]
  },
  { path: '', pathMatch: 'full', redirectTo: '/detail' },
  // { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
