/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 18 Feb 2023
 * Description: A web application for a computer repair shop
 */

//component to verify the username
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-verify-username-form',
  templateUrl: './verify-username-form.component.html',
  styleUrls: ['./verify-username-form.component.css']
})
export class VerifyUsernameFormComponent implements OnInit {

  //error message controller
  errorMessages: Message[];

  //form functionality
  form: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, private router: Router, private sessionService: SessionService) {
    this.errorMessages = [];
   }

  ngOnInit(): void {
  }

//verify user function
  verifyUser() {
    const username = this.form.controls['username'].value;

    this.sessionService.verifyUsername(username).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/session/verify-security-questions'], {queryParams: {username: username}, skipLocationChange: true})
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
