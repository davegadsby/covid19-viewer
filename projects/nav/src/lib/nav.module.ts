import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { AllCountriesComponent } from './all-countries/all-countries.component';
import { SearchComponent } from './search/search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';

const uri = 'https://covid19-graphql.now.sh/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

const routes: Routes = [
  {
    path: 'all',
    component: AllCountriesComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: '',
    redirectTo:'all',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AllCountriesComponent,
    SearchComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    HttpLinkModule, ApolloModule, HttpClientModule, ReactiveFormsModule,
    MatListModule, CommonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  exports: [
    AllCountriesComponent
  ]
})
export class NavModule { }
