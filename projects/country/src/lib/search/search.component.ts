import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'lib-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
  }

  displayFn(country: string): string {
    return country;
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(private apollo: Apollo,
    private router: Router, private activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(params => {
      this.myControl.setValue(params['country']);
    })

    this.apollo
      .watchQuery({
        query: gql`
      {
          countries(names: []) {
            name
            
          }
        }
`,
      })
      .valueChanges.pipe(map((payload: any) => payload.data.countries.map((c: any) => c.name))).subscribe(countries => this.options = countries);
  }

  onSelectCountry(change: MatAutocompleteSelectedEvent) {
    const country = change.option.value;
    this.router.navigate(['/country', country], { queryParamsHandling: "preserve" });
  }
}