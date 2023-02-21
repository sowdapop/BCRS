/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 19 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css']
})
export class ResetPasswordFormComponent implements OnInit {

  //define controls
  isAuthenticated: string;
  username: string;

  //form construction
  form: FormGroup = this.fb.group({
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])]
  });
  
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
    private cookieService: CookieService, private sessionService: SessionService) {

      this.isAuthenticated = this.route.snapshot.queryParamMap.get('isAuthenticated') ?? '';
      this.username = this.route.snapshot.queryParamMap.get('username') ?? '';
     }

  ngOnInit(): void {
  }

  //update password function
  updatePassword() {
    const password = this.form.controls['password'].value;

    this.sessionService.updatePassword(password, this.username).subscribe({
      next: (res) => {
        this.cookieService.set('sessionuser', this.username, 1);
        this.router.navigate(['/']);
        },
        error: (e) => {
          console.log(e);
        }
    })
  }
}
