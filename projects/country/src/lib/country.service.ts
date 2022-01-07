import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, Observable } from 'rxjs';

@Injectable()
export class CountryService {

  constructor(private apollo: Apollo) { }

  getAll(): Observable<string[]> {

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

  getDetails(country: string, dateFrom: string): Observable<string[]> {

    return this.apollo
      .query({
        query:
          gql`
      query GetCountryData($country: String!, $dateFrom: String!) {
        results(countries: [$country], date: {gt: $dateFrom} ) {
          date
          confirmed
          deaths
          growthRate
        }
      }
      `,
        variables: {
          country,
          dateFrom
        }
      })
      .pipe(map((payload: any) => payload.data));
  }

  getLatest(country: string) {

    const fromDate = new Date(Date.now());
    fromDate.setDate(fromDate.getDate() - 4);

    return this.apollo
      .query({
        query: gql`
      query GetResults($country: String!, $date: String!) {
        last2Days:results(countries: [$country], date: {gt: $date}){
          date
          confirmed
          deaths
          growthRate
        }
        }
      `,
        variables: {
          country: country,
          date: fromDate.toUTCString()
        }
      })
      .pipe(map((payload: any) => payload.data.last2Days));

  }
}
