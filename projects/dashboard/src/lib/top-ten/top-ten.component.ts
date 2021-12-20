import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, Observable, take } from 'rxjs';

@Component({
  selector: 'lib-top-ten',
  templateUrl: './top-ten.component.html',
  styleUrls: ['./top-ten.component.css']
})
export class TopTenComponent implements OnInit {

  topTen$!: Observable<any[]>;

  constructor(private apollo: Apollo) {

    const allCountries$ = this.apollo
      .watchQuery({
        query: gql`
    {
        countries(names: []) {
          name
          latest:mostRecent {
            date(format: "dd MMMM yyyy")
            confirmed 
            growthRate
            cases: confirmed
          }
        }
      }
`,
      }).valueChanges.pipe(map((payload: any) => payload.data.countries));


    const latest$ = allCountries$.pipe(map(countries => countries.map((r: any) => ({name: r.name, new: Math.round( r.latest.cases * r.latest.growthRate), ...r.latest})   )));
    this.topTen$ = latest$.pipe(map(l => l.sort(this.compare).slice(0,10)));
    this.topTen$.subscribe(r => console.log(r));
  }

  private compare(a: any, b: any) {
    if (a.new > b.new) {
      return -1;
    }
    if (a.new < b.new) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  ngOnInit(): void {
  }

}
