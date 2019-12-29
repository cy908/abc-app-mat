import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatDialogRef, MatDialog } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { ConfigService } from 'src/app/core/config';
import { TokenService } from 'src/app/core/token';
import { THEMES, ThemeService } from 'src/app/core/theme';
import { DialogService } from 'src/app/core/dialog';
import { MessageService } from 'src/app/core/message';
import { EngineUrl, ResultData } from 'src/app/routes/engine';
import { UserUrl, User, Password } from 'src/app/routes/engine/user-manage';
import { MenuUrl } from 'src/app/routes/engine/menu-manage';
import { NoticeUrl } from 'src/app/routes/engine/notice-manage';
import { MenuData } from './menu-model';

@Component({
  selector: 'app-layout-default',
  templateUrl: './layout-default.component.html',
  styleUrls: ['./layout-default.component.scss']
})
export class LayoutDefaultComponent implements OnInit {

  @ViewChild('passwordTemplate', { static: true })
  passwordTemplate: TemplateRef<any>;
  private passwordDialog: MatDialogRef<any>;

  sidenavMode = 'side';
  sidenavOpened = true;

  title = '';
  copyright: string;
  currentTime: Date;
  home: MenuData;
  menus: MenuData[] = null;
  user: User = null;
  noticeCount = 0;

  themes = THEMES;

  passwordForm: FormGroup;
  passwordLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
    private dialog: MatDialog,
    private configSrv: ConfigService,
    private tokenSrv: TokenService,
    private themeSrv: ThemeService,
    private dialogSrv: DialogService,
    private messageSrv: MessageService,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.initTime();
    this.initConfig();
    this.initTheme();
    this.initPasswordForm();
    this.getMenus();
    this.getUser();
    this.getNoticeCount();
  }

  private initObserve() {
    this.breakpoint.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((bps) => {
      if (bps.matches) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      }
    });
    this.breakpoint.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((bps) => {
      if (bps.matches) {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
    });
  }

  // 初始化时间
  private initTime() {
    this.currentTime = new Date();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  // 初始化配置
  private initConfig() {
    const config = this.configSrv.getConfig();
    this.title = config.title;
    this.copyright = config.copyright;
  }

  // 初始化主题
  private initTheme() {
    let theme = this.themeSrv.getTheme();
    this.themes.find(item => item.style == theme).checked = true;
  }

  // 设置主题
  setTheme(theme: string) {
    this.themes.forEach(item => item.checked = false);
    this.themes.find(item => item.style == theme).checked = true;
    this.themeSrv.setTheme(theme);
  }

  private getMenus() {
    const url = MenuUrl.URL_MENU_LIST;
    this.http.get<MenuData[]>(url).subscribe(
      data => this.setMenus(data)
    );
  }

  private getUser() {
    const url = UserUrl.URL_USER_INFO;
    this.http.get<User>(url).subscribe(
      data => this.user = data
    );
  }

  private getNoticeCount() {
    const url = NoticeUrl.URL_NOTICE_COUNT;
    this.http.get<number>(url).subscribe(
      data => this.noticeCount = data
    );
  }

  private setMenus(menus: MenuData[]) {
    if (!!menus && menus.length > 0) {
      let item = menus[0];
      let open: MenuData = null;
      if (!!item.url) {
        this.home = item;
        menus.splice(0, 1);
        this.menus = menus;
        open = item;
      } else {
        this.home = null;
        this.menus = menus;
        // if (!!item.children && item.children.length > 0) {
        //   open = item.children[0];
        // }
      }
      if (open) {
        if (window.location.href.endsWith('/')) {
          this.openMenu(open);
        }
      }
    }
  }

  goMain() {
    const url = EngineUrl.URL_MAIN;
    this.router.navigate([url]);
  }

  goNotice() {
    const url = NoticeUrl.URL_NOTICE;
    this.router.navigate([url]);
  }

  goUser() {
    const url = UserUrl.URL_USER;
    this.router.navigate([url]);
  }

  openMenu(menu: MenuData) {
    if (!!menu.url) {
      this.router.navigate([menu.url]);
      if (this.sidenavMode == 'over') {
        this.sidenavOpened = false;
      }
    }
  }

  // 退出App
  exitApp() {
    let title = '确认退出？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tokenSrv.clearToken();
        this.router.navigate([EngineUrl.URL_LOGIN]);
      }
    });
  }

  // #region 修改密码

  editPassword() {
    this.passwordDialog = this.dialog.open(this.passwordTemplate, {
      minWidth: 300,
      minHeight: 150,
    });
  }

  private newPasswordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value === this.passwordForm.controls.oldPassword.value) {
      return { error: true, newPassword: true };
    }
    return {};
  };

  private confirmPasswordValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.passwordForm.controls.newPassword.value) {
      return { error: true, confirmPassword: true };
    }
    return {};
  };

  validateNewPassword() {
    setTimeout(() => this.passwordForm.controls.newPassword.updateValueAndValidity());
  }

  validateConfirmPassword() {
    setTimeout(() => this.passwordForm.controls.confirmPassword.updateValueAndValidity());
  }

  private initPasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: [null, [Validators.required, Validators.maxLength(50)]],
      newPassword: [null, [Validators.required, Validators.maxLength(50), this.newPasswordValidator]],
      confirmPassword: [null, [Validators.required, Validators.maxLength(50), this.confirmPasswordValidator]],
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
    password.old = controls.oldPassword.value;
    password.now = controls.newPassword.value;
    return password;
  }

  private savePassword() {
    if (this.passwordLoading) {
      return;
    }
    let password = this.getPasswordForm();
    password.id = this.user.id;
    const title = '确认修改？';
    const dialogRef = this.dialogSrv.confirm(title);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const url = UserUrl.URL_USER_EDIT_PASSWORD;
        this.passwordLoading = true;
        this.http.post<ResultData<any>>(url, password)
          .pipe(tap(
            () => this.passwordLoading = false,
            () => this.passwordLoading = false))
          .subscribe(data => {
            if (data.success) {
              this.messageSrv.success('修改成功！');
              this.passwordDialog.close(true);
              this.passwordForm.reset();
            } else if (data.message) {
              this.messageSrv.warn(data.message);
            } else {
              this.messageSrv.warn('修改失败！');
            }
          });
      }
    });
  }

  // #endregion

}
