import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';
import { ChatListComponent } from './components/chat/chat-list/chat-list.component';
import { UserBaseIdComponent } from './components/user/user-base-id/user-base-id.component';
import { Routes } from '@angular/router';

import { SignupComponent } from './components/misc/signup/signup.component';
import { LoginComponent } from './components/misc/login/login.component';
import { UserPanelComponent } from './components/user/user-panel/user-panel.component';
import { UserBaseComponent } from './components/user/user-base/user-base.component';
import { IsAuthenticatedGuard } from './shared/guards/is-authenticated.guard';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'users', canActivate: [IsAuthenticatedGuard], component: UserPanelComponent },
    {
        path: 'users',
        canActivate: [IsAuthenticatedGuard],
        component: UserBaseComponent,
        children: [
            { path: ':id', canActivate: [IsAuthenticatedGuard], component: UserPanelComponent },
            {
                path: ':id',
                canActivate: [IsAuthenticatedGuard],
                // resolve: {
                //     phone: PhoneDetailsResolverGuard
                // },
                component: UserBaseIdComponent,
                children: [
                    {
                        path: 'edit',
                        canActivate: [IsAuthenticatedGuard],
                        component: UserEditComponent
                    }
                ]
            }
        ]
    },
    { path: 'chats', canActivate: [IsAuthenticatedGuard], component: ChatListComponent},
    { path: 'newchat', canActivate: [IsAuthenticatedGuard], component: ChatRoomComponent},
    // {
    //     path: 'chats',
    //     canActivate: [IsAuthenticatedGuard],
    //     component: PhoneBaseComponent,
    //     children: [
    //         {
    //             path: 'new',
    //             canActivate: [IsAuthenticatedGuard],
    //             canDeactivate: [CanLeavePhoneCreateGuard],
    //             component: PhoneCreateComponent
    //         },
    //         {
    //             path: ':id',
    //             canActivate: [IsAuthenticatedGuard],
    //             resolve: {
    //                 phone: PhoneDetailsResolverGuard
    //             },
    //             component: PhoneItemComponent
    //         }
    //     ]
    // }
];
