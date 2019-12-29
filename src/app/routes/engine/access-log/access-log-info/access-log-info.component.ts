import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { AccessLogUrl } from '../access-log-url';
import { AccessLog } from '../access-log-model';

@Component({
  selector: 'app-access-log-info',
  templateUrl: './access-log-info.component.html',
  styleUrls: ['./access-log-info.component.scss'],
  animations: [slideToLeft()]
})
export class AccessLogInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  accessLogId = 0;
  accessLog: AccessLog = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.accessLogId = +this.route.snapshot.paramMap.get('id');
    this.getAccessLog();
  }

  private initObserve() {
    this.breakpoint.observe([Breakpoints.XSmall]).subscribe((bps) => {
      if (bps.matches) {
        this.cols = 1;
      }
    });
    this.breakpoint.observe([Breakpoints.Small, Breakpoints.Medium]).subscribe((bps) => {
      if (bps.matches) {
        this.cols = 2;
      }
    });
    this.breakpoint.observe([Breakpoints.Large, Breakpoints.XLarge]).subscribe((bps) => {
      if (bps.matches) {
        this.cols = 3;
      }
    });
  }

  private getAccessLog() {
    if (this.loading) {
      return;
    }
    let accessLog = new AccessLog();
    accessLog.id = this.accessLogId;
    const url = AccessLogUrl.URL_ACCESS_LOG_INFO;
    this.loading = true;
    this.http.post<AccessLog>(url, accessLog)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.accessLog = data;
      });
  }

  goBack() {
    history.back();
  }

}
