import { Component, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading = true;
  
  constructor(private router: Router) { 
    this.router.events.subscribe((event) => {
      this.handleNavigation(event);
    })
  }

  handleNavigation(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loading = true
    }
    if (event instanceof NavigationEnd) {
     // setTimeout(() => this.loading = false, 2000); 
      
    }
    if (event instanceof NavigationCancel) {
     // this.loading = false
    }
    if (event instanceof NavigationError) {
    //  this.loading = false
    }
  }

  ngOnInit(): void {
  }



}
