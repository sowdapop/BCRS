/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 12 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Component, OnInit } from "@angular/core";
import { User } from "../../shared/models/user.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { Message } from "primeng/api";
import { RoleService } from "../../services/role.service";
import { Role } from "../../shared/models/role";
import { SecurityQuestionService } from "src/app/services/security-question.service";
import { SecurityQuestion } from "src/app/shared/models/security-question.interface";

//form build for user details page

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  user: User;
  userId: string;
  errorMessages: Message[];
  roles: Role[];
  securityQuestions: SecurityQuestion[];

  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    address: [null, Validators.compose([Validators.required])],
    role: [null, Validators.compose([Validators.required])],
    securityQuestion: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService,
    private securityQuestionService: SecurityQuestionService
  ) {
    this.userId = this.route.snapshot.paramMap.get("userId") ?? "";
    this.user = {} as User;
    this.errorMessages = [];
    this.roles = [];
    this.securityQuestions = [];
    

    this.userService.findUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.form.controls["firstName"].setValue(this.user.firstName);
        this.form.controls["lastName"].setValue(this.user.lastName);
        this.form.controls["phoneNumber"].setValue(this.user.phoneNumber);
        this.form.controls["email"].setValue(this.user.email);
        this.form.controls["address"].setValue(this.user.address);
        this.form.controls["role"].setValue(this.user.role?.text ?? 'standard');

        console.log(this.user);

        this.roleService.findAllRoles().subscribe({
          next: (res) => {
            console.log(res);
            this.roles = res.data;
          },
          error: (e) => {
            console.log(e);
          }
        })
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


  ngOnInit(): void {}

  //saves the user details from the form above
  saveUser(): void {
    const updatedUser = {
      firstName: this.form.controls["firstName"].value,
      lastName: this.form.controls["lastName"].value,
      phoneNumber: this.form.controls["phoneNumber"].value,
      email: this.form.controls["email"].value,
      address: this.form.controls["address"].value,
      selectedSecurityQuestions: this.form.controls['selectedSecurityQuestions'].value,
      role: {
        text: this.form.controls['role'].value
      }
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (res) => {
        this.router.navigate(["/users"]);
      },
      error: (e) => {
        this.errorMessages = [
          { severity: "error", summary: "Error", detail: e.message },
        ];
        console.log(
          `Node.js server error; httpCode:${e.httpCode};message:${e.message}`
        );
        console.log(e);
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/users"]);
  }
}
