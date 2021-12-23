import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs';

const GET_COUNTRY_DATA = gql`
query GetResults($country: String!, $date: String!) {
  last2Days:results(countries: [$country], date: {gt: $date}){
    date
    confirmed
    deaths
    growthRate
  }
  }
`

@Component({
  selector: 'lib-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  latest: {cases: number, deaths: number} = {cases: 10, deaths: 10};
  date!: string;
  country!: string;
  cases!: number;
  deaths!: number;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      this.getLatestResults();
    })
   }

  ngOnInit(): void {
  }

  private getLatestResults() {

    const fromDate = new Date(Date.now());
    fromDate.setDate(fromDate.getDate() -3);

    const results$ = this.apollo
      .query({
        query: GET_COUNTRY_DATA,
        variables: {
          country: this.country,
          date: fromDate.toUTCString()
        }
      })
      .pipe(map((payload: any) => payload.data.last2Days));

      results$.subscribe(results => {
        const lastIndex = results.length -1;
        this.date = results[lastIndex].date;
        this.cases = Math.round(results[lastIndex].confirmed * results[lastIndex].growthRate);
        this.deaths = results[lastIndex].deaths - results[lastIndex - 1].deaths;
      });
  }

}
