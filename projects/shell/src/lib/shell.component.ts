import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shell',
  templateUrl: 'shell.component.html',
  styleUrls: ['shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor() { }
  title = 'covid19-viewer';
  country!: string;
  openSidebar = false;

  ngOnInit(): void {
  }

}
