import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NavComponent } from './nav.component';
import {MatListModule} from '@angular/material/list';

import { CommonModule } from '@angular/common';

const uri = 'https://covid19-graphql.now.sh/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

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
    HttpLinkModule, ApolloModule, HttpClientModule,
    MatListModule, CommonModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
