import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MUserLogin } from '../../models/MUserLogin.js';
import { Observable } from 'rxjs/internal/Observable';
import { JsonResponseModel } from '../../models/JsonResponseModel';
import { ENCRYPTION_CONTEXT } from '../../interceptors/encryption-interceptor';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private http = inject(HttpClient);
    private baseUrl = environment.CMSUrl;

//     GetUserLogin(loginModel: MUserLogin,encryptPayload = false): Observable<JsonResponseModel> {
//       debugger
// //         const params = new HttpParams().set('jsonString', JSON.stringify(loginModel));
//            const params = new HttpParams({ fromObject: loginModel as any });
//         return this.http.get<JsonResponseModel>(`${this.baseUrl}/Login/Login`, { params, context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) });
//     }
      GetUserLogin(loginModel: MUserLogin, encryptPayload = false): Observable<JsonResponseModel> {
        return this.http.post<JsonResponseModel>(`${this.baseUrl}/Login/Login`,loginModel,                    
                                                      { context: new HttpContext().set(ENCRYPTION_CONTEXT, encryptPayload) }
            );
      }

    // Generic POST
    post<T>(body: any, encryptPayload = false): Observable<T> {
      return this.http.post<T>(`${this.baseUrl}/Login/Login`, body);
    }

    // Generic PUT
    put<T>(body: any): Observable<T> {
      return this.http.put<T>(`${this.baseUrl}/Login/Login`, body);
    }

    // Generic DELETE
    delete<T>(params?: any): Observable<T> {
      return this.http.delete<T>(`${this.baseUrl}/Login/Login`, { params });
    }
}
