import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid19-viewer';
  country!: string;

  constructor( private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
    })
  }

}
