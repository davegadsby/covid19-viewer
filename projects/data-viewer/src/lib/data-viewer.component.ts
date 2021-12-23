import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map, take } from 'rxjs';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from './animations';
import { DateTime } from 'luxon';
import { Point } from './chart/chart.component';

const GET_COUNTRY_DATA = gql`
query GetCountryData($country: String!, $dateFrom: String!) {
  results(countries: [$country], date: {gt: $dateFrom} ) {
    date
    confirmed
    deaths
    growthRate
}
}
`

interface TimeSpan {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'lib-data-viewer',
  templateUrl: 'data-viewer.component.html',
  styleUrls: ['data-viewer.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class DataViewerComponent implements OnInit {

  @ViewChild('chart', { static: true }) chartElement?: ElementRef;
  chart!: Chart;
  country!: string;
  timeSpans: TimeSpan[] = [
    { value: new Date('02-01-2020').toUTCString(), viewValue: 'All time' },
    { value: this.createFromDate(1), viewValue: 'Last year' },
    { value: this.createFromDate(undefined, 6), viewValue: 'Last 6 months' },
    { value: this.createFromDate(undefined, 3), viewValue: 'Last 3 months' },
    { value: this.createFromDate(undefined, 1), viewValue: 'Last month' },
  ];
  selectedTimeSpan!: string;
  cases!: { data: Point[], averages: Point[]};
  deaths!: { data: Point[], averages: Point[]};
  latest!: { date: string,  cases: number, deaths: number, casesAverage: number, deathsAverage: number }

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      if (this.country) {
        this.plot();
      }
    })
    this.route.queryParams.subscribe(params => {
      if(params['period']) {
        const timeSpan = this.timeSpans.find(t => t.viewValue === params['period']);
        if(timeSpan) {
          this.selectedTimeSpan = timeSpan.value;
          this.dateChanged();
        }
      }
    })
  }

  dateChanged() {
    this.plot();
  }

  private createFromDate(numberOfYears?: number, numberOfMonths?: number): string {

    const date = new Date(Date.now())
    if (numberOfYears) {
      date.setFullYear(date.getFullYear() - numberOfYears)
    }
    if (numberOfMonths) {
      date.setMonth(date.getMonth() - numberOfMonths)
    }
    // pad values
    date.setDate(date.getDate() - 10)
    return date.toUTCString()
  }

  private plot() {
    if(!this.country || !this.selectedTimeSpan){
      return;
    }
    console.log(`DataViewer:Plotting data: ${this.country}, ${this.selectedTimeSpan}`)
    const country$ = this.apollo
      .query({
        query: GET_COUNTRY_DATA,
        variables: {
          country: this.country,
          dateFrom: this.selectedTimeSpan
        }
      })
      .pipe(map((payload: any) => payload.data));


    country$.pipe(take(1)).subscribe((data: any) => {
      const casesData: any[] = [];
      const deathData: any[] = [];
      const casesAverage: any[] = [];
      const deathsAverage: any[] = [];

      data.results.forEach((r: any, index: number, results: any[]) => {
        if (index <= 0) {
          return;
        }
        const date = DateTime.fromFormat(r.date, "yyyy-M-d").valueOf();
        const cases = Math.round(r.confirmed * r.growthRate);

        casesData.push({
          x: date,
          y: cases >= 0 ? cases : 0
        });
        let deaths = 0;

        deaths = Math.round(r.deaths - results[index - 1].deaths);

        deathData.push({
          x: date,
          y: deaths >= 0 ? deaths : 0
        })

        let casesTotal = 0;
        let deathsTotal = 0;
        let count = 0;
        for (let i = -7; i < 0; i++) {
          const ind = index + i;
          if (ind >= 0) {
            casesTotal = casesTotal + casesData[ind].y;
            deathsTotal = deathsTotal + deathData[ind].y;
            count++;
          }
        }
        casesAverage.push(({
          x: date,
          y:  count > 0 ? Math.round(casesTotal / count) : 0
        }));
        deathsAverage.push(({
          x: date,
          y: count > 0 ? Math.round(deathsTotal / count) : 0
        }));
      });

      this.cases = {
        data: casesData.splice(7),
        averages: casesAverage.splice(7)
      }
      this.deaths = {
        data: deathData.splice(7),
        averages: deathsAverage.splice(7)
      }
      const lastIndex = this.cases.data.length -1;
      this.latest = { 
        date: new Date(this.cases.data[lastIndex].x).toDateString(),
        cases: this.cases.data[lastIndex].y, 
        deaths: this.deaths.data[lastIndex].y, 
        casesAverage: this.cases.averages[lastIndex].y, 
        deathsAverage: this.deaths.averages[lastIndex].y  
      }
    })
  }
}
