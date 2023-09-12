import { Component } from '@angular/core';
import UserInfo from 'src/app/Models/User/UserInfo';
import { UserService } from 'src/app/Services/user.service';
import { ToastrComponent } from '../toastr/toastr.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  user: UserInfo = new UserInfo();
  type1: string = '';
  type2: string = '';
  type3: string = '';
  constructor(private userService: UserService, private toastrComponent: ToastrComponent) {
    //this.userService.refreshToken();

    this.userService.userInfo().subscribe(
      (data: any) => {
        window.localStorage.setItem(
          'userInfo',
          JSON.stringify(data)
        );
        this.user = data;
        this.user.roles.forEach(role => {
          if(role=='Type1'){this.type1="Type1"}
          if(role=='Type2'){this.type2="Type2"}
          if(role=='Type3'){this.type3="Type3"}
        }); 
      },
      (error) => {
        this.toastrComponent.callTost('Logovani korisnik', 'Ne mogu dohvatiti podatake. '+error.message, 'DANGER');
      }
    );
  }

  LogOut(){
    this.userService.LogOut();
  }
}
