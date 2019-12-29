import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { STARTUP_PROVIDES } from './core/config';
import { HTTP_PROVIDERS } from './core/http';

import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { RoutesModule } from './routes';
import { LayoutModule } from './layout';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    RoutesModule,
    LayoutModule,
  ],
  providers: [
    ...STARTUP_PROVIDES,
    ...HTTP_PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
