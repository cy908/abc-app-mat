import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

import { LoadingComponent } from './loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new Subject<boolean>();

  private showing = false;
  private count = 0;
  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
  ) {
    this.initOverlay();
    this.initLoading();
  }

  private initOverlay() {
    const _positionStrategy = this.overlay.position().global()
      .centerHorizontally().centerVertically();
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: _positionStrategy,
    });
  }

  private initLoading() {
    this.loadingSubject.forEach((show) => {
      if (show) {
        setTimeout(() => {
          this.open();
        }, 0);
      } else {
        setTimeout(() => {
          this.close();
        }, 100);
      }
    });
  }

  private open() {
    if (!this.showing) {
      this.showing = true;
      const cp = new ComponentPortal(LoadingComponent);
      this.overlayRef.attach(cp);
    }
    this.count++;
  }

  private close() {
    this.count--;
    if (this.count <= 0) {
      this.showing = false;
      this.count = 0;
      this.overlayRef.detach();
    }
  }

  loading(show: boolean) {
    this.loadingSubject.next(show);
  }

}
