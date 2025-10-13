import { inject, Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Encryption } from '../services/encryption'; // Adjust path if needed

@Injectable()
export class encryptionInterceptor implements HttpInterceptor {
  public encryption = inject(Encryption);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedReq = req;

    //  Encrypt request body (if exists)
    if (req.body) {
      try {
        const encryptedPayload = this.encryption.frontEncryptEncode(JSON.stringify(req.body));
        modifiedReq = req.clone({ body: { payload: encryptedPayload } });
      } catch (err) {
        console.error('Encryption failed:', err);
      }
    }

    //  Decrypt response payload
    return next.handle(modifiedReq).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body?.payload) {
          try {
            const decryptedJson = this.encryption.frontDecryptDecode(event.body.payload);
            const decryptedData = JSON.parse(decryptedJson);
            return event.clone({ body: decryptedData });
          } catch (err) {
            console.error('Decryption failed:', err);
          }
        }
        return event;
      })
    );
  }
}
