import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent
  }
];

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
