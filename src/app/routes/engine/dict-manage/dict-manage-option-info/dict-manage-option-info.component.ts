import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { DictManageUrl } from '../dict-manage-url';
import { Dict, DictOption } from '../dict-model';

@Component({
  selector: 'app-dict-manage-option-info',
  templateUrl: './dict-manage-option-info.component.html',
  styleUrls: ['./dict-manage-option-info.component.scss'],
  animations: [slideToLeft()]
})
export class DictManageOptionInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  dictId = 0;
  id = 0;
  dictOption: DictOption = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.dictId = +this.route.snapshot.paramMap.get('dictId');
    this.id = +this.route.snapshot.paramMap.get('id');
    this.getDictOption();
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

  private getDictOption() {
    if (this.loading) {
      return;
    }
    let dictOption = new DictOption();
    dictOption.dictId = this.dictId;
    dictOption.id = this.id;
    const url = DictManageUrl.URL_DICT_OPTION_INFO;
    this.loading = true;
    this.http.post<Dict>(url, dictOption)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.dictOption = data;
      });
  }

  goBack() {
    history.back();
  }

}
