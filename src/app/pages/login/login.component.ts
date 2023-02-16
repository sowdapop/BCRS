/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */

//Component that houses the log in functionality for BCRS

import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //define login form
  loginForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])],
  })

  errorMessages: Message[] = [];

  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService,
    private http: HttpClient, private sessionService: SessionService) { }

  ngOnInit(): void {
  }

  //login function
  login() {
    const userName = this.loginForm.controls['userName'].value;
    const password = this.loginForm.controls['password'].value;

    this.sessionService.login(userName, password).subscribe({
      next: (res) => {
        console.log(res);
        this.cookieService.set('sessionuser', res.data.userName, 1);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.errorMessages = [
          {severity: 'error', summary: 'Error', detail: e.message}
        ]
        console.log(e);
      }
    })
  }

}
