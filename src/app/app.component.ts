import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingComponent } from './loading/loading.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'covid19-viewer';
  country!: string;
  openSidebar = false;
  openASide = false;
  showSecondToolbar = false;
  private loadingOverlay!: OverlayRef | null;


  constructor( private route: ActivatedRoute, private router: Router, private overlay: Overlay) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
    })
    const navStartEvents = this.router.events.pipe(filter(ev => ev instanceof NavigationStart));
    const navEndEvents = this.router.events.pipe(filter(ev => !(ev instanceof NavigationStart)));

    navStartEvents.subscribe(() => {
      this.createLoadingOverlay();
      //Only show loading progress after 200ms
       setTimeout(() => this.showLoadingOverlay(), 200);
       this.showLoadingOverlay();
    })
    navEndEvents.subscribe(() => {
      this.cleanUpOverlay();
    })
  }

  private cleanUpOverlay() {
    if (this.loadingOverlay) {
      this.loadingOverlay?.detach();
      this.loadingOverlay.dispose();
      this.loadingOverlay = null;
    }
  }

  private createLoadingOverlay() {
    this.loadingOverlay = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
  }

  private showLoadingOverlay() {
    if(this.loadingOverlay) {
      this.loadingOverlay.attach(new ComponentPortal(LoadingComponent));
    }
  }

}
