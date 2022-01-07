import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { CountryService } from '../country.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  latest!: { cases: number, deaths: number };
  date!: string;
  country!: string;
  cases!: number;
  deaths!: number;

  constructor(private route: ActivatedRoute, private service: CountryService) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      this.getLatestResults();
    })
  }

  ngOnInit(): void {
  }

  private getLatestResults() {

    this.service.getLatest(this.country).pipe(take(1)).subscribe(results => {

      const lastIndex = results.length - 1;
      this.date = results[lastIndex].date;
      this.cases = Math.round(results[lastIndex].confirmed * results[lastIndex].growthRate);
      this.deaths = (results[lastIndex].deaths - results[lastIndex - 1].deaths) ?? 0;
    });
  }
}