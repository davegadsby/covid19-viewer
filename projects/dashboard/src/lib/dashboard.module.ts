import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DashboardComponent } from './dashboard.component';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-luxon';
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

const uri = 'https://covid19-graphql.now.sh/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

const routes: Routes = [
  { path: ':country',  component: DashboardComponent},
  { path: '',  component: DashboardComponent}
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  imports: [
    RouterModule.forChild(routes), CommonModule,
    HttpLinkModule, ApolloModule, HttpClientModule,
  ],
  exports: [
    DashboardComponent,ApolloModule
  ]
})
export class DashboardModule { }
