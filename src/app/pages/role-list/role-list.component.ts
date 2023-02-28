/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 26 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Component, OnInit } from "@angular/core";
import { Role } from "../../shared/models/role";
import { RoleService } from "src/app/services/role.service";
import { ConfirmationService, ConfirmEventType } from "primeng/api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";

@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  styleUrls: ["./role-list.component.css"],
  providers: [ConfirmationService],
})
export class RoleListComponent implements OnInit {
  //  set roles and error messages as arrays
  roles: Role[];
  errorMessages: Message[];
  //  form group for the role form
  roleForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])],
  });
  //  constructor
  constructor(
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.roles = [];
    this.errorMessages = [];
    //  call all roles to data on construct
    this.roleService.findAllRoles().subscribe({
      next: (res) => {
        // set all of the roles in the db to the roles array
        this.roles = res.data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  ngOnInit(): void {}
  //  create role function
  create() {
    // create a variable w/ the form's 'text' value
    const newRole: Role = {
      text: this.roleForm.controls["text"].value,
    };
    //  call the API via service -> server, using the newRole variable above
    this.roleService.createRole(newRole).subscribe({
      next: (res) => {
        if (res.data) {
          //  push data to roles array w/ refreshing the page
          this.roles.push(res.data);
        } else {
          //  if errors, set primeng message
          this.errorMessages = [
            { severity: "error", summary: "Error", detail: res.message },
          ];
        }
      },
      error: (e) => {
        // console log the error
        console.log(e);
      },
      complete: () => {
        //  set form control errors
        this.roleForm.controls["text"].setErrors({ incorrect: false });
      },
    });
  }
  //  delete role function
  delete(roleId: string) {
    //  set primeng confirmation info
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this record?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      // what to do if user accepts
      accept: () => {
        this.roleService.deleteRole(roleId).subscribe({
          next: (res) => {
            // disable role from db and remove it from the roles array
            console.log("Security question deleted successfully");
            this.roles = this.roles.filter((role) => role._id !== roleId);
          },
          error: (e) => {
            console.log(e);
          },
        });
      }, //end accept
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            console.log("User rejected this operation");
            break;
          case ConfirmEventType.CANCEL:
            console.log("User canceled this operation");
            break;
        }
      },
    });
  }
}
