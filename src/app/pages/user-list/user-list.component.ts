/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 13 Feb 2023
 * Description: A web application for a computer repair shop
 */

//Component for list of all users

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  //Define user variable
  users: User[] = [];
  
  constructor(private userService: UserService, private confirmationService: ConfirmationService) {
    this.userService.findAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
   }

  ngOnInit(): void {
  }

  //Delete functionality for User List
  delete(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(userId).subscribe({
          next: (res) => {
            console.log('User deleted successfully');
            this.users = this.users.filter(user => user._id !==userId);
          },
          error: (e) => {
            console.log(e);
          }
        })
      },
      reject: (type: any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            console.log('User rejected this operation');
            break;
            case ConfirmEventType.CANCEL:
              console.log('User canceled this operation');
              break;
        }
      }
    })
  }

}
