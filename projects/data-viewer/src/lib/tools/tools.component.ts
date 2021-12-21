import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'data-viewer-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {

  date!: string;
  country: any;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      console.log(params['country']);
    });
  }
}