import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatTableDataSource, PageEvent, MatDialogRef, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { slideToTop } from 'src/app/shared/animations';
import { DialogService } from 'src/app/core/dialog';
import { MessageService } from 'src/app/core/message';
import { EngineConfig } from '../../engine-config';
import { PageData, ResultData } from '../../engine-model';
import { Department } from '../../department-manage';
import { UserManageUrl } from '../user-manage-url';
import { User, Password } from '../user-model';

@Component({
  selector: 'app-user-manage-list',
  templateUrl: './user-manage-list.component.html',
  styleUrls: ['./user-manage-list.component.scss'],
  animations: [slideToTop()]
})
export class UserManageListComponent implements OnInit {

  @ViewChild('resetTemplate', { static: true })
  resetTemplate: TemplateRef<any>;

  private resetDialog: MatDialogRef<any>;

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);
  totalCount: number = 0;

  departments: Department[] = null;
  departmentLoading = false;

  passwordForm: FormGroup;
  passwordLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private messageSrv: MessageService,
    private dialogSrv: DialogService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.initPasswordForm();
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
    let user = new User();
    user.pageIndex = this.pageIndex + 1;
    user.pageSize = this.pageSize;
    user.search = this.search;
    user.departmentId = this.departmentId;
    const url = UserManageUrl.URL_USER_LIST;
    this.loading = true;
    this.http.post<PageData<User>>(url, user)
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
    const url = UserManageUrl.URL_USER_DEPARTMENTS;
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
    this.router.navigate([UserManageUrl.URL_USER_INFO, id]);
  }

  goAdd() {
    this.router.navigate([UserManageUrl.URL_USER_ADD]);
  }

  goEdit(id: number) {
    this.router.navigate([UserManageUrl.URL_USER_EDIT, id]);
  }

  goDelete(id: number) {
    if (this.loading) {
      return;
    }
    this.deleteUser(id);
  }

  private deleteUser(id: number) {
    let title = '确认删除？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let user = new User();
        user.id = id;
        const url = UserManageUrl.URL_USER_DELETE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, user)
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

  //#region 重置密码

  private getSelectUserIds() {
    let ids: number[] = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        ids.push(row.id);
      }
    });
    return ids;
  }

  goPassword() {
    const ids = this.getSelectUserIds();
    if (ids == null || ids.length <= 0) {
      this.messageSrv.warn('请选择需要重置密码的用户！');
      return;
    }
    this.resetDialog = this.dialog.open(this.resetTemplate, {
      minWidth: 300,
      minHeight: 150,
    });
  }

  private initPasswordForm() {
    this.passwordForm = this.fb.group({
      newPassword: [null, [Validators.required, Validators.maxLength(50)]],
    });
  }

  submitPasswordForm(): void {
    Object.keys(this.passwordForm.controls).forEach(key => {
      this.passwordForm.controls[key].markAsDirty();
      this.passwordForm.controls[key].updateValueAndValidity();
    });
    if (this.passwordForm.invalid) return;
    this.savePassword();
  }

  private getPasswordForm() {
    let password = new Password();
    let controls = this.passwordForm.controls;
    password.now = controls.newPassword.value;
    return password;
  }

  private savePassword() {
    if (this.passwordLoading) {
      return;
    }
    const ids = this.getSelectUserIds();
    let password = this.getPasswordForm();
    if (ids.length == 1) {
      password.id = ids[0];
    } else {
      password.ids = ids;
    }
    const url = UserManageUrl.URL_USER_RESET_PASSWORD;
    this.passwordLoading = true;
    this.http.post<ResultData<any>>(url, password)
      .pipe(tap(
        () => this.passwordLoading = false,
        () => this.passwordLoading = false))
      .subscribe(data => {
        if (data.success) {
          this.messageSrv.success('重置成功！');
          this.resetDialog.close(true);
        } else if (data.message) {
          this.messageSrv.warn(data.message);
        } else {
          this.messageSrv.warn('重置失败！');
        }
      });
  }

  //#endregion

}
