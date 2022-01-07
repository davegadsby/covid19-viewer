import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'lib-all-countries',
  templateUrl: './all-countries.component.html',
  styleUrls: ['./all-countries.component.scss']
})
export class AllCountriesComponent implements OnInit {

  countries!: string[];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.countries = this.activatedRoute.snapshot.data['countries'] as string[];
  }
}
