/* 
Title: register.component.ts
Author: William Watlington
Date: 19 February 2023
Description: register component for bcrs app
*/


// imports 
import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SecurityQuestion } from 'src/app/shared/models/security-question.interface';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import { SelectedSecurityQuestion } from 'src/app/shared/models/selected-security-question';
import { User } from 'src/app/shared/models/user.interface';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class RegisterComponent implements OnInit {

  // component variable init/types
  securityQuestions: SecurityQuestion[];
  errorMessages: Message[];
  user: User;
  selectedSecurityQuestions: SelectedSecurityQuestion[];

  // form group for contact portion of stepper
  contactForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    address: [null, Validators.compose([Validators.required])]
  });

  // form group for security question portion of stepper
  sqForm: FormGroup = this.fb.group({
    securityQuestion1: [null, Validators.compose([Validators.required])],
    securityQuestion2: [null, Validators.compose([Validators.required])],
    securityQuestion3: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion1: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion2: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion3: [null, Validators.compose([Validators.required])]
  });

  // form group for credential portion of stepper
  credForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])]
  });

  constructor(private router: Router, private fb: FormBuilder, private cookieService: CookieService, private securityQuestionService: SecurityQuestionService, private sessionService: SessionService) {
    this.securityQuestions=[];
    this.errorMessages=[];
    this.user={} as User;
    this.selectedSecurityQuestions=[];

    // call findAll security question api and assign result to securityQuestions array
    this.securityQuestionService.findAllQuestions().subscribe({
      next: (res) => {
        this.securityQuestions = res;
      },
      error: (e) => {
        console.log(e);
      }
    })
   }

  ngOnInit(): void {
  }

  // function that registers new user to database using services/api
  register() {
    const contactInformation = this.contactForm.value;
    const securityQuestions = this.sqForm.value;
    const credentials = this.credForm.value;

    // assign user selected questions/answers to array to be stored in db
    this.selectedSecurityQuestions = [
      {
        questionText: securityQuestions.securityQuestion1,
        answerText: securityQuestions.answerToSecurityQuestion1
      },
      {
        questionText: securityQuestions.securityQuestion2,
        answerText: securityQuestions.answerToSecurityQuestion2
      },
      {
        questionText: securityQuestions.securityQuestion3,
        answerText: securityQuestions.answerToSecurityQuestion3
      }
    ]

    // assign form inputs to new user object
    this.user = {
      userName: credentials.userName,
      password: credentials.password,
      firstName: contactInformation.firstName,
      lastName: contactInformation.lastName,
      phoneNumber: contactInformation.phoneNumber,
      address: contactInformation.address,
      email: contactInformation.email,
      selectedSecurityQuestions: this.selectedSecurityQuestions
    }

    // register user object to db using sessionService/sq api
    this.sessionService.register(this.user).subscribe({
      next: (res) => {
        console.log(this.user);
        this.cookieService.set('sessionuser', credentials.userName, 1);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
      }
    })
  }
}

