import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { slideToLeft } from 'src/app/shared/animations';
import { MenuManageUrl } from '../menu-manage-url';
import { Menu } from '../menu-model';

@Component({
  selector: 'app-menu-manage-info',
  templateUrl: './menu-manage-info.component.html',
  styleUrls: ['./menu-manage-info.component.scss'],
  animations: [slideToLeft()]
})
export class MenuManageInfoComponent implements OnInit {

  cols = 3;

  loading = false;
  menuId = 0;
  menu: Menu = null;
  parentId = 0;
  parentMenu: Menu = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private breakpoint: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.initObserve();
    this.menuId = +this.route.snapshot.paramMap.get('id');
    this.getMenu();
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

  private getMenu() {
    if (this.loading) {
      return;
    }
    let menu = new Menu();
    menu.id = this.menuId;
    const url = MenuManageUrl.URL_MENU_INFO;
    this.loading = true;
    this.http.post<Menu>(url, menu)
      .pipe(tap(
        () => this.loading = false,
        () => this.loading = false))
      .subscribe(data => {
        this.menu = data;
        this.parentId = this.menu.parentId;
        if (this.parentId > 0) {
          this.getParentMenu();
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
