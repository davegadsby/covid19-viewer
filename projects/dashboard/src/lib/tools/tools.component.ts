import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

  date!: string;
  constructor() { }

  ngOnInit(): void {
    this.date = new Date(Date.now()).toLocaleDateString()
  }

}
