/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Injectable } from "@angular/core";
import { User } from "../shared/models/user.interface";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  findAllUsers(): Observable<any> {
    return this.http.get("/api/users");
  }

  findUserById(userId: string): Observable<any> {
    return this.http.get("/api/users/" + userId);
  }

  createUser(user: User): Observable<any> {
    return this.http.post("/api/users/", {
      userName: user.userName,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
    });
  }

  updateUser(userId: string, user: User): Observable<any> {
    return this.http.put("/api/users/" + userId, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete("/api/users/" + userId);
  }

  findSelectedSecurityQuestions(userName: string): Observable<any> {
    return this.http.get("/api/users/" + userName + "/security-questions");
  }
}
