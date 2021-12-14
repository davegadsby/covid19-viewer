import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: '', redirectTo: 'United Kingdom', pathMatch: 'full'  },
  { path: ':country', loadChildren: () => import('../../../data-viewer/src/lib/data-viewer.module').then(m => m.DataViewerModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
