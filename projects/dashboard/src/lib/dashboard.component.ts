import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { Chart } from 'chart.js';
import { resourceLimits } from 'worker_threads';

const GET_COUNTRY_DATA = gql`
query GetCountryData($country: String!) {
  overview:country(name: $country) {
    name
    latest:mostRecent {
      date(format: "dd MMMM yyyy")
      confirmed 
      deaths
      growthRate
      cases: confirmed
    }
    overall:mostRecent {
      confirmed
      deaths
    }
  }
  lastMonth:results(countries: [$country], date: {gt: "11-16-2021"}){
    date
    confirmed
    deaths
    growthRate
  }
  }
`

@Component({
  selector: 'lib-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  country!: string;
  overview!: any;
  latestCases!: number;

  @ViewChild('chart', { static: true }) chartElement?: ElementRef;
  chart!: Chart;


  constructor(private apollo: Apollo, private route: ActivatedRoute) {

    console.log('Dashboard:Created');

    this.route.params.subscribe(params => {
      this.country = params['country'];
      console.log('Dashboard:country', this.country);
      if (this.country != null) {
        this.render(this.country);
      }
    })
  }

  ngOnInit(): void {
    this.createPlot();
  }

  private render(country: string) {
    this.apollo
      .watchQuery({
        query: GET_COUNTRY_DATA,
        variables: {
          country: country
        }
      })
      .valueChanges.pipe(map((payload: any) => payload.data)).subscribe((result: any) => {
        console.log('Dashboard:DataAcquired', result);
        this.overview = result.overview;

        // this.date = result.date;
        // this.deaths = result.deaths;
        // this.total = result.confirmed;
        // this.latest = Math.round(result.confirmed * result.growthRate);

        this.latestCases = result.overview.latest.confirmed * result.overview.latest.growthRate;


        const diffData: any[] = [];
        const weekAverage: any[] = [];

        result.lastMonth.forEach((r: any, index: number, results: any[]) => {
         
          const date = DateTime.fromFormat(r.date, "yyyy-M-d").valueOf();
        
            diffData.push({
              x: date,
              y: r.confirmed * r.growthRate
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
