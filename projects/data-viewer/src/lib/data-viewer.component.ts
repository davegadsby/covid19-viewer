import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from './animations';
import { DateTime } from 'luxon';

const GET_COUNTRY_DATA = gql`
query GetCountryData($country: String!) {
countries(names: [$country]) {
  name
  results {
    date
    label: date
    confirmed
  }
}
}
`

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

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      console.log('country', this.country);
      if (this.country) {
        this.plot(this.country);
      }
    })
  }

  private plot(country: string) {
    this.apollo
      .watchQuery({
        query: GET_COUNTRY_DATA,
        variables: {
          country: country
        }
      })
      .valueChanges.pipe(map((payload: any) => payload.data.countries)).subscribe((countries: any) => {
        console.log('got data', countries);

        const diffData: any[] = [];
        const weekAverage: any[] = [];

        countries[0].results.forEach((r: any, index: number, results: any[]) => {
         
          const date = DateTime.fromFormat(r.date, "yyyy-M-d").valueOf();
         
          if (index === 0) {
            diffData.push({
              x: date,
              y: r.confirmed
            });
          } else {
            const diff = r.confirmed - results[index - 1].confirmed;
            const newCases = diff > 0 ? diff : 0;

            diffData.push({
              x: date,
              y: newCases
            });
          }
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
            y: count > 0 ? total / count : 0
          })
          );
        });

        const diffDataSeries = {
          type: 'bar',
          data: diffData,
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
          data: weekAverage,
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

  ngOnInit(): void {
    this.createPlot();
  }

  private createPlot() {
    console.log('creating plot');

    let ctx = this.chartElement?.nativeElement;
    ctx = ctx.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
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
