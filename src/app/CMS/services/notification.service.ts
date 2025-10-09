import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastr = inject(ToastrService);
  
  showMessage(message: string, title: string, status: string) {
    switch (status) {
      case 'success':
        this.toastr.success(message, title, { closeButton: true, progressBar: true });
        break;
      case 'error':
        this.toastr.error(message, title, { closeButton: true, progressBar: true });
        break;
      case 'warning':
        this.toastr.warning(message, title, { closeButton: true, progressBar: true });
        break;
      case 'info':
        this.toastr.info(message, title, { closeButton: true, progressBar: true });
        break;
      default:
        this.toastr.show(message, title, { closeButton: true, progressBar: true });
        break;
    }
}
}