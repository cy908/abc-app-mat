import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { ConfigService } from 'src/app/core/config';
import { TokenService } from 'src/app/core/token';
import { MessageService } from 'src/app/core/message';
import { slideToBottom } from 'src/app/shared/animations';
import { EngineUrl } from '../engine';
import { LoginRequest, LoginResponse } from './login-model';
import { LoginUrl } from './login-url';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideToBottom()]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;

  title = '';
  copyright: string;
  currentTime: Date;
  timeIntervalId: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private configSrv: ConfigService,
    private tokenSrv: TokenService,
    private messageSrv: MessageService,
  ) { }

  ngOnInit() {
    this.initTime();
    this.initConfig();
    this.initForm();
  }

  // 初始化时间
  private initTime() {
    this.currentTime = new Date();
    this.timeIntervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  // 初始化配置
  private initConfig() {
    const config = this.configSrv.getConfig();
    this.title = config.title;
    this.copyright = config.copyright;
  }

  private initForm() {
    this.form = this.fb.group({
      username: [null, [Validators.required, Validators.maxLength(50)]],
      password: [null, [Validators.required, Validators.maxLength(50)]],
    });
  }

  submitForm(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) return;
    this.login();
  }

  private getForm() {
    let body = new LoginRequest();;
    body.username = this.form.controls.username.value;
    body.password = this.form.controls.password.value;
    return body;
  }

  private login() {
    let body = this.getForm();
    const url = LoginUrl.URL_LOGIN;
    this.loading = true;
    this.http.post<LoginResponse>(url, body)
      .pipe(tap(() => this.loading = false, () => this.loading = false))
      .subscribe(data => {
        this.tokenSrv.setToken(data.token);
        this.router.navigate([EngineUrl.URL_MAIN]);
        this.messageSrv.success('登录成功！');
      });
  }

}
