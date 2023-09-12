import { Component } from '@angular/core';
import { ToastrComponent } from './shared/toastr/toastr.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Example add toast
  // constructor(private toastrComponent: ToastrComponent) {
  //   this.toastrComponent.callTost(
  //     'Admin',
  //     'Dodavanje je uspjesno.',
  //     'SUCCESS'
  //   );
  // }
}
