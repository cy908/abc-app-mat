import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { MessageService } from 'src/app/core/message';
import { ResultData } from '../../engine-model';
import { DictManageUrl } from '../dict-manage-url';
import { Dict, DictOption } from '../dict-model';

@Component({
  selector: 'app-dict-manage-option-add',
  templateUrl: './dict-manage-option-add.component.html',
  styleUrls: ['./dict-manage-option-add.component.scss'],
  animations: [slideToLeft()]
})
export class DictManageOptionAddComponent implements OnInit {

  cols = 3;

  form: FormGroup;
  loading = false;
  dictId = 0;
  dict: Dict = null;

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
    this.dictId = +this.route.snapshot.paramMap.get('dictId');
    this.getDict();
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
      id: [null, [Validators.required, Validators.maxLength(50)]],
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
    this.saveDictOption();
  }

  private getForm() {
    let dictOption = new DictOption();
    let controls = this.form.controls;
    dictOption.id = controls.id.value;
    dictOption.name = controls.name.value;
    dictOption.code = controls.code.value;
    dictOption.order = controls.order.value;
    dictOption.enable = controls.enable.value;
    dictOption.note = controls.note.value;
    return dictOption;
  }

  private saveDictOption() {
    if (this.loading) {
      return;
    }
    let dictOption = this.getForm();
    dictOption.dictId = this.dictId;
    const url = DictManageUrl.URL_DICT_OPTION_ADD;
    this.loading = true;
    this.http.post<ResultData<any>>(url, dictOption)
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
      });
  }

  goBack() {
    history.back();
  }

}
