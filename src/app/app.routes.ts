import { Routes } from '@angular/router';

import { SignupComponent } from './components/misc/signup/signup.component';
import { LoginComponent } from './components/misc/login/login.component';
import { UserPanelComponent } from './components/user/user-panel/user-panel.component';
import { UserBaseComponent } from './components/user/user-base/user-base.component';
import { IsAuthenticatedGuard } from './shared/guards/is-authenticated.guard';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'panel', component: UserPanelComponent },
    {
        path: 'users',
        canActivate: [IsAuthenticatedGuard],
        component: UserBaseComponent,
        children: [
            {
                path: ':id',
                canActivate: [IsAuthenticatedGuard],
                // resolve: {
                //     phone: PhoneDetailsResolverGuard
                // },
                component: UserPanelComponent
            }
        ]
    },
];
