import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { RoleManageUrl } from '../role-manage-url';
import { Role } from '../role-model';

@Component({
  selector: 'app-role-manage-info',
  templateUrl: './role-manage-info.component.html',
  styleUrls: ['./role-manage-info.component.scss'],
  animations: [slideToLeft()]
})
export class RoleManageInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  roleId = 0;
  role: Role = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.roleId = +this.route.snapshot.paramMap.get('id');
    this.getRole();
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

  private getRole() {
    if (this.loading) {
      return;
    }
    let role = new Role();
    role.id = this.roleId;
    const url = RoleManageUrl.URL_ROLE_INFO;
    this.loading = true;
    this.http.post<Role>(url, role)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.role = data;
      });
  }

  goBack() {
    history.back();
  }

}
