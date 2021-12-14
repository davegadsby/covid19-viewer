import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'cases',
    outlet: 'data-viewer',
    loadChildren: () => import('../../projects/data-viewer/src/lib/data-viewer.module').then(m => m.DataViewerModule),
  },
  {
    path: 'nav',
    outlet: 'nav',
    loadChildren: () => import('../../projects/nav/src/lib/nav.module').then(m => m.NavModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
