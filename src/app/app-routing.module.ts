import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'country',
    pathMatch: 'prefix',
    loadChildren: () => import('../../projects/country/src/lib/country.module').then(m => m.CountryModule),
  },
  {
    path: 'dashboard',
    pathMatch: 'prefix',
    loadChildren: () => import('../../projects/dashboard/src/lib/dashboard.module').then(m => m.DashboardModule),
  },

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
