import { ResetPasswordFormComponent } from './shared/forms/reset-password-form/reset-password-form.component';
/* 
Title: app-routing.module.ts
Author: William Watlington, Danial Purselley, Kayla McDanel 
*/

import { LoginComponent } from "./pages/login/login.component";
import { AuthLayoutComponent } from "./shared/auth-layout/auth-layout.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { AuthGuard } from "./shared/auth.guard";
import { UserCreateComponent } from "./pages/user-create/user-create.component";
import { SecurityQuestionsComponent } from "./pages/security-questions/security-questions.component";
import { UserListComponent } from "./pages/user-list/user-list.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { RegisterComponent } from "./pages/register/register.component";
import { AboutComponent } from "./pages/about/about.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "sq",
        component: SecurityQuestionsComponent,
      },
      {
        path: "users",
        component: UserListComponent,
      },
      {
        path: "users/:userId",
        component: UserDetailsComponent,
      },
      {
        path: "users/create/new",
        component: UserCreateComponent,
      },
      {
        path: "contact",
        component: ContactComponent,
      },
      {
        path: "about",
        component: AboutComponent
      }
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "session",
    component: AuthLayoutComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordFormComponent
      }
    ],
  },
  {
    path: "**",
    pathMatch: "full",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
