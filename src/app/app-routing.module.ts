import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Dashboard MFE 
  {
    path: 'dashboard',
    pathMatch: 'prefix',
    loadChildren: () => import('../../projects/dashboard/src/lib/dashboard.module').then(m => m.DashboardModule),
  },
  /**
   * Country MFE
   * @param {string} country Name of country to view
   * @param {string} period  Time period to view
   */
  {
    path: 'country',
    pathMatch: 'prefix',
    loadChildren: () => import('../../projects/country/src/lib/country.module').then(m => m.CountryModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
