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
import { ToolsComponent } from './tools/tools.component';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
Chart.register(...registerables);

const uri = 'https://covid19-graphql.now.sh/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

const routes: Routes = [
  {
    path: 'country/:country',
    resolve: { countries: CountryResolver },
    children: [
      {
        path: '',
        component: DataViewerComponent
      },
      {
        path: '',
        outlet: 'secondary-tools',
        component: ToolsComponent
      },
      {
        path: '',
        outlet: 'nav',
        component: AllCountriesComponent,
      },
      {
        path: 'all',
        outlet: 'nav',
        component: AllCountriesComponent,
      },
      {
        path: 'search',
        outlet: 'nav',
        component: SearchComponent
      }
    ]
  },
 
];

@NgModule({
  declarations: [
    DataViewerComponent, AllCountriesComponent, SearchComponent
  ],
  providers: [
    CountryService,
    CountryResolver,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    }
  ],
  imports: [
    HttpLinkModule, ApolloModule, HttpClientModule, MatCardModule, ReactiveFormsModule,
    MatListModule, CommonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule,
    RouterModule.forChild(routes),

  ],
  exports: [
    DataViewerComponent
  ]
})
export class DataViewerModule { }
