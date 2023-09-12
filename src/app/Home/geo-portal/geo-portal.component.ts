import { Component } from '@angular/core';
import { Router } from '@angular/router';
import UserInfo from 'src/app/Models/User/UserInfo';
import { ToastrComponent } from 'src/app/shared/toastr/toastr.component';


@Component({
  selector: 'app-geo-portal',
  templateUrl: './geo-portal.component.html',
  styleUrls: ['./geo-portal.component.css']
})
export class GeoPortalComponent {
  urlSafe: string = 'https://www.google.com/maps';
  constructor(private toastrComponent: ToastrComponent, private router: Router) {
    //Role actions START
  const storedArray :string = localStorage.getItem('userInfo') || '';
  const myParsedArray: UserInfo = JSON.parse(storedArray);

  var RoleOk: boolean = false;
  myParsedArray.roles.forEach(role => {
    if(role == 'Type1' || role == 'Type2' || role == 'Type3'){RoleOk=true;}
  });
  if(!RoleOk){
    this.toastrComponent.callTost('Administracija', 'Nemate pristup.', 'DANGER');
    this.router.navigate(['Home']);
  }
  //Role actions END
  }
}
