import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { DictManageUrl } from '../dict-manage-url';
import { Dict, DictOption } from '../dict-model';

@Component({
  selector: 'app-dict-manage-info',
  templateUrl: './dict-manage-info.component.html',
  styleUrls: ['./dict-manage-info.component.scss'],
  animations: [slideToLeft()]
})
export class DictManageInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  dictId = 0;
  dict: Dict = null;
  dictType: DictOption = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.dictId = +this.route.snapshot.paramMap.get('id');
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
          this.getDictType();
        }
      });
  }

  private getDictType() {
    if (this.loading) {
      return;
    }
    let dictOption = new DictOption();
    dictOption.id = this.dict.type;
    const url = DictManageUrl.URL_DICT_TYPE;
    this.loading = true;
    this.http.post<DictOption>(url, dictOption)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.dictType = data;
      });
  }

  goBack() {
    if (!!this.dict) {
      this.router.navigate([DictManageUrl.URL_DICT_LIST, this.dict.type]);
    } else {
      history.back();
    }
  }

}
