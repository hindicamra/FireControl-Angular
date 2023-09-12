import { Component } from '@angular/core';
import { Router } from '@angular/router';
import UserInfo from 'src/app/Models/User/UserInfo';
import { UserService } from 'src/app/Services/user.service';
import { ToastrComponent } from 'src/app/shared/toastr/toastr.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
constructor(private toastrComponent: ToastrComponent, private router: Router, private userService: UserService) {
  //Role actions START
  const storedArray :string = localStorage.getItem('userInfo') || '';
  const myParsedArray: UserInfo = JSON.parse(storedArray);

  var RoleOk: boolean = false;
  myParsedArray.roles.forEach(role => {
    if(role == 'Type1' || role == 'Type2' || role == 'Type3'){RoleOk=true;}
  });
  if(!RoleOk){
    this.toastrComponent.callTost('Administracija', 'Nemate pristup.', 'DANGER');
    this.userService.LogOut();
  }
  //Role actions END
}
}
