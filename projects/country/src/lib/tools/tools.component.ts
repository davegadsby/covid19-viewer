import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  country: string = 'United Kingdom';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
    })
  }

  ngOnInit(): void {
  }

}
