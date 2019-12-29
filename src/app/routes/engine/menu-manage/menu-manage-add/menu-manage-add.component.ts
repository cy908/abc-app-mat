import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { MessageService } from 'src/app/core/message';
import { ResultData } from '../../engine-model';
import { MenuManageUrl } from '../menu-manage-url';
import { Menu } from '../menu-model';

@Component({
  selector: 'app-menu-manage-add',
  templateUrl: './menu-manage-add.component.html',
  styleUrls: ['./menu-manage-add.component.scss'],
  animations: [slideToLeft()]
})
export class MenuManageAddComponent implements OnInit {

  cols = 3;

  form: FormGroup;
  loading = false;
  parentId = 0;
  parentMenu: Menu = null;

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
    this.parentId = +this.route.snapshot.paramMap.get('id');
    if (this.parentId > 0) {
      this.getParentMenu();
    }
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
      url: [null, [Validators.maxLength(50)]],
      matIcon: [null, [Validators.maxLength(50)]],
      antdIcon: [null, [Validators.maxLength(50)]],
      antdIconTheme: [null, [Validators.maxLength(50)]],
      antdIconTwotone: [null, [Validators.maxLength(50)]],
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
    this.saveMenu();
  }

  private getForm() {
    let menu = new Menu();
    let controls = this.form.controls;
    menu.name = controls.name.value;
    menu.url = controls.url.value;
    menu.matIcon = controls.matIcon.value;
    menu.antdIcon = controls.antdIcon.value;
    menu.antdIconTheme = controls.antdIconTheme.value;
    menu.antdIconTwotone = controls.antdIconTwotone.value;
    menu.enable = controls.enable.value;
    menu.note = controls.note.value;
    return menu;
  }

  private saveMenu() {
    if (this.loading) {
      return;
    }
    let menu = this.getForm();
    menu.parentId = this.parentId;
    const url = MenuManageUrl.URL_MENU_ADD;
    this.loading = true;
    this.http.post<ResultData<any>>(url, menu)
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

  private getParentMenu() {
    if (this.loading) {
      return;
    }
    let menu = new Menu();
    menu.id = this.parentId;
    const url = MenuManageUrl.URL_MENU_INFO;
    this.loading = true;
    this.http.post<Menu>(url, menu)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.parentMenu = data;
      });
  }

  goBack() {
    history.back();
  }

}
