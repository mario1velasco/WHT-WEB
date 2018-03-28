import { SessionService } from './shared/services/session.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterializeModule } from 'angular2-materialize';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { DatepickerComponent } from './components/materialize/datepicker/datepicker.component';
import { LoginComponent } from './components/misc/login/login.component';
import { SignupComponent } from './components/misc/signup/signup.component';
import { NavbarComponent } from './components/misc/navbar/navbar.component';
import { UsersService } from './shared/services/users.service';
import { UserPanelComponent } from './components/user/user-panel/user-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    DatepickerComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    UserPanelComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    UsersService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
