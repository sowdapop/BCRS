/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */

//begins a session when the user logs in

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.interface';
import { VerifySecurityQuestionModel } from './../shared/models/verify-security-question.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<any> {
    return this.http.post('/api/session/login', {
      userName,
      password
    })
  }

  //register new user
  register(user: User): Observable<any> {
    return this.http.post('/api/session/register', {
      userName: user.userName,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
      selectedSecurityQuestions: user.selectedSecurityQuestions,
    })
  }

  //verify a username
  verifyUsername(username: string): Observable<any> {
    return this.http.get('/api/session/verify/users/' + username);
  }
  verifySecurityQuestions(model: VerifySecurityQuestionModel, username: string): Observable<any> {
    return this.http.post('/api/sessions/verify/users/' + username + '/security-questions', {
      questionText1: model.question1,
      questionText2: model.question2,
      questionText3: model.question3,
      answerText1: model.answerToQuestion1,
      answerText2: model.answerToQuestion2,
      answerText3: model.answerToQuestion3
    })
  }

  //update password
  updatePassword(password: string, username: string): Observable<any> {
    return this.http.post('/api/session/users/' + username + '/reset-password', {
      password
    })
  }
}
