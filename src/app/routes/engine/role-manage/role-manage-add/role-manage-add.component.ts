import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { MessageService } from 'src/app/core/message';
import { ResultData } from '../../engine-model';
import { RoleManageUrl } from '../role-manage-url';
import { Role } from '../role-model';

@Component({
  selector: 'app-role-manage-add',
  templateUrl: './role-manage-add.component.html',
  styleUrls: ['./role-manage-add.component.scss'],
  animations: [slideToLeft()]
})
export class RoleManageAddComponent implements OnInit {

  cols = 3;

  form: FormGroup;
  loading = false;

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
      name: [null, [Validators.required, Validators.maxLength(50)]],
      code: [null, [Validators.maxLength(50)]],
      order: [null, [Validators.maxLength(50)]],
      enable: [true, []],
      note: [null, [Validators.maxLength(100)]],
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
    this.saveRole();
  }

  private getForm() {
    let role = new Role();
    let controls = this.form.controls;
    role.name = controls.name.value;
    role.code = controls.code.value;
    role.order = controls.order.value;
    role.enable = controls.enable.value;
    role.note = controls.note.value;
    return role;
  }

  private saveRole() {
    if (this.loading) {
      return;
    }
    let role = this.getForm();
    const url = RoleManageUrl.URL_ROLE_ADD;
    this.loading = true;
    this.http.post<ResultData<any>>(url, role)
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

  goBack() {
    history.back();
  }

}
