/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from "./pages/home/home.component";
import { AuthLayoutComponent } from "./shared/auth-layout/auth-layout.component";
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { LoginComponent } from "./pages/login/login.component";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";
import { UserCreateComponent } from "./pages/user-create/user-create.component";
import { SecurityQuestionsComponent } from "./pages/security-questions/security-questions.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { UserListComponent } from "./pages/user-list/user-list.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { RegisterComponent } from "./pages/register/register.component";
import { MatListModule } from "@angular/material/list";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSelectModule } from "@angular/material/select";
import { VerifyUsernameFormComponent } from "./shared/forms/verify-username-form/verify-username-form.component";
import { ResetPasswordFormComponent } from "./shared/forms/reset-password-form/reset-password-form.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { VerifySecurityQuestionsFormComponent } from "./shared/forms/verify-security-questions-form/verify-security-questions-form.component";
import { AboutComponent } from "./pages/about/about.component";
import { ErrorInterceptor } from "./shared/error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthLayoutComponent,
    BaseLayoutComponent,
    LoginComponent,
    UserDetailsComponent,
    UserCreateComponent,
    SecurityQuestionsComponent,
    UserListComponent,
    ContactComponent,
    RegisterComponent,
    VerifyUsernameFormComponent,
    ResetPasswordFormComponent,
    NotFoundComponent,
    VerifySecurityQuestionsFormComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MessageModule,
    MessagesModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    MatListModule,
    MatStepperModule,
    MatSelectModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
