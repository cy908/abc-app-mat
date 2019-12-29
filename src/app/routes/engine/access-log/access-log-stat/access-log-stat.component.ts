import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-access-log-stat',
  templateUrl: './access-log-stat.component.html',
  styleUrls: ['./access-log-stat.component.scss']
})
export class AccessLogStatComponent implements OnInit {

  cols = 2;

  widthOffset = 16;
  heightOffset = 60;

  constructor(
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
  }

  private initObserve() {
    this.breakpoint.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((bps) => {
      if (bps.matches) {
        this.cols = 1;
      }
    });
    this.breakpoint.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((bps) => {
      if (bps.matches) {
        this.cols = 2;
      }
    });
  }

  goBack() {
    history.back();
  }

}
