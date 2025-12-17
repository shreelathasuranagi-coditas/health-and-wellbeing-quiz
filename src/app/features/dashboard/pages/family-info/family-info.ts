import { Component, inject, signal } from '@angular/core';
import { QuizService } from '../../../../core/services/quiz-service';
import { Question } from '../../../../core/models/quiz.model';

@Component({
  selector: 'app-family-info',
  imports: [],
  templateUrl: './family-info.html',
  styleUrl: './family-info.scss',
})
export class FamilyInfo {

  quizService=inject(QuizService);
  questions=signal<Question[]>([]);
  ngOnInit(){
    this.quizService.getFamilyInfo().subscribe(data=>{
      this.questions.set(data);
    })
  }

}

