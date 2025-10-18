import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PopupMessageType } from '../models/PopupMessageType';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastr = inject(ToastrService);
  
 showMessage(message: string, title: string, type: PopupMessageType) {
    const statusMap: { [key in PopupMessageType]: string } = {
      [PopupMessageType.Success]: 'success',
      [PopupMessageType.Error]: 'error',
      [PopupMessageType.Info]: 'info',
      [PopupMessageType.Warning]: 'warning'
    };

    const status = statusMap[type] || 'info';
    const config = status === 'error'
      ? { timeOut: 3000, extendedTimeOut: 0, closeButton: true, tapToDismiss: false, positionClass: 'toast-top-right', preventDuplicates: true }
      : { timeOut: 3000, closeButton: true, positionClass: 'toast-top-right', preventDuplicates: true };

    this.toastr.show(message, title, config, `toast-${status}`);
  }
}