/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 12 Feb 2023
 * Description: A web application for a computer repair shop
 */

//base layout set up
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  userName: string;
  
  constructor(private cookieService: CookieService, private router: Router) {
    this.userName = this.cookieService.get('sessionuser') ?? '';
   }

  ngOnInit(): void {
  }

  //logout function
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }

}
