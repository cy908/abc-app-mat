import { Injectable } from '@angular/core';

import { StoreService } from '../store';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'THEME';
  private readonly THEME_DEFAULT = 'indigo-pink';

  constructor(
    private storeSrv: StoreService,
  ) { }

  /** 初始化主题 */
  initTheme() {
    const _theme = this.getTheme() || this.THEME_DEFAULT;
    this.setTheme(_theme);
  }

  /** 获取主题 */
  getTheme(): string {
    return this.storeSrv.getItem(this.THEME_KEY);
  }

  /** 设置主题 */
  setTheme(theme: string) {
    const _theme = this.getTheme();
    if (document.body.classList.contains(_theme)) {
      document.body.classList.remove(_theme);
    }
    document.body.classList.add(theme);
    this.storeSrv.setItem(this.THEME_KEY, theme);
  }

}
