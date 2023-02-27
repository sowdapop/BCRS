/* 
Title: role-details.component.ts
Author: William Watlington, Danial Purselley, Kayla McDanel
Date: 26 February 2023
Description: role-details component for bcrs app
*/

import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/shared/models/role';
import { Message } from 'primeng/api';
import { RoleService } from 'src/app/services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {
  role: Role;
  roleId: string;
  errorMessages: Message[];


  roleForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private router: Router, 
    private roleService: RoleService
  ) {
    this.roleId = this.route.snapshot.paramMap.get('roleId') ?? '';
    this.role = {} as Role;
    this.errorMessages = [];

    this.roleService.findRoleById(this.roleId).subscribe({
      next: (res) => {
        this.role = res.data;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.roleForm.controls['text'].setValue(this.role.text);
      }
    })
   }

  ngOnInit(): void {
  }

  cancel() {
    this.router.navigate(['/roles']);
  }

  save() {
    const updatedRole: Role = {
      text: this.roleForm.controls['text'].value
    }

    this.roleService.updateRole(this.roleId, updatedRole).subscribe({
      next: (res) => {
        this.router.navigate(['/roles']);
      },
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log(e.message);
      }
    })
  }

}
