import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataViewerComponent } from './data-viewer.component';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AllCountriesComponent } from './all-countries/all-countries.component';
import { SearchComponent } from './search/search.component';
import { ShellModule } from 'projects/shell/src/lib/shell.module';
import { ShellComponent } from 'projects/shell/src/public-api';
Chart.register(...registerables);

const uri = 'https://covid19-graphql.now.sh/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

const routes: Routes = [

// need to define a template 'shell' in another common module,
// This shell will have all the layout/router outlets currently in the app.component
// This means we can provide child routes for outlets at this level because they are in the template, not in the parent app.component

{
  path: '',
  component: ShellComponent,
  children: [
    {
      path: ':country', component: DataViewerComponent,
    },
    {
      path: '',
      outlet: 'nav',
      component: AllCountriesComponent,
    },
    {
      path: 'search',
      outlet: 'nav',
      component: SearchComponent
    },
   
  ],
  
},
];

@NgModule({
  declarations: [
    DataViewerComponent, AllCountriesComponent, SearchComponent
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  imports: [
    RouterModule.forChild(routes),
    ShellModule,
    HttpLinkModule, ApolloModule, HttpClientModule, MatCardModule, ReactiveFormsModule,
    MatListModule, CommonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule,

  ],
  exports: [
    DataViewerComponent, ApolloModule
  ]
})
export class DataViewerModule { }
