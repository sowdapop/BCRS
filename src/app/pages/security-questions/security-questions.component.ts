/* 
Title: security-questions.component.ts
Author: William Watlington
Date: 13 February 2023
Description: security questions angular component for bcrs app
*/
import { Component, OnInit } from '@angular/core';
import { SecurityQuestion } from 'src/app/models/security-question';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.css']
})
export class SecurityQuestionsComponent implements OnInit {

  questions: SecurityQuestion[];
  currentQuestion: SecurityQuestion;

  updateQuestionForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  createQuestionForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  constructor(private questionService: SecurityQuestionService, private fb: FormBuilder) {
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

  showModal(modalType: string, question?: SecurityQuestion) {
    if(question) {
      this.currentQuestion = question;
    }
    const modal = document.getElementById("modal-bg");
    const updateDiv = document.getElementById("update-modal-content");
    const deleteDiv = document.getElementById("delete-modal-content");
    if(modal) {
      if(modalType === 'edit' && updateDiv) {
        updateDiv.style.display = 'block';
      } else if (modalType === 'delete' && deleteDiv) {
        deleteDiv.style.display = 'block';
      }
      modal.style.visibility = "visible";
    }
  }

  deleteQuestion(id: string) {
    this.closeModal();
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

  updateQuestion(id: string) {
    const updatedQuestion = this.updateQuestionForm.controls['text'].value;

    this.questionService.updateQuestion(id, updatedQuestion).subscribe({
      next: (res) => {

      },
      error: (e) => {
        console.log(e.message);
      },
      complete: () => {
        location.reload();
      }
    })
  }

  createQuestion() {
    const newQuestion = this.createQuestionForm.controls['text'].value;
    this.questionService.createQuestion(newQuestion).subscribe({
      next: (res) => {

      },
      error: (e) => {
        console.log(e.message);
      },
      complete: () => {
        location.reload();
      }
    })
  }

  closeModal() {
    const modal = document.getElementById("modal-bg");
    const updateDiv = document.getElementById("update-modal-content");
    const deleteDiv = document.getElementById("delete-modal-content");
    if(modal && updateDiv && deleteDiv) {
      modal.style.visibility = "hidden";
      updateDiv.style.display = "none";
      deleteDiv.style.display = "none";
    }
  }

}
