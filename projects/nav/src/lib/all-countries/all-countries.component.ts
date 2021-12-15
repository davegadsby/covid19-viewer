import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-all-countries',
  templateUrl: './all-countries.component.html',
  styleUrls: ['./all-countries.component.scss']
})
export class AllCountriesComponent implements OnInit {

  countries$!: Observable<string[]>;

  constructor(private apollo: Apollo, 
    private router: Router, private activatedRoute: ActivatedRoute ) {

    this.countries$ = this.apollo
      .watchQuery({
        query: gql`
      {
          countries(names: []) {
            name
            
          }
        }
`,
      })
      .valueChanges.pipe(map((payload: any) => payload.data.countries.map((c: any) => c.name)));
  }

  ngOnInit(): void {

  }

  onSelectCountry(change: MatSelectionListChange) {
  const path = `cases/${change.options[0].value}`;
  this.router.navigate(['', {outlets: { 'content': path}} ]);
  }
}
