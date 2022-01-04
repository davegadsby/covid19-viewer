import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
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
  mobileQuery!: MediaQueryList;

  private loadingOverlay!: OverlayRef | null;
  private _mobileQueryListener: () => void;
  
  constructor( private route: ActivatedRoute, private router: Router, private overlay: Overlay,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.route.params.subscribe(params => {
      this.country = params['country'];
    })
    const navStartEvents = this.router.events.pipe(filter(ev => ev instanceof NavigationStart));
    const navEndEvents = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd));

    navStartEvents.subscribe(() => {
      this.createLoadingOverlay();
       setTimeout(() => this.showLoadingOverlay(), 200);
    })
    navEndEvents.subscribe(() => {
      this.cleanUpOverlay();
    })

    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
