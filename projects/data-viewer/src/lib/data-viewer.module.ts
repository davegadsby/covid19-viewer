import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataViewerComponent } from './data-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DataViewerComponent
  }
];

@NgModule({
  declarations: [
    DataViewerComponent
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    DataViewerComponent
  ]
})
export class DataViewerModule { }
