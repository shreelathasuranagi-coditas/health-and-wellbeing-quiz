import { Component, inject, signal } from '@angular/core';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';

@Component({
  selector: 'app-personal-info',
  imports: [],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.scss',
})
export class PersonalInfo {

  quizService=inject(QuizService);
  questions=signal<Question[]>([]);
  
  ngOnInit(){
    this.quizService.getPersonalInfo().subscribe(data=>{
      this.questions.set(data);
    })
  }

}
