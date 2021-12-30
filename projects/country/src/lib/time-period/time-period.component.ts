import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface TimeSpan {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'time-period',
  templateUrl: './time-period.component.html',
  styleUrls: ['./time-period.component.scss']
})
export class TimePeriodComponent implements OnInit {

  date!: string;
  timeSpans: string[] = [
    'All time',
    'Last year' ,
    'Last 6 months',
    'Last 3 months',
    'Last month'
  ];
  selectedTimeSpan: string = this.timeSpans[2];

  constructor(private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      if(params['period']) {
        const timeSpan = this.timeSpans.find(t => t === params['period']);
        if(timeSpan) {
          this.selectedTimeSpan = timeSpan;
        }
      }
    })
  }

  ngOnInit(): void {
    this.date = new Date(Date.now()).toLocaleDateString()
  }
}