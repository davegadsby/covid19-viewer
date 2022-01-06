import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import {MatButtonModule} from '@angular/material/button';
import 'chartjs-adapter-luxon';
import { CommonModule } from '@angular/common';
import { TopTenComponent } from './top-ten/top-ten.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule} from '@angular/material/progress-bar'
import { RecentCasesComponent } from './recent-cases/recent-cases.component';
import { ToolsComponent } from './tools/tools.component';
Chart.register(...registerables);

const uri = 'https://covid19-graphql.now.sh/';
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

const routes: Routes = [
  { path: '', component: TopTenComponent},
  { path: '', outlet:'content-small', component: TopTenComponent},
  { path: '', outlet: 'tools',  component: ToolsComponent},
  { path: '', outlet: 'tools-sm', component: ToolsComponent},
];

@NgModule({
  declarations: [
    TopTenComponent,
    RecentCasesComponent,
    ToolsComponent
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
    HttpLinkModule, ApolloModule, HttpClientModule, MatCardModule, MatProgressBarModule, 
    MatButtonModule
  ],
  exports: [
    ApolloModule
  ]
})
export class DashboardModule { }
