import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { DepartmentManageUrl } from '../department-manage-url';
import { Department } from '../department-model';

@Component({
  selector: 'app-department-manage-info',
  templateUrl: './department-manage-info.component.html',
  styleUrls: ['./department-manage-info.component.scss'],
  animations: [slideToLeft()]
})
export class DepartmentManageInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  departmentId = 0;
  department: Department = null;
  parentId = 0;
  parentDepartment: Department = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.departmentId = +this.route.snapshot.paramMap.get('id');
    this.getDepartment();
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

  private getDepartment() {
    if (this.loading) {
      return;
    }
    let department = new Department();
    department.id = this.departmentId;
    const url = DepartmentManageUrl.URL_DEPARTMENT_INFO;
    this.loading = true;
    this.http.post<Department>(url, department)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.department = data;
        this.parentId = this.department.parentId;
        if (this.parentId > 0) {
          this.getParentDepartment();
        }
      });
  }

  private getParentDepartment() {
    if (this.loading) {
      return;
    }
    let department = new Department();
    department.id = this.parentId;
    const url = DepartmentManageUrl.URL_DEPARTMENT_INFO;
    this.loading = true;
    this.http.post<Department>(url, department)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.parentDepartment = data;
      });
  }

  goBack() {
    history.back();
  }

}
