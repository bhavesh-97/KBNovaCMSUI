import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    public loaderService = inject(LoaderService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //  Skip loader for specific endpoints if needed
    if (req.headers.has('X-No-Loader')) {
      return next.handle(req);
    }

    this.loaderService.startRequest();

    return next.handle(req).pipe(
      finalize(() => this.loaderService.endRequest())
    );
  }
}
