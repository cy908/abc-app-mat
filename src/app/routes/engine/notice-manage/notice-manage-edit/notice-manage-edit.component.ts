import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-notice-manage-edit',
  templateUrl: './notice-manage-edit.component.html',
  styleUrls: ['./notice-manage-edit.component.scss'],
  animations: [slideToLeft()]
})
export class NoticeManageEditComponent implements OnInit {

  cols = 3;

  form: FormGroup;
  loading = false;
  noticeId = 0;
  notice: Notice = null;
  dataSource = new MatTableDataSource<Department>([]);
  selection = new SelectionModel<Department>(true, []);

  titleLength = 100;
  contentLength = 500;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
    private messageSrv: MessageService,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.initForm();
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

  private initForm() {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(this.titleLength)]],
      content: [null, [Validators.required, Validators.maxLength(this.contentLength)]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      enable: [true, []],
    });
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
        departments.push(new NoticeDepartment(this.noticeId, item.id));
      }
    });
    return departments;
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

  private setForm() {
    let controls = this.form.controls;
    controls.title.setValue(this.notice.title);
    controls.content.setValue(this.notice.content);
    const start = this.notice.startTime;
    if (!!start) {
      controls.startTime.setValue(new Date(start));
    } else {
      controls.startTime.setValue(null);
    }
    const end = this.notice.endTime;
    if (!!end) {
      controls.endTime.setValue(new Date(end));
    } else {
      controls.endTime.setValue(null);
    }
    controls.enable.setValue(this.notice.enable);
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
    notice.id = this.noticeId;
    notice.departments = departments;
    const url = NoticeManageUrl.URL_NOTICE_EDIT;
    this.loading = true;
    this.http.post<ResultData<any>>(url, notice)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        if (data.success) {
          this.messageSrv.success('保存成功！');
          this.goBack();
        } else if (data.message) {
          this.messageSrv.warn(data.message);
        } else {
          this.messageSrv.warn('保存失败！');
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
          this.setForm();
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
