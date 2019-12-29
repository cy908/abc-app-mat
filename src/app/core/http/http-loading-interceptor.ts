import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoadingService } from '../loading';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

    constructor(
        private loadingSrv: LoadingService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingSrv.loading(true);
        return next.handle(req).pipe(tap(
            () => this.loadingSrv.loading(false),
            () => this.loadingSrv.loading(false)
        ));
    }

}