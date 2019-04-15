import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
// material
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
  MatInputModule,
  MatIconRegistry,
  MatProgressSpinnerModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { LoginGuard, GuestGuard, AdminGuard } from './guard';
import { NotFoundComponent } from './not-found';
import { AccountMenuComponent } from './component/header/account-menu/account-menu.component';
import { HeaderComponent } from './component';
import { GrowlModule } from 'primeng/primeng';
import { ApiService, AuthService, UserService, ConfigService } from './service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AdminComponent } from './admin/admin.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AuthorityService } from './service/authority.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';

export function initUserFactory(userService: UserService) {
  return () => userService.initUser();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    AccountMenuComponent,
    ChangePasswordComponent,
    AdminComponent
  ],
  imports: [
    BrowserAnimationsModule,
    GrowlModule,
    BrowserModule, DialogModule,
    FormsModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    FileUploadModule,
    HttpModule,
    TableModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CheckboxModule,
    FlexLayoutModule,
    DropdownModule
  ],
  providers: [
    LoginGuard, ConfirmationService,
    GuestGuard,
    AdminGuard,
    AuthService,
    ApiService,
    UserService,
    ConfigService,
    AuthorityService,
    MatIconRegistry,
    {
      'provide': APP_INITIALIZER,
      'useFactory': initUserFactory,
      'deps': [UserService],
      'multi': true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
