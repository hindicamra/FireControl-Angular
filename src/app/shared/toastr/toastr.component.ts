import { Component, Injectable, OnInit } from '@angular/core';

import { DialogLayoutDisplay, ToastNotificationInitializer } from '@costlydeveloper/ngx-awesome-popup';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.css']
})
export class ToastrComponent {
  constructor() {}

  callTost(title: string, message: string, type: string) {
    this.toastNotification(title, message, type); // open toast message!
  }

  // Create the method
  toastNotification(title: string, message: string, type: string) {
    const newToastNotification = new ToastNotificationInitializer();
    newToastNotification.setTitle(title);
    newToastNotification.setMessage(message);

    // Choose layout color type
    switch (type) {
      case 'SUCCESS':
        newToastNotification.setConfig({
          layoutType: DialogLayoutDisplay.SUCCESS, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        break;

      case 'INFO':
        newToastNotification.setConfig({
          layoutType: DialogLayoutDisplay.INFO, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        break;

      case 'NONE':
        newToastNotification.setConfig({
          layoutType: DialogLayoutDisplay.NONE, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        break;

      case 'DANGER':
        newToastNotification.setConfig({
          layoutType: DialogLayoutDisplay.DANGER, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        break;

      case 'WARNING':
        newToastNotification.setConfig({
          layoutType: DialogLayoutDisplay.WARNING, // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        break;
    }

    // Simply open the toast
    newToastNotification.openToastNotification$();
  }
}
