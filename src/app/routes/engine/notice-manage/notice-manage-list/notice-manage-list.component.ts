import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { slideToTop } from 'src/app/shared/animations';
import { DialogService } from 'src/app/core/dialog';
import { MessageService } from 'src/app/core/message';
import { EngineConfig } from '../../engine-config';
import { PageData, ResultData } from '../../engine-model';
import { Department } from '../../department-manage';
import { NoticeManageUrl } from '../notice-manage-url';
import { Notice } from '../notice-model';

@Component({
  selector: 'app-notice-manage-list',
  templateUrl: './notice-manage-list.component.html',
  styleUrls: ['./notice-manage-list.component.scss'],
  animations: [slideToTop()]
})
export class NoticeManageListComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<Notice>([]);
  selection = new SelectionModel<Notice>(true, []);
  totalCount: number = 0;

  departments: Department[] = null;
  departmentLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private messageSrv: MessageService,
    private dialogSrv: DialogService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.searchData(true);
    this.getDepartments();
  }

  private initForm() {
    this.form = this.fb.group({
      search: [null, [Validators.maxLength(50)]],
      departmentId: [null, []],
    });
  }

  private get search(): string {
    if (this.form.invalid) return null;
    return this.form.controls.search.value;
  }

  private get departmentId(): number {
    if (this.form.invalid) return null;
    return this.form.controls.departmentId.value;
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
    let notice = new Notice();
    notice.pageIndex = this.pageIndex + 1;
    notice.pageSize = this.pageSize;
    notice.search = this.search;
    notice.departmentId = this.departmentId;
    const url = NoticeManageUrl.URL_NOTICE_LIST;
    this.loading = true;
    this.http.post<PageData<Notice>>(url, notice)
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

  private getDepartments() {
    if (this.departmentLoading) {
      return;
    }
    const url = NoticeManageUrl.URL_NOTICE_DEPARTMENTS;
    this.departmentLoading = true;
    this.http.get<Department[]>(url)
      .pipe(tap(
        () => this.departmentLoading = false,
        () => this.departmentLoading = false))
      .subscribe(data => {
        this.departments = data;
      });
  }

  goInfo(id: number) {
    this.router.navigate([NoticeManageUrl.URL_NOTICE_INFO, id]);
  }

  goAdd() {
    this.router.navigate([NoticeManageUrl.URL_NOTICE_ADD]);
  }

  goEdit(id: number) {
    this.router.navigate([NoticeManageUrl.URL_NOTICE_EDIT, id]);
  }

  goDelete(id: number) {
    if (this.loading) {
      return;
    }
    this.deleteNotice(id);
  }

  private deleteNotice(id: number) {
    let title = '确认删除？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let notice = new Notice();
        notice.id = id;
        const url = NoticeManageUrl.URL_NOTICE_DELETE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, notice)
          .pipe(tap(
            () => this.loading = false,
            () => this.loading = false))
          .subscribe(data => {
            if (data.success) {
              this.messageSrv.success('删除成功！');
              this.searchData();
            } else if (data.message) {
              this.messageSrv.warn(data.message);
            } else {
              this.messageSrv.warn('删除失败！');
            }
          });
      }
    });
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
