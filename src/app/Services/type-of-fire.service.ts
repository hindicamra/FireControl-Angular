import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import UserLogin from '../Models/User/UserLogin';
import { ToastrComponent } from '../shared/toastr/toastr.component';

@Injectable({
  providedIn: 'root'
})
export class TypeOfFireService {
  private user: UserLogin | undefined;
  uriUser = 'http://localhost:33764/api/Identity';
  uri = 'http://localhost:33764/api/TypeOfFire';
  constructor(private http: HttpClient, private router: Router, private toastrComponent: ToastrComponent) { }
  getAll() {
    let token = this.AutoRefreshToken();
    if(token == null) {this.router.navigate(['User/Login'])}
  
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  
    // if(id !== 0)
    //   return this.http.get(`${this.uri}`+"?id="+id, { headers: reqHeader });
    return this.http.get(`${this.uri}`, { headers: reqHeader });
  }

  private isTokenExpired(token: string): boolean {
    const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(jwtPayload.exp * 1000);
    //console.log('');
    //console.log(expirationDate);
    expirationDate.setSeconds(expirationDate.getSeconds()-10);
    //console.log(expirationDate);
    
    // if(expirationDate < new Date())
    //   console.log('Expired'+expirationDate.toString()+' <---> '+new Date().toString());
    // else
    //   console.log('!Expired '+new Date().toString());
  
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
    this.http.post<UserLogin>(`${this.uriUser}`+'/refresh-token', AccessRefreshToken).subscribe(
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
}
