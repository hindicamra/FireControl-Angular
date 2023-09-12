import { Component } from '@angular/core';
import { Router } from '@angular/router';
import NewUser from 'src/app/Models/User/NewUser';
import User from 'src/app/Models/User/User';
import UserInfo from 'src/app/Models/User/UserInfo';
import UsersRoles from 'src/app/Models/User/UsersRoles';
import { UserService } from 'src/app/Services/user.service';
import { ToastrComponent } from 'src/app/shared/toastr/toastr.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  user: NewUser = new NewUser();
  userEdit: User = new User();
  userNewPassword: string | undefined;

  Type1: boolean = false;
  Type2: boolean = false;
  Type3: boolean = false;

  users: User[] | undefined;
  usersRoles!: UsersRoles[];
  constructor(private userService: UserService, private router: Router, private toastrComponent: ToastrComponent) {

    //Role actions START
    const storedArray :string = localStorage.getItem('userInfo') || '';
    const myParsedArray: UserInfo = JSON.parse(storedArray);

    var RoleOk: boolean = false;
    myParsedArray.roles.forEach(role => {
      if(role == 'Type3'){RoleOk=true;}
    });
    if(!RoleOk){
      this.toastrComponent.callTost('Administracija', 'Nemate pristup.', 'DANGER');
      this.router.navigate(['Home']);
    }
    //Role actions END

    // this.userService.refreshToken();
    this.refreshTableUsers();
    this.user = new NewUser();
  }
  refreshTableUsers(){
    this.userService.getAll().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        this.toastrComponent.callTost('Korisnici', 'Ne mogu dohvatiti podatake. '+error.message+' - '+error.body, 'DANGER');
      }
    );

    this.userService.usersRoles().subscribe(
      (data: any) => {
        this.usersRoles = data;
      },
      (error) => {
        this.toastrComponent.callTost('Korisnici role', 'Ne mogu dohvatiti podatake. '+error.message, 'DANGER');
      }
    );
  }
  InsertUpdate()
  {
    // this.userService.refreshToken();

    this.user.Roles = [];
    if(this.Type1) {
      this.user.Roles?.push("Type1");
    }
    if(this.Type2) {
      this.user.Roles?.push("Type2");
    }
    if(this.Type3) {
      this.user.Roles?.push("Type3");
    }
    
    if(this.user.EditMode==true && typeof this.userNewPassword !== 'undefined'){ this.user.Password=this.userNewPassword; }
    
    this.userService.insert(this.user).subscribe(
      (data: any) => {
        //this.users = data;
        if(this.user.EditMode==false) {
          this.toastrComponent.callTost('Korisnici', 'Dodan korisnik u bazu.', 'SUCCESS');
        }
        else {
          this.toastrComponent.callTost('Korisnici', 'Korisnik editovan u bazi.', 'SUCCESS');
        }
        
        this.refreshTableUsers();
      },
      (error) => {
        this.toastrComponent.callTost('Korisnici', 'Ne mogu snimiti podatake. '+error.message, 'DANGER');
      }
    );
  }
  Delete(id: string) {
    // this.userService.refreshToken();
    this.userService.delete(id).subscribe(
      (data: any) => {
        //this.users = data;
        this.toastrComponent.callTost('Korisnici', 'Korisnik izbrisan iz baze.', 'SUCCESS');
        this.refreshTableUsers();
      },
      (error) => {
        this.toastrComponent.callTost('Korisnici', 'Korisnik nije izbrisan iz baze. '+error.message, 'DANGER');
      }
    );
  }
  Edit(_user: User)
  {
    // this.toastrComponent.callTost('Korisnici', 'Nije implementiran edit jos', 'DANGER');

    this.userEdit = _user;
    this.user= new NewUser();
    this.user.EditMode=true;
    this.user.Email=this.userEdit.email;
    this.user.FirstName=this.userEdit.firstName;
    this.user.LastName=this.userEdit.lastName;

    this.Type1=false;
    this.Type2=false;
    this.Type3=false;

    this.usersRoles.forEach( (value) => {
      if(value.userId==_user.id)
      {
        if(value.role=='Type1'){ this.Type1=true; }
        if(value.role=='Type2'){ this.Type2=true; }
        if(value.role=='Type3'){ this.Type3=true; }
      }
    }); 
  }
  Cancel() {
    this.user= new NewUser();
    this.Type1=false;
    this.Type2=false;
    this.Type3=false;
  }
}
