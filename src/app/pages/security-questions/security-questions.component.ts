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
  currentQuestion: SecurityQuestion;

  constructor(private questionService: SecurityQuestionService) {
    this.questions = [];
    this.currentQuestion = {_id: "", text: "", isDisabled: false};


    this.questionService.findAllQuestions().subscribe({
      next: (res: any) => {
        this.questions = res;
      },
      error: (e) => {
        console.log(e.message);
      },
      complete: () => {
        console.log(this.questions)
      }

    })
   }


  ngOnInit(): void {
  }

  showDeleteModal(question: SecurityQuestion) {
    this.currentQuestion = question;
    const deleteModal = document.getElementById("modal-bg");
    if(deleteModal) {
      deleteModal.style.visibility = "visible";
    }
  }

  deleteQuestion(id: string) {
    this.closeDeleteModal();
    this.questionService.deleteQuestion(id).subscribe({
      next: (res) => {

      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        location.reload();
      }
    });
  }

  closeDeleteModal() {
    const deleteModal = document.getElementById("modal-bg");
    if(deleteModal) {
      deleteModal.style.visibility = "hidden";
    }
  }

}
