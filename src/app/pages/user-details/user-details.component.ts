/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 12 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Component, OnInit } from "@angular/core";
import { User } from "src/app/shared/models/user.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Message } from "primeng/api";

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

  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    address: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.userId = this.route.snapshot.paramMap.get("userId") ?? "";
    this.user = {} as User;
    this.errorMessages = [];

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

        console.log(this.user);
      },
    });
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
