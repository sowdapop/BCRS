/* 
Title: security-questions.component.ts
Author: William Watlington
Date: 13 February 2023
Description: security questions angular component for bcrs app
*/
import { Component, OnInit } from '@angular/core';
import { SecurityQuestion } from 'src/app/models/security-question';
import { SecurityQuestionService } from 'src/app/services/security-question.service';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.css']
})
export class SecurityQuestionsComponent implements OnInit {

  questions: SecurityQuestion[];

  constructor(private questionService: SecurityQuestionService) {
    this.questions = [];

    this.questionService.findAllQuestions().subscribe({
      next: (res) => {

      },

    })
   }


  ngOnInit(): void {
  }

}
