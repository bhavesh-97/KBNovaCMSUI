import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Encryption } from '../services/encryption';

// Context token to mark requests for encryption
export const ENCRYPTION_CONTEXT = new HttpContextToken<boolean>(() => false);

export const encryptionInterceptor: HttpInterceptorFn = (req, next) => {
  const encryption = inject(Encryption);
  const encryptPayload = req.context.get(ENCRYPTION_CONTEXT);

  let modifiedReq = req;

  if (encryptPayload) {
    // Add custom header
    modifiedReq = modifiedReq.clone({
      headers: modifiedReq.headers.set('X-Encrypt-Payload', 'true')
    });

    // Encrypt body for POST/PUT/DELETE
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.body) {
      const encrypted = encryption.frontEncryptEncode(JSON.stringify(req.body));
      modifiedReq = modifiedReq.clone({ body: encrypted });
    }
  }

  // Decrypt response
  return next(modifiedReq).pipe(
    map(event => {
      if (encryptPayload && event instanceof HttpResponse) {
        const body = event.body;
        if (typeof body === 'string') {
          try {
            const decrypted = encryption.frontDecryptDecode(body);
            return event.clone({ body: JSON.parse(decrypted) });
          } catch (err) {
            console.error('Decryption failed:', err);
          }
        }
      }
      return event;
    })
  );
};
