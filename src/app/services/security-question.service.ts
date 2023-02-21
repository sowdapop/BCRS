import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionService {

  constructor(private http: HttpClient) { }

  findAllQuestions(): Observable<any> {
    return this.http.get('/api/security-questions');
  }

  createQuestion(text: string) {
    return this.http.post('/api/security-questions/', { text: text });
  }

  updateQuestion(id: string, text: string) {
    return this.http.put('/api/security-questions/' + id, {
      text: text
    })
  }

  deleteQuestion(id: string) {
    return this.http.delete('/api/security-questions/' + id);
  }
}
