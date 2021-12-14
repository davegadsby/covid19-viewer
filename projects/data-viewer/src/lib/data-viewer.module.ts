import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataViewerComponent } from './data-viewer.component';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule } from '@angular/common/http';

const uri = 'https://covid19-graphql.now.sh/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

const routes: Routes = [
  
  { path: '',  component: DataViewerComponent}

];

@NgModule({
  declarations: [
    DataViewerComponent
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
    HttpLinkModule, ApolloModule, HttpClientModule

  ],
  exports: [
    DataViewerComponent, ApolloModule
  ]
})
export class DataViewerModule { }
