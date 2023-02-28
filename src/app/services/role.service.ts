/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 25 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Role } from "../shared/models/role";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  // add http to constructor for API calls
  constructor(private http: HttpClient) {}

  // findAll from the server
  findAllRoles(): Observable<any> {
    return this.http.get("/api/roles");
  }
  // find by id with the server
  findRoleById(roleId: string): Observable<any> {
    // using `roleId` parameter to .get from the server
    return this.http.get(`/api/roles/${roleId}`);
  }
  // create role call to server
  createRole(role: Role): Observable<any> {
    return this.http.post("/api/roles", {
      //  use role.text (parameter) to write to the Role model's 'text' field
      text: role.text,
    });
  }
  // update a role in the db with the server
  updateRole(roleId: string, role: Role): Observable<any> {
    // using `roleId` parameter to .get from the server
    return this.http.put(`/api/roles/${roleId}`, {
      //  use role.text (parameter) to write to the Role model's 'text' field
      text: role.text,
    });
  }
  // soft delete a role in the db
  deleteRole(roleId: string): Observable<any> {
    // using `roleId` variable to .get from the server
    return this.http.delete(`/api/roles/${roleId}`);
  }
  // find what role a user has
  findUserRole(userName: string): Observable<any> {
    // using `userName` parameter to .get from the server
    return this.http.get(`/api/users/${userName}/role`);
  }
}
