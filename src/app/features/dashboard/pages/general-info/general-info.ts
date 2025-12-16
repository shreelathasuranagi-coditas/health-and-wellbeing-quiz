import { Component, inject, signal } from '@angular/core';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';

@Component({
  selector: 'app-general-info',
  imports: [],
  templateUrl: './general-info.html',
  styleUrl: './general-info.scss',
})
export class GeneralInfo {

  quizService=inject(QuizService);
  questions=signal<Question[]>([]);
  ngOnInit(){
    this.quizService.getGeneralInfo().subscribe(data=>{
      this.questions.set(data);
    })
  }

}
