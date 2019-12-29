import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { slideToLeft } from 'src/app/shared/animations';
import { Department } from '../../department-manage';
import { NoticeManageUrl } from '../notice-manage-url';
import { Notice } from '../notice-model';

@Component({
  selector: 'app-notice-manage-info',
  templateUrl: './notice-manage-info.component.html',
  styleUrls: ['./notice-manage-info.component.scss'],
  animations: [slideToLeft()]
})
export class NoticeManageInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  noticeId = 0;
  notice: Notice = null;
  dataSource = new MatTableDataSource<Department>([]);
  selection = new SelectionModel<Department>(true, []);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.noticeId = +this.route.snapshot.paramMap.get('id');
    this.getNotice();
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

  private getNotice() {
    if (this.loading) {
      return;
    }
    let notice = new Notice();
    notice.id = this.noticeId;
    const url = NoticeManageUrl.URL_NOTICE_INFO;
    this.loading = true;
    this.http.post<Notice>(url, notice)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.notice = data;
        if (!!this.notice) {
          this.getDepartments();
        }
      });
  }

  private getDepartments() {
    if (this.loading) {
      return;
    }
    const url = NoticeManageUrl.URL_NOTICE_DEPARTMENTS;
    this.loading = true;
    this.http.get<Department[]>(url)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.dataSource.data = data;
        if (!!this.notice.departments) {
          this.setSelectDepartments();
        }
      });
  }

  private setSelectDepartments() {
    this.dataSource.data.forEach(item => {
      this.notice.departments.forEach(itemm => {
        if (item.id == itemm.departmentId) {
          this.selection.select(item);
        }
      })
    });
  }

  getHtml(str: string) {
    return str.replace(/\n/g, '<br>');
  }

  goBack() {
    history.back();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
