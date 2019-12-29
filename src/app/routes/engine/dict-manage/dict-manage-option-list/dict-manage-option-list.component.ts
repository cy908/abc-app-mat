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
  selector: 'app-dict-manage-option-list',
  templateUrl: './dict-manage-option-list.component.html',
  styleUrls: ['./dict-manage-option-list.component.scss'],
  animations: [slideToTop()]
})
export class DictManageOptionListComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pageIndex = 0;
  pageSize: number = EngineConfig.PAGE_SIZE;
  pageSizeOptions = EngineConfig.PAGE_SIZE_OPTIONS;
  dataSource = new MatTableDataSource<Dict>([]);
  selection = new SelectionModel<Dict>(true, []);
  totalCount: number = 0;

  dictId = 0;
  dict: Dict = null;

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
    this.dictId = +this.route.snapshot.paramMap.get('dictId');
    this.getDict();
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
    let dictOption = new DictOption();
    dictOption.pageIndex = this.pageIndex + 1;
    dictOption.pageSize = this.pageSize;
    dictOption.dictId = this.dictId;
    dictOption.search = this.search;
    const url = DictManageUrl.URL_DICT_OPTION_LIST;
    this.loading = true;
    this.http.post<PageData<DictOption>>(url, dictOption)
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

  private getDict() {
    if (this.loading) {
      return;
    }
    let dict = new Dict();
    dict.id = this.dictId;
    const url = DictManageUrl.URL_DICT_INFO;
    this.loading = true;
    this.http.post<Dict>(url, dict)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.dict = data;
        if (!!this.dict) {
          this.searchData(true);
        }
      });
  }

  goInfo(id: number) {
    this.router.navigate([DictManageUrl.URL_DICT_OPTION_INFO, this.dictId, id]);
  }

  goAdd() {
    this.router.navigate([DictManageUrl.URL_DICT_OPTION_ADD, this.dictId]);
  }

  goEdit(id: number) {
    this.router.navigate([DictManageUrl.URL_DICT_OPTION_EDIT, this.dictId, id]);
  }

  goDelete(id: number) {
    if (this.loading) {
      return;
    }
    this.deleteDictOption(id);
  }

  private deleteDictOption(id: number) {
    let title = '确认删除？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dictOption = new DictOption();
        dictOption.dictId = this.dictId;
        dictOption.id = id;
        const url = DictManageUrl.URL_DICT_OPTION_DELETE;
        this.loading = true;
        this.http.post<ResultData<any>>(url, dictOption)
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

  goBack() {
    if (!!this.dict) {
      this.router.navigate([DictManageUrl.URL_DICT_LIST, this.dict.type]);
    } else {
      history.back();
    }
  }

}
