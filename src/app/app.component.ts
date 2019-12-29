import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { VERSION as VERSION_MATERIAL } from '@angular/material';

import { ThemeService } from './core/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private themeSrv: ThemeService,
  ) {
    renderer.setAttribute(
      el.nativeElement,
      'angular-material-version',
      VERSION_MATERIAL.full
    );
  }

  ngOnInit() {
    this.themeSrv.initTheme();
  }

}
