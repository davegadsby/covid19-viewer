import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

export interface Point {
  x: number | string
  y: number
}

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {

  @ViewChild('chart', { static: true }) chartElement?: ElementRef;
  chart!: Chart;

  @Input() data!: Point[];
  weekAverage!: Point[];
  @Input()colour: string = '#3f51b5';
  @Input() title!: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {

    const dataChanges = changes['data'];
    if (dataChanges) {
      this.plot();
    }
  }

  ngOnInit(): void {
  }

  private plot() {

    if (!this.chart) {
      this.createChart();
    }

    this.weekAverage = [];

    this.data.forEach((element: any, index: number) => {

      let count = 0;
      let total = 0;
      for (let i = -6; i <= 0; i++) {
        const ind = index + i;

        if (ind >= 0) {
          total = total + this.data[ind].y
          count++;
        }
      }
      this.weekAverage.push(({
        x: element.x,
        y: count > 0 ? total / count : 0
      })
      );
    });

    const diffDataSeries: any = {
      type: 'bar',
      data: this.data,
      spanGaps: false,
      label: `Daily ${this.title.toLowerCase()}`,
      pointBackgroundColor: this.colour,
      showLine: false,
      pointRadius: 0,
      borderWidth: 0,
      backgroundColor: `${this.colour}22`,
    }

    const weekAverageDataSeries = {
      data: this.weekAverage,
      spanGaps: true,
      label: `7 day average ${this.title.toLowerCase()}`,
      borderColor: this.colour,
      pointBackgroundColor: this.colour,
      showLine: true,
      pointRadius: 0,
      borderWidth: 2.5
    }

    this.chart.data.datasets = [ weekAverageDataSeries, diffDataSeries];
    this.chart.update();
  }


  private createChart() {
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
            display: false
          }
        },
        maintainAspectRatio: false,
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