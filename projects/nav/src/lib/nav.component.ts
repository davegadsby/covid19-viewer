import { Component, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-nav',
  template: `
    <mat-selection-list #countries [multiple]="false">
    <mat-list-option *ngFor="let country of countries$ | async" 
      [value]="country" [routerLink]="[{outlets: {'data-viewer' : ['cases/{{country}}']}}]" routerLinkActive="active">
      {{country}}
    </mat-list-option>
  </mat-selection-list>
  `,
  styles: [
  ]
})
export class NavComponent implements OnInit {

  countries$!: Observable<string[]>;

  constructor(private apollo: Apollo, private router: Router, private activatedRoute: ActivatedRoute) {

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

  // onSelectCountry(change: MatSelectionListChange) {
  //   console.log(change.options[0].value);
  //   this.router.navigate([`../${change.options[0].value}`], { relativeTo: this.activatedRoute });
  // }

  onClick() {

    this.router.navigate([`../France`],);
  }



}
