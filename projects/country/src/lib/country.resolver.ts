import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CountryService } from './country.service';

@Injectable()
export class CountryResolver implements Resolve<Observable<string[]>>{

    constructor(private service: CountryService) { }

    resolve(): Observable<string[]> {
        return this.service.getAll();
    }
}