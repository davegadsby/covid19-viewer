import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from '../animations';
import { DateTime } from 'luxon';
import { Point } from '../chart/chart.component';
import { CountryService } from '../country.service';

interface TimeSpan {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'chart-list',
  templateUrl: 'chart-list.component.html',
  styleUrls: ['chart-list.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class ChartListComponent implements OnInit, OnDestroy {

  private subs: Subscription = new Subscription;
  private timeSpans: TimeSpan[] = [
    { value: new Date('02-01-2020').toUTCString(), viewValue: 'All time' },
    { value: this.createFromDate(1), viewValue: 'Last year' },
    { value: this.createFromDate(undefined, 6), viewValue: 'Last 6 months' },
    { value: this.createFromDate(undefined, 3), viewValue: 'Last 3 months' },
    { value: this.createFromDate(undefined, 1), viewValue: 'Last month' },
  ];
  private country!: string;
  private selectedTimeSpan = this.timeSpans[2].value;

  @ViewChild('chart', { static: true }) chartElement?: ElementRef;

  chart!: Chart;
  
  cases!: { data: Point[], averages: Point[] };
  deaths!: { data: Point[], averages: Point[] };

  constructor(private route: ActivatedRoute, private service: CountryService) {

    this.subs = new Subscription;
    this.subscribeToCountry();
    this.subscribeToTimePeriod();
  }

  ngOnDestroy(): void {

    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngOnInit(): void { }

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

  private subscribeToTimePeriod() {
    this.subs.add(this.route.queryParams.subscribe(params => {
      const nextTimeSpan = this.timeSpans.find(t => t.viewValue === params['period']);
      if (nextTimeSpan && this.selectedTimeSpan !== nextTimeSpan.value) {
        this.selectedTimeSpan = nextTimeSpan.value;
        this.plot();
      }
    }));
  }

  private subscribeToCountry() {
    this.subs.add(this.route.params.subscribe(params => {
      const nextCountry = params['country'];
      if (nextCountry && this.country !== nextCountry) {
        this.country = nextCountry;
        this.plot();
      }
    }));
  }

  private plot() {
    if (!this.country || !this.selectedTimeSpan) {
      return;
    }

    this.service.getDetails(this.country, this.selectedTimeSpan).pipe(take(1)).subscribe((data: any) => {
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
          y: count > 0 ? Math.round(casesTotal / count) : 0
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
    })
  }
}
