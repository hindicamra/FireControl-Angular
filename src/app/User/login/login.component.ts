import { Component } from '@angular/core';
import { Router } from '@angular/router';
import UserLogin from 'src/app/Models/User/UserLogin';
import { UserService } from 'src/app/Services/user.service';
import { ToastrComponent } from 'src/app/shared/toastr/toastr.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  user: UserLogin | undefined;
  admin: string = '';
  adminId: string = '';
  success: boolean = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private toastrComponent: ToastrComponent
  ) {
    let token = window.localStorage.getItem('Token');
    let refreshToken = window.localStorage.getItem('RefreshToken');
    
    if(token!== null && refreshToken !== null){
      userService.refreshToken();
    }
    
    if (token!== null && refreshToken !== null) {
      this.router.navigate(['User/Menu'])
    }
    
  }

  tryLogin() {
    this.userService
      .getByEmailAndPassword(this.email, this.password)
      .subscribe(
        (res: UserLogin) => {
          if (res != null) {
            this.success = true;
            this.user = res;
            window.localStorage.setItem(
              'Token',
              this.user.token
            );
            window.localStorage.setItem(
              'RefreshToken',
              this.user.refreshToken
            );

            this.userService.userInfo().subscribe(
              (data: any) => {
                window.localStorage.setItem(
                  'userInfo',
                  JSON.stringify(data)
                );
              },
              (error) => {
                this.toastrComponent.callTost('Logovani korisnik', 'Ne mogu dohvatiti podatake. '+error.message, 'DANGER');
              }
            );

            this.toastrComponent.callTost(
              'Login',
              'Login je uspjesan.',
              'SUCCESS'
            );
            setTimeout(() => {
              this.router.navigateByUrl('User/Menu');
            }, 3000);
          }
        },
        (error) => {
          if(error.error.title == null)
          {
            this.toastrComponent.callTost('Login', 'API greska. '+error.error, 'DANGER');
          }
          else{
            this.toastrComponent.callTost('Login', 'Neispravan E-mail ili Password. '+error.error.title, 'DANGER');
          }
        },
        () => {
          if (this.success == false) {
            this.toastrComponent.callTost(
              'Login',
              'Pogresan email ili password',
              'DANGER'
            );
          }
        }
      );
  }

}
