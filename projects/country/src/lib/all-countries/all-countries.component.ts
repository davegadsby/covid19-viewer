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

  countries!: string[];

  constructor(private activatedRoute: ActivatedRoute ) {

  }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.data);
    this.countries = this.activatedRoute.snapshot.data['countries'] as string[];
  }
}
