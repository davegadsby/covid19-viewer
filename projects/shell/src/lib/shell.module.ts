import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';



@NgModule({
  declarations: [
    ShellComponent
  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    RouterModule
  ],
  exports: [
    ShellComponent,
  ]
})
export class ShellModule { }
