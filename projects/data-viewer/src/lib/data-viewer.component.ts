import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';

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
  styleUrls: ['data-viewer.component.scss']
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

        const dataSeries = {
          data: countries[0].results.map((r: any) => {
            return {
              x: r.date,
              y: r.confirmed
            };
          }),
          label: countries[0].name,
          borderColor: '#00c4b6',
          borderWidth: 0.5,
          pointBackgroundColor: '#00c4b6',
          showLine: true,
        }
        const diffData: any[] = [];
        const weekAverage: any[] = [];

        countries[0].results.forEach((r: any, index: number, results: any[]) => {

          if (index === 0) {
            diffData.push({
              x: r.date,
              y: r.confirmed
            });
          } else {
            const diff = r.confirmed - results[index - 1].confirmed;
            const newCases = diff > 0 ? diff : 0;

            diffData.push({
              x: r.date,
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
          data: diffData,
          type: 'bar',
          label: 'daily cases',
          borderColor: 'rgba(0,0,0, 0.5)',
          pointBackgroundColor: '#00c4b6',
          showLine: false,
          pointRadius: 0,
          borderWidth: 0,
          backgroundColor: 'rgba(255,0,0, 0.2)'
        }

        const weekAverageDataSeries = {
          data: weekAverage,
          label: '7 day average',
          borderColor: 'rgba(255,0,0, 0.8)',
          pointBackgroundColor: '#00c4b6',
          showLine: true,
          pointRadius: 0,
          borderWidth: 2,
          backgroundColor: 'rgba(0,0,0, 0)'
        }

        this.chart.data.datasets = [diffDataSeries, weekAverageDataSeries];
        this.chart.update();
      })
  }

  ngOnInit(): void {

    this.createPlot();


  }

  private createPlot() {
    console.log('creating plot');
    Chart.defaults.global.defaultFontColor = '#AAA';

    let ctx = this.chartElement?.nativeElement;
    ctx = ctx.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: []
      },

      // options for all datasets
      options: {
        scales: {
          xAxes: [{
            type: 'time',
          }]
        }
      }
    });
  }

}
