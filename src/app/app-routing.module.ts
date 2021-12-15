import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    children: [
      {
        path: 'cases',
        outlet: 'content',
        loadChildren: () => import('../../projects/data-viewer/src/lib/data-viewer.module').then(m => m.DataViewerModule),
      },
      {
        path: 'nav',
        outlet: 'nav',
        loadChildren: () => import('../../projects/nav/src/lib/nav.module').then(m => m.NavModule),
      },
    ]
  },
  {path: '', pathMatch: 'full', redirectTo: '/(content:cases//nav:nav)'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
