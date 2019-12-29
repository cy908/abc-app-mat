import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { DictManageUrl } from '../dict-manage-url';
import { Dict, DictOption } from '../dict-model';

@Component({
  selector: 'app-dict-manage-list',
  templateUrl: './dict-manage-list.component.html',
  styleUrls: ['./dict-manage-list.component.scss'],
  animations: [slideToTop()]
})
export class DictManageListComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<Dict>([]);
  selection = new SelectionModel<Dict>(true, []);
  totalCount: number = 0;

  dictTypeId = 0;
  dictTypes: DictOption[] = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogSrv: DialogService,
    private messageSrv: MessageService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.dictTypeId = +this.route.snapshot.paramMap.get('type');
    this.getDictTypes();
  }

  private initForm() {
    this.form = this.fb.group({
      dictType: [null, [Validators.required]],
      search: [null, [Validators.maxLength(50)]],
    });
  }

  private getDictType(): number {
    if (this.form.invalid) return null;
    return this.form.controls.dictType.value;
  }

  private setDictType(dictType: number): void {
    this.form.controls.dictType.setValue(dictType);
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
    let dict = new Dict();
    dict.pageIndex = this.pageIndex + 1;
    dict.pageSize = this.pageSize;
    dict.type = this.getDictType();
    dict.search = this.search;
    const url = DictManageUrl.URL_DICT_LIST;
    this.loading = true;
    this.http.post<PageData<Dict>>(url, dict)
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

  private getDictTypes() {
    if (this.loading) {
      return;
    }
    const url = DictManageUrl.URL_DICT_TYPES;
    this.loading = true;
    this.http.get<DictOption[]>(url)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.dictTypes = data;
        if (this.dictTypes && this.dictTypes.length > 0) {
          if (this.dictTypeId > 0) {
            this.setDictType(this.dictTypeId);
          } else {
            this.setDictType(this.dictTypes[0].id);
          }
          this.searchData(true);
        }
      });
  }

  goDictOption(id: number) {
    this.router.navigate([DictManageUrl.URL_DICT_OPTION_LIST, id]);
  }

  goInfo(id: number) {
    this.router.navigate([DictManageUrl.URL_DICT_INFO, id]);
  }

  goAdd() {
    this.router.navigate([DictManageUrl.URL_DICT_ADD, this.getDictType()]);
  }

  goEdit(id: number) {
    this.router.navigate([DictManageUrl.URL_DICT_EDIT, id]);
  }

  goDelete(id: number) {
    if (this.loading) {
      return;
    }
    this.deleteDict(id);
  }

  private deleteDict(id: number) {
    let title = '确认删除？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dict = new Dict();
        dict.id = id;
        const url = DictManageUrl.URL_DICT_DELETE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, dict)
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
