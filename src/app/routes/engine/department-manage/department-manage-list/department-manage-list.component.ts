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
import { DepartmentManageUrl } from '../department-manage-url';
import { Department } from '../department-model';

@Component({
  selector: 'app-department-manage-list',
  templateUrl: './department-manage-list.component.html',
  styleUrls: ['./department-manage-list.component.scss'],
  animations: [slideToTop()]
})
export class DepartmentManageListComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<Department>([]);
  selection = new SelectionModel<Department>(true, []);
  totalCount: number = 0;

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
  }

  private initForm() {
    this.form = this.fb.group({
      search: [null, [Validators.maxLength(50)]],
    });
  }

  private get search(): string {
    if (this.form.invalid) return null;
    return this.form.controls.search.value;
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
    let department = new Department();
    department.pageIndex = this.pageIndex + 1;
    department.pageSize = this.pageSize;
    department.search = this.search;
    const url = DepartmentManageUrl.URL_DEPARTMENT_LIST;
    this.loading = true;
    this.http.post<PageData<Department>>(url, department)
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

  goInfo(id: number) {
    this.router.navigate([DepartmentManageUrl.URL_DEPARTMENT_INFO, id]);
  }

  goAdd(id: number) {
    this.router.navigate([DepartmentManageUrl.URL_DEPARTMENT_ADD, id]);
  }

  goEdit(id: number) {
    this.router.navigate([DepartmentManageUrl.URL_DEPARTMENT_EDIT, id]);
  }

  goDelete(id: number) {
    if (this.loading) {
      return;
    }
    this.deleteDepartment(id);
  }

  private deleteDepartment(id: number) {
    let title = '确认删除？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let department = new Department();
        department.id = id;
        const url = DepartmentManageUrl.URL_DEPARTMENT_DELETE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, department)
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
