import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class CountryService {

  constructor(private apollo: Apollo) { }

  get(): Observable<string[]> {

    // return of(['all']);

    return this.apollo
      .query({
        query: gql`
      {
          countries(names: []) {
            name
          }
      }`,
      }).pipe(map((payload: any) => payload.data.countries.map((c: any) => c.name)));
  }
}
