import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface TimeSpan {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  date!: string;
  country: string = 'United Kingdom';
  latest = {
    cases: 10,
    deaths: 10,
  }
  timeSpans: string[] = [
    'All time',
    'Last year' ,
    'Last 6 months',
    'Last 3 months',
    'Last month'
  ];
  selectedTimeSpan: string = this.timeSpans[2];

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
    })
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

  dateChanged() {
  }

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


}
