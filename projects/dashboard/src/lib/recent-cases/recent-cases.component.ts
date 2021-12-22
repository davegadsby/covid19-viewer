import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Chart } from 'chart.js';
import gql from 'graphql-tag';
import { DateTime } from 'luxon';
import { map } from 'rxjs';

const GET_COUNTRY_DATA = gql`
query GetCountryData($country: String!, $date: String!) {
  lastMonth:results(countries: [$country], date: {gt: $date}){
    date
    confirmed
    growthRate
  }
  }
`

@Component({
  selector: 'recent-cases',
  templateUrl: './recent-cases.component.html',
  styleUrls: ['./recent-cases.component.scss']
})
export class RecentCasesComponent implements OnChanges {

  @ViewChild('chart', { static: true }) chartElement?: ElementRef;
  chart!: Chart;

  @Input() country!: string;

  constructor(private apollo: Apollo) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'].currentValue) {
      if (!this.chart) {
        this.createChart();
      }
      this.render(changes['country'].currentValue);
    }
  }

  private createChart() {
    console.log('creating plot');

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
        plugins: {
          legend: {
            title: {
              display: false,
            },
            display: false,
          }
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

  private render(country: string) {

    const date = new Date(Date.now());
    date.setMonth(date.getMonth() - 1);
    date.setDate(date.getDate() - 9);

    this.apollo
      .query({
        query: GET_COUNTRY_DATA,
        variables: {
          country: country,
          date: date.toUTCString()
        }
      })
      .pipe(map((payload: any) => payload.data)).subscribe((result: any) => {

        const diffData: any[] = [];
        const weekAverage: any[] = [];

        result.lastMonth.forEach((r: any, index: number, results: any[]) => {

          const date = DateTime.fromFormat(r.date, "yyyy-M-d").valueOf();
          const change = Math.round(r.confirmed * r.growthRate);

          diffData.push({
            x: date,
            y: change > 0 ? change : 0
          });
        });

        diffData.forEach((element: any, index: number) => {

          let count = 0;
          let total = 0;
          for (let i = -6; i <= 0; i++) {
            const ind = index + i;

            if (ind >= 0) {
              total = total + diffData[ind].y
              count++;
            }
          }
          weekAverage.push(({
            x: element.x,
            y: count > 0 ? Math.round(total / count) : 0
          })
          );
        });

        const diffDataSeries = {
          type: 'bar',
          data: diffData.splice(7),
          spanGaps: false,
          label: 'Daily cases',
          borderColor: 'rgba(0,0,0, 0.5)',
          pointBackgroundColor: '#FF4081',
          showLine: false,
          pointRadius: 0,
          borderWidth: 0,
          backgroundColor: 'rgba(0,0,0, 0.5)',
        }

        const weekAverageDataSeries = {
          data: weekAverage.splice(7),
          spanGaps: true,
          label: '7 day average',
          borderColor: '#FF4081',
          pointBackgroundColor: '#FF4081',
          showLine: true,
          pointRadius: 0,
          borderWidth: 2,
          backgroundColor: 'rgba(0,0,0, 0)'
        }

        this.chart.data.datasets = [weekAverageDataSeries, diffDataSeries];
        this.chart.update();
      })
  }
}
