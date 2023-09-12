import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import UserLogin from '../Models/User/UserLogin';
import NewUser from '../Models/User/NewUser';
import { ToastrComponent } from '../shared/toastr/toastr.component';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uri = 'http://localhost:33764/api/Identity';
  private user: UserLogin | undefined;
  constructor(private http: HttpClient, private toastrComponent: ToastrComponent, private router: Router) {}
  // get() {
  //   return this.http.get(`${this.uri}`);
  // }
  getByEmailAndPassword(email: string, password: string) {
    var login =
    {
      "Username": email,
      "Password": password,
      "RememberMe": true
    };
    return this.http.post<UserLogin>(`${this.uri}`, login);
  }
  getAll() {
    let token = this.AutoRefreshToken();
    if(token == null) {this.router.navigate(['User/Login'])}

    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(`${this.uri}`+'/users', { headers: reqHeader });
  }
  insert(user: NewUser) {
    let token = this.AutoRefreshToken();
    if(token == null) {this.router.navigate(['User/Login'])}

    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(`${this.uri}`+'/signup', user, { headers: reqHeader });
  }
  delete(id: string) {
    let token = this.AutoRefreshToken();
    if(token == null) {this.router.navigate(['User/Login'])}

    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete(`${this.uri}/${id}`, { headers: reqHeader });
  }

  refreshToken() {
    if(localStorage.getItem('Token') == null || localStorage.getItem('RefreshToken') == null) {
      this.router.navigate(['User/Login'])
    }

    var AccessRefreshToken =
    {
      "AccessToken": localStorage.getItem('Token'),
      "RefreshToken": localStorage.getItem('RefreshToken')
    };
    this.http.post<UserLogin>(`${this.uri}`+'/refresh-token', AccessRefreshToken).subscribe(
        (res: UserLogin) => {
          if (res != null) {
            this.user = res;
            window.localStorage.setItem(
              'Token',
              res.token
            );
            window.localStorage.setItem(
              'RefreshToken',
              res.refreshToken
            );
          }
          //in else is status code 200 and all is ok
          // else
          //   this.toastrComponent.callTost('Refresh token', 'Novi token nije vratio vrijednosti', 'DANGER');
        },
        (error) => {
          localStorage.removeItem('Token');
          localStorage.removeItem('RefreshToken');
          this.router.navigate(['User/Login'])
          this.toastrComponent.callTost('Refresh token', 'API greska: '+error.message+' - '+error.status+' -'+error.body, 'DANGER');
          console.log('Refresh token'+' API greska: '+error.message+' - '+error.status);
        }
    );
  
  }
  refreshToken2() {
    if(localStorage.getItem('Token') == null || localStorage.getItem('RefreshToken') == null) {
      this.router.navigate(['User/Login'])
    }

    var AccessRefreshToken =
    {
      "AccessToken": localStorage.getItem('Token'),
      "RefreshToken": localStorage.getItem('RefreshToken')
    };
    this.http.post<UserLogin>(`${this.uri}`+'/refresh-token', AccessRefreshToken).pipe(tap(res =>
      {
        console.log('Novi token: '+res.token);
        window.localStorage.setItem('Token', res.token );
        window.localStorage.setItem('RefreshToken', res.refreshToken );
        return res.token;
      })
    );
  
  }
  refreshToken3() {
    let token = localStorage.getItem('Token');
    if(localStorage.getItem('Token') == null || localStorage.getItem('RefreshToken') == null) {
      this.router.navigate(['User/Login'])
    }

    var AccessRefreshToken =
    {
      "AccessToken": localStorage.getItem('Token'),
      "RefreshToken": localStorage.getItem('RefreshToken')
    };
    this.http.post<UserLogin>(`${this.uri}`+'/refresh-token', AccessRefreshToken).subscribe(
        (res: UserLogin) => {
          if (res != null) {
            this.user = res;
            window.localStorage.setItem(
              'Token',
              res.token
            );
            window.localStorage.setItem(
              'RefreshToken',
              res.refreshToken
            );
            token = res.token;
          }
          //in else is status code 200 and all is ok
          // else
          //   this.toastrComponent.callTost('Refresh token', 'Novi token nije vratio vrijednosti', 'DANGER');
        },
        (error) => {
          localStorage.removeItem('Token');
          localStorage.removeItem('RefreshToken');
          this.router.navigate(['User/Login'])
          this.toastrComponent.callTost('Refresh token', 'API greska: '+error.message+' - '+error.status+' -'+error.body, 'DANGER');
        }
    );
    return token;
  
  }
  LogOut(){
    // var reqHeader = new HttpHeaders({ 
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer ' + localStorage.getItem('Token')
    // });
    // return this.http.delete(`${this.uri}/${id}`, { headers: reqHeader });
    //IN THIS CODE WE NEED IMPLEMENT DELETE REFRESH TOKEN
    localStorage.removeItem('Token');
    localStorage.removeItem('RefreshToken');
    localStorage.removeItem('userInfo');
    this.router.navigate(['User/Login'])
  }
  userInfo() {
    let token = this.AutoRefreshToken();
    if(token == null) {this.router.navigate(['User/Login'])}

    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(`${this.uri}`+'/userInfo', { headers: reqHeader });
  }
  usersRoles() {
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('Token')
    });
    return this.http.get(`${this.uri}`+'/usersroles', { headers: reqHeader });
  }
  // update(admin: Administrator) {
  //   return this.http.put(`${this.uri}/${admin.id}`, admin);
  // }

  private isTokenExpired(token: string): boolean {
    const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(jwtPayload.exp * 1000);
    //console.log('');
    //console.log(expirationDate);
    expirationDate.setSeconds(expirationDate.getSeconds()-10);
    //console.log(expirationDate);
    
    if(new Date() > expirationDate)
      console.log('Expired Cookie:'+expirationDate.toString()+' <<<>>> System:'+new Date().toString());
    else
      console.log('NOT Expired '+expirationDate.toString());

    return expirationDate < new Date();
  }
  private AutoRefreshToken() :string | null {
    let token = localStorage.getItem('Token');
    if(token==null){
      this.router.navigate(['User/Login'])
    }
    else{
      if(this.isTokenExpired(token)){
        token = this.refreshToken3();
      }
    }
    return token;
  }
}
