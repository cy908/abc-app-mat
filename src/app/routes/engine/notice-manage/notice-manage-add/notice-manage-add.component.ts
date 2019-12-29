import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { slideToLeft } from 'src/app/shared/animations';
import { MessageService } from 'src/app/core/message';
import { ResultData } from '../../engine-model';
import { Department } from '../../department-manage';
import { NoticeManageUrl } from '../notice-manage-url';
import { Notice, NoticeDepartment } from '../notice-model';

@Component({
  selector: 'app-notice-manage-add',
  templateUrl: './notice-manage-add.component.html',
  styleUrls: ['./notice-manage-add.component.scss'],
  animations: [slideToLeft()]
})
export class NoticeManageAddComponent implements OnInit {

  cols = 3;

  form: FormGroup;
  loading = false;
  dataSource = new MatTableDataSource<Department>([]);
  selection = new SelectionModel<Department>(true, []);

  titleLength = 100;
  contentLength = 500;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
    private messageSrv: MessageService,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.initForm();
    this.getDepartments();
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

  private initForm() {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(this.titleLength)]],
      content: [null, [Validators.required, Validators.maxLength(this.contentLength)]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      enable: [true, []],
      keepOn: [true, []],
    });
  }

  private get keepOn(): boolean {
    return this.form.controls.keepOn.value;
  }

  submitForm(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) return;
    this.saveNotice();
  }

  private getSelectDepartments() {
    let departments: NoticeDepartment[] = [];
    this.dataSource.data.forEach(item => {
      if (this.selection.isSelected(item)) {
        departments.push(new NoticeDepartment(undefined, item.id));
      }
    });
    return departments;
  }

  private getForm() {
    let notice = new Notice();
    let controls = this.form.controls;
    notice.title = controls.title.value;
    notice.content = controls.content.value;
    const startTime: Date = controls.startTime.value;
    if (!!startTime) {
      startTime.setHours(0, 0, 0, 0);
      notice.startTime = startTime.toISOString();
    } else {
      notice.startTime = null;
    }
    const endTime: Date = controls.endTime.value;
    if (!!endTime) {
      endTime.setHours(0, 0, 0, 0);
      notice.endTime = endTime.toISOString();
    } else {
      notice.endTime = null;
    }
    notice.enable = controls.enable.value;
    return notice;
  }

  private saveNotice() {
    if (this.loading) {
      return;
    }
    const departments = this.getSelectDepartments();
    if (departments.length == 0) {
      this.messageSrv.warn('请选择部门！');
      return;
    }
    let notice = this.getForm();
    notice.departments = departments;
    const url = NoticeManageUrl.URL_NOTICE_ADD;
    this.loading = true;
    this.http.post<ResultData<any>>(url, notice)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        if (data.success) {
          this.messageSrv.success('保存成功！');
          if (!this.keepOn) {
            this.goBack();
          }
        } else if (data.message) {
          this.messageSrv.warn(data.message);
        } else {
          this.messageSrv.warn('保存失败！');
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
      });
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
