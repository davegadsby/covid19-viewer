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

  @Input() points!: { data: Point[], averages: Point[] };

  @Input() colour: string = '#3f51b5';
  @Input() title!: string;
  diffDataSeries!: any;
  weekAverageDataSeries!: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['points'].currentValue) {
      this.plotData();
    }
  }

  ngOnInit(): void {
  }

  private plotData() {

    if (!this.chart) {
      this.createChart();
    }

    this.diffDataSeries = {
      type: 'bar',
      data: this.points.data,
      spanGaps: false,
      label: `Daily ${this.title.toLowerCase()}`,
      pointBackgroundColor: this.colour,
      showLine: false,
      pointRadius: 0,
      borderWidth: 0,
      backgroundColor: `${this.colour}22`,
    }

    this.weekAverageDataSeries = {
      data: this.points.averages,
      spanGaps: true,
      label: `7 day average ${this.title.toLowerCase()}`,
      borderColor: this.colour,
      pointBackgroundColor: this.colour,
      showLine: true,
      pointRadius: 0,
      borderWidth: 2.5
    }
    this.updateChart();
  }


  private updateChart() {

    this.chart.data.datasets = [this.diffDataSeries, this.weekAverageDataSeries];
    this.chart.update();

    const lastIndex = this.points.data.length - 1;
    this.chart.tooltip?.setActiveElements([{
      datasetIndex: 0,
      index: lastIndex
    },
    {
      datasetIndex: 1,
      index: lastIndex
    }], { x: 0, y: 0 });
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