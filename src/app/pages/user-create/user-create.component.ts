/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 12 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'primeng/api';
import { User } from 'src/app/shared/models/user.interface';
import { Role } from 'src/app/shared/models/role';
import { RoleService } from 'src/app/services/role.service';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import { SecurityQuestion } from 'src/app/models/security-question';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  //Form construction
  form: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])],
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    address: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    securityQuestion: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion: [null, Validators.compose([Validators.required])],
    role: [null, Validators.compose([Validators.required])]
  });

user: User;
userId: string;
errorMessages: Message[] = [];
roles: Role[] = [];
securityQuestions: SecurityQuestion[];


  constructor(private fb: FormBuilder,
     private router: Router, 
     private userService: UserService,
     private roleService: RoleService,
     private securityQuestionService: SecurityQuestionService) {
    this.user = {} as User;
    this.userId = '';
    this.roles = [];
    this.securityQuestions = [];

    this.roleService.findAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    });

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

  //Form implementation
  createUser(): void {
    const newUser: User = {
      userName: this.form.controls['userName'].value,
      password: this.form.controls['password'].value,
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      address: this.form.controls['address'].value,
      email: this.form.controls['email'].value,
      selectedSecurityQuestions: [{'questionText': this.form.controls['securityQuestion'].value, 'answerText': this.form.controls['answerToSecurityQuestion'].value}],
      role: this.form.controls['role'].value
    };

    this.userService.createUser(newUser).subscribe({
      next: (res) => {
        console.log(res)
      this.router.navigate(['/users'])
    }, 
    error: (err) => {
      this.errorMessages = [
        { severity: 'error', summary:'Error', detail: err.message }
      ]
      console.log(`Node.js server error; httpCode:${err.httpCode}; message:${err.message}`)
      console.log(err);
    }
  });
}

  cancel(): void {
    this.router.navigate(['/users']);
  }

}
