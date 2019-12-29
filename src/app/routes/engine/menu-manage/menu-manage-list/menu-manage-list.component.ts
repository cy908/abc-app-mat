import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatTableDataSource, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { slideToTop } from 'src/app/shared/animations';
import { DialogService } from 'src/app/core/dialog';
import { MessageService } from 'src/app/core/message';
import { IconsService } from 'src/app/shared/icons';
import { EngineConfig } from '../../engine-config';
import { PageData, ResultData } from '../../engine-model';
import { MenuManageUrl } from '../menu-manage-url';
import { Menu } from '../menu-model';

@Component({
  selector: 'app-menu-manage-list',
  templateUrl: './menu-manage-list.component.html',
  styleUrls: ['./menu-manage-list.component.scss'],
  animations: [slideToTop()]
})
export class MenuManageListComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<Menu>([]);
  selection = new SelectionModel<Menu>(true, []);
  totalCount: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private messageSrv: MessageService,
    private dialogSrv: DialogService,
    private iconSrv: IconsService,
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
    let menu = new Menu();
    menu.pageIndex = this.pageIndex + 1;
    menu.pageSize = this.pageSize;
    menu.search = this.search;
    const url = MenuManageUrl.URL_MENU_LIST;
    this.loading = true;
    this.http.post<PageData<Menu>>(url, menu)
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

  goIcons() {
    this.iconSrv.icons();
  }

  goInfo(id: number) {
    this.router.navigate([MenuManageUrl.URL_MENU_INFO, id]);
  }

  goAdd(id: number) {
    this.router.navigate([MenuManageUrl.URL_MENU_ADD, id]);
  }

  goEdit(id: number) {
    this.router.navigate([MenuManageUrl.URL_MENU_EDIT, id]);
  }

  goDelete(id: number) {
    if (this.loading) {
      return;
    }
    this.deleteMenu(id);
  }

  private deleteMenu(id: number) {
    let title = '确认删除？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let menu = new Menu();
        menu.id = id;
        const url = MenuManageUrl.URL_MENU_DELETE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, menu)
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
