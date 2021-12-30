import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AllCountriesComponent } from './all-countries/all-countries.component';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
import { ChartComponent } from './chart/chart.component';
import { ToolsComponent } from './tools/tools.component';
import { DetailComponent } from './detail/detail.component';
import { ChartListComponent } from './chart-list/chart-list.component';
import { CountrySmallComponent } from './country-small/country-small.component';
import { SearchComponent } from './search/search.component';
import { TimePeriodComponent } from './time-period/time-period.component';
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
    path: ':country',
    resolve: { countries: CountryResolver },
    children: [
      {
        path: '',
        component: ChartListComponent
      },
      {
        path: '',
        outlet: 'content-small',
        component: CountrySmallComponent
      },
      {
        path: '',
        outlet: 'tools',
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
        path: '',
        outlet: 'aside',
        component: DetailComponent,
      },
    ]
  },
 
];

@NgModule({
  declarations: [
    AllCountriesComponent, ChartComponent, ToolsComponent, DetailComponent, ChartListComponent, CountrySmallComponent, SearchComponent, TimePeriodComponent
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
    MatSelectModule,
    RouterModule.forChild(routes),

  ]
})
export class CountryModule { }
