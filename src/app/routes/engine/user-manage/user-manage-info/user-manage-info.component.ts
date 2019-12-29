import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { UserManageUrl } from '../user-manage-url';
import { User } from '../user-model';

@Component({
  selector: 'app-user-manage-info',
  templateUrl: './user-manage-info.component.html',
  styleUrls: ['./user-manage-info.component.scss'],
  animations: [slideToLeft()]
})
export class UserManageInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  userId = 0;
  user: User = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.getUser();
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

  private getUser() {
    if (this.loading) {
      return;
    }
    let user = new User();
    user.id = this.userId;
    const url = UserManageUrl.URL_USER_INFO;
    this.loading = true;
    this.http.post<User>(url, user)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.user = data;
      });
  }

  goBack() {
    history.back();
  }

}
