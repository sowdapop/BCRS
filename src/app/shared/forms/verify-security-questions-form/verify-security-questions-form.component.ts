/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 19 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Component, OnInit } from "@angular/core";
import { SelectedSecurityQuestion } from "../../models/selected-security-question";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { SessionService } from "src/app/services/session.service";
import { VerifySecurityQuestionModel } from "../../models/verify-security-question.interface";

@Component({
  selector: "app-verify-security-questions-form",
  templateUrl: "./verify-security-questions-form.component.html",
  styleUrls: ["./verify-security-questions-form.component.css"],
})
export class VerifySecurityQuestionsFormComponent implements OnInit {
  //define controls
  selectedSecurityQuestions: SelectedSecurityQuestion[];
  verifySecurityQuestionsModel: VerifySecurityQuestionModel;
  username: string;
  errorMessages: Message[];

  form: FormGroup = this.fb.group({
    answerToSecurityQuestion1: [
      null,
      Validators.compose([Validators.required]),
    ],
    answerToSecurityQuestion2: [
      null,
      Validators.compose([Validators.required]),
    ],
    answerToSecurityQuestion3: [
      null,
      Validators.compose([Validators.required]),
    ],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService
  ) {
    this.username = this.route.snapshot.queryParamMap.get("username") ?? "";
    this.errorMessages = [];
    this.verifySecurityQuestionsModel = {} as VerifySecurityQuestionModel;
    this.selectedSecurityQuestions = [];

    this.userService.findSelectedSecurityQuestions(this.username).subscribe({
      next: (res) => {
        this.selectedSecurityQuestions = res.data;
        console.log(this.selectedSecurityQuestions);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.verifySecurityQuestionsModel.question1 =
          this.selectedSecurityQuestions[0].questionText;
        this.verifySecurityQuestionsModel.question2 =
          this.selectedSecurityQuestions[1].questionText;
        this.verifySecurityQuestionsModel.question3 =
          this.selectedSecurityQuestions[2].questionText;

        console.log("Verify security questions model");
        console.log(this.verifySecurityQuestionsModel);
      },
    });
  }

  ngOnInit(): void {}

  //verify security questions function
  verifySecurityQuestions() {
    this.verifySecurityQuestionsModel.answerToQuestion1 =
      this.form.controls["answerToSecurityQuestion1"].value;
    this.verifySecurityQuestionsModel.answerToQuestion2 =
      this.form.controls["answerToSecurityQuestion2"].value;
    this.verifySecurityQuestionsModel.answerToQuestion3 =
      this.form.controls["answerToSecurityQuestion3"].value;

    console.log(this.verifySecurityQuestionsModel);

    this.sessionService
      .verifySecurityQuestions(this.verifySecurityQuestionsModel, this.username)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === "User answered questions successfully") {
            this.router.navigate(["/session/reset-password"], {
              queryParams: { isAuthenticated: "true", username: this.username },
              skipLocationChange: true,
            });
          } else {
            this.errorMessages = [
              {
                severity: "error",
                summary: "Error",
                detail: "Unable to verify security question answers",
              },
            ];
            console.log("Unable to verify security question answers");
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
}
