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

  securityQuestions: SecurityQuestion[];
  errorMessages: Message[];
  user: User;
  selectedSecurityQuestions: SelectedSecurityQuestion[];

  contactForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    address: [null, Validators.compose([Validators.required])]
  });

  sqForm: FormGroup = this.fb.group({
    securityQuestion1: [null, Validators.compose([Validators.required])],
    securityQuestion2: [null, Validators.compose([Validators.required])],
    securityQuestion3: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion1: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion2: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion3: [null, Validators.compose([Validators.required])]
  });

  credForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])]
  });

  constructor(private router: Router, private fb: FormBuilder, private cookieService: CookieService, private securityQuestionService: SecurityQuestionService, private sessionService: SessionService) {
    this.securityQuestions=[];
    this.errorMessages=[];
    this.user={} as User;
    this.selectedSecurityQuestions=[];

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

  register() {
    const contactInformation = this.contactForm.value;
    const securityQuestions = this.sqForm.value;
    const credentials = this.credForm.value;

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

