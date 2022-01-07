import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  selectedCountry!: string;


  ngOnInit() {
    this.options = this.activatedRoute.snapshot.data['countries'] as string[];
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(params => {
      this.selectedCountry = params['country'];
    })
  }

  onSelectCountry(change: MatAutocompleteSelectedEvent) {
    const country = change.option.value;
    this.router.navigate(['/country', country], { queryParamsHandling: "preserve" });
  }
}