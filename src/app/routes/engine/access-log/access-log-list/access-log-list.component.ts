import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { slideToTop } from 'src/app/shared/animations';
import { EngineConfig } from '../../engine-config';
import { PageData } from '../../engine-model';
import { AccessLogUrl } from '../access-log-url';
import { AccessLog } from '../access-log-model';

@Component({
  selector: 'app-access-log-list',
  templateUrl: './access-log-list.component.html',
  styleUrls: ['./access-log-list.component.scss'],
  animations: [slideToTop()]
})
export class AccessLogListComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<AccessLog>([]);
  selection = new SelectionModel<AccessLog>(true, []);
  totalCount: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.initForm();
    this.searchData(true);
  }

  private initForm() {
    this.form = this.fb.group({
      search: [null, [Validators.maxLength(50)]],
      startTime: [null, []],
      endTime: [null, []],
    });
  }

  private get search(): string {
    if (this.form.invalid) return null;
    return this.form.controls.search.value;
  }

  private get startTime(): string {
    if (this.form.invalid) return null;
    const time: Date = this.form.controls.startTime.value;
    if (!!time) {
      time.setHours(0, 0, 0, 0);
      return time.toISOString();
    }
    return null;
  }

  private get endTime(): string {
    if (this.form.invalid) return null;
    const time: Date = this.form.controls.endTime.value;
    if (!!time) {
      time.setHours(0, 0, 0, 0);
      return time.toISOString();
    }
    return null;
  }

  resetForm() {
    let controls = this.form.controls;
    controls.search.setValue(null);
    controls.startTime.setValue(null);
    controls.endTime.setValue(null);
  }

  submitForm(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) return;
    this.searchData(true);
  }

  searchData(reset: boolean = false) {
    if (this.loading) {
      return;
    }
    if (reset) {
      this.pageIndex = 0;
    }
    let accessLog = new AccessLog();
    accessLog.pageIndex = this.pageIndex + 1;
    accessLog.pageSize = this.pageSize;
    accessLog.search = this.search;
    accessLog.startTime = this.startTime;
    accessLog.endTime = this.endTime;
    const url = AccessLogUrl.URL_ACCESS_LOG_LIST;
    this.loading = true;
    this.http.post<PageData<AccessLog>>(url, accessLog)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.dataSource.data = data.data;
        this.totalCount = data.count;
      });
  }

  page(event: PageEvent) {
    if (this.pageSize == event.pageSize) {
      this.pageIndex = event.pageIndex;
      this.searchData();
    } else {
      this.pageIndex = 0;
      this.pageSize = event.pageSize;
      this.searchData(true);
    }
  }

  goStat() {
    this.router.navigate([AccessLogUrl.URL_ACCESS_LOG_STAT]);
  }

  goInfo(id: number) {
    this.router.navigate([AccessLogUrl.URL_ACCESS_LOG_INFO, id]);
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
