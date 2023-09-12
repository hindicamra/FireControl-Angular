import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FireComponent } from './fire/fire.component';
import { GeoPortalComponent } from './Home/geo-portal/geo-portal.component';
import { HomeComponent } from './Home/home/home.component';
import { LoginComponent } from './User/login/login.component';
import { MenuComponent } from './User/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'Home',
    component: HomeComponent,
  },
  {
    path: 'GeoPortal',
    component: GeoPortalComponent,
  },
  {
    path: 'User/Login',
    component: LoginComponent,
  },
  {
    path: 'User/Menu',
    component: MenuComponent,
  },
  
  {
    path: 'Fire',
    component: FireComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
