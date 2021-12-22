import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map, take } from 'rxjs';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from './animations';
import { DateTime } from 'luxon';

const GET_COUNTRY_DATA = gql`
query GetCountryData($country: String!, $dateFrom: String!) {
  results(countries: [$country], date: {gt: $dateFrom} ) {
    date
    label: date
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
    {value:  new Date('02-01-2020').toUTCString(), viewValue: 'All time'},
    {value: this.createFromDate(1), viewValue: 'Last year'},
    {value: this.createFromDate(undefined, 6), viewValue: 'Last 6 months'},
    {value: this.createFromDate(undefined, 3), viewValue: 'Last 3 months'},
    {value: this.createFromDate(undefined, 1), viewValue: 'Last month'},
  ];
  selectedTimeSpan: string = this.timeSpans[2].value;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
   
    console.table(this.timeSpans);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      if (this.country) { 
        this.plot();
      }
    })
  }

  dateChanged() {
    this.plot();
  }

  private createFromDate(numberOfYears?: number, numberOfMonths?: number): string {

    const date = new Date(Date.now())
    if(numberOfYears) {
      date.setFullYear(date.getFullYear() - numberOfYears)
    }
    if(numberOfMonths) {
      date.setMonth(date.getMonth() - numberOfMonths)
    }
    return date.toUTCString()
  }

  private plot() {

    if(!this.chart){
      this.createPlot();
    }

    console.log('plotting', this.country, this.selectedTimeSpan);
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
        const weekAverage: any[] = [];

        data.results.forEach((r: any, index: number, results: any[]) => {
         
          const date = DateTime.fromFormat(r.date, "yyyy-M-d").valueOf();
          const cases = r.confirmed * r.growthRate
            casesData.push({
              x: date,
              y: cases >= 0 ? cases : 0
            });
            let deaths = 0;
            if(index > 1) {
              deaths = r.deaths - results[index - 1].deaths;
            } 
            console.log(deaths);
            
            deathData.push({
              x: date,
              y: deaths
            })
        });

        casesData.forEach((element: any, index: number) => {

          let count = 0;
          let total = 0;
          for (let i = -6; i <= 0; i++) {
            const ind = index + i;

            if (ind >= 0) {
              total = total + casesData[ind].y
              count++;
            }
          }
          weekAverage.push(({
            x: element.x,
            y: count > 0 ? total / count : 0
          })
          );
        });

        const diffDataSeries = {
          type: 'bar',
          data: casesData,
          spanGaps: false,
          label: 'Daily cases',
          borderColor: 'rgba(0,0,0, 0.5)',
          pointBackgroundColor: '#51b522',
          showLine: false,
          pointRadius: 0,
          borderWidth: 0,
          backgroundColor: '#3f51b522',
        }

        const deathsDataSeries = {
          type: 'bar',
          data: deathData,
          spanGaps: false,
          label: 'Daily deaths',
          borderColor: 'rgba(255,0,0, 0.5)',
          pointBackgroundColor: 'rgba(255,0,0, 0.5)',
          showLine: false,
          pointRadius: 0,
          borderWidth: 0,
          backgroundColor: 'rgba(255,0,0, 0.5)',
        }

        const weekAverageDataSeries = {
          data: weekAverage,
          spanGaps: true,
          label: '7 day average',
          borderColor: '#3f51b5',
          pointBackgroundColor: '#3f51b5',
          showLine: true,
          pointRadius: 0.5,
          borderWidth: 3,
          backgroundColor: 'rgba(0,0,0, 0)'
        }

        this.chart.data.datasets = [weekAverageDataSeries, diffDataSeries, deathsDataSeries];
        this.chart.update();
      })
  }

  private createPlot() {
    let ctx = this.chartElement?.nativeElement;
    ctx = ctx.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        animation: {
          duration: 0
        },
        scales: {
          x: {
            type: 'time',
            time: {

              tooltipFormat: 'DD'
            },
            grid: {
              display: false,
            }
          },
          y: {
            grid: {
              display: true,
            }

          }
        },
      }
    });
  }
}
