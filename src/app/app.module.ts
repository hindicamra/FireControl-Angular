import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxAwesomePopupModule, DialogConfigModule, ConfirmBoxConfigModule, ToastNotificationConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { ToastrComponent } from './shared/toastr/toastr.component';
import { ReloadComponentComponent } from './shared/reload-component/reload-component.component';
import { LoginComponent } from './User/login/login.component';
import { FormsModule } from '@angular/forms';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { MenuComponent } from './User/menu/menu.component';
import { HomeComponent } from './Home/home/home.component';
import { GeoPortalComponent } from './Home/geo-portal/geo-portal.component';
import { FireComponent } from './fire/fire.component';

import { CommonModule, DatePipe } from '@angular/common'; // Import the CommonModule and DatePipe

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    ToastrComponent,
    ReloadComponentComponent,
    LoginComponent,
    NavigationBarComponent,
    MenuComponent,
    HomeComponent,
    GeoPortalComponent,
    FireComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
    NgxAwesomePopupModule.forRoot(), // Essential, mandatory main module.
    DialogConfigModule.forRoot(), // Needed for instantiating dynamic components.
    ConfirmBoxConfigModule.forRoot(), // Needed for instantiating confirm boxes.
    ToastNotificationConfigModule.forRoot(), // Needed for instantiating toast notifications.

    AgGridModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
