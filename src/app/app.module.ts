import { IsAuthenticatedGuard } from './shared/guards/is-authenticated.guard';
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
import { UserBaseComponent } from './components/user/user-base/user-base.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { UserBaseIdComponent } from './components/user/user-base-id/user-base-id.component';
import { ChatListComponent } from './components/chat/chat-list/chat-list.component';


@NgModule({
  declarations: [
    AppComponent,
    DatepickerComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    UserPanelComponent,
    UserBaseComponent,
    UserEditComponent,
    UserBaseIdComponent,
    ChatListComponent
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
    SessionService,
    IsAuthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
