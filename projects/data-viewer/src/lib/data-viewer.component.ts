import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'lib-data-viewer',
  template: `
   <div>
    <canvas #chart></canvas>
    </div>
  `,
  styles: [
  ]
})
export class DataViewerComponent implements OnInit {

  @ViewChild('chart', { static: true }) chartElement?: ElementRef;
  chart!: Chart;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {

    this.createPlot();

    this.apollo
      .watchQuery({
        query: gql`
{
  countries(names: ["United Kingdom"]) {
    name
    results {
      date
      label: date
      confirmed
    }
  }
}
`,
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

        countries[0].results.forEach((r: any, index: number, results: any[]) => {

          if (index === 0) {
            diffData.push({
              x: r.date,
              y: r.confirmed
            });
          } else {
            diffData.push({
              x: r.date,
              y: r.confirmed - results[index - 1].confirmed
            });
          }
        });

        const diffDataSeries = {
          data: diffData,
          label: countries[0].name,
          borderColor: 'rgba(0,0,0, 0.5)',
          pointBackgroundColor: '#00c4b6',
          showLine: true,
          pointRadius: 0.5,
          borderWidth: 1,
          backgroundColor: 'rgba(0,0,0, 0.1)'
        }

        this.chart.data.datasets = [diffDataSeries];
        this.chart.update();
      })
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
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
          }]
        }
      }
    });
  }

}
