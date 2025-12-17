import { Component, inject, signal } from '@angular/core';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { InputRenderer } from '../../../../shared/components/input-renderer/input-renderer';
import { QuestionCard } from '../../../../shared/components/question-card/question-card';


@Component({
  selector: 'app-general-info',
  imports: [ MatCardModule,
    MatDividerModule,
    InputRenderer,QuestionCard],
  templateUrl: './general-info.html',
  styleUrl: './general-info.scss',
})
export class GeneralInfo {

  quizService=inject(QuizService);
  questions=signal<Question[]>([]);
  ngOnInit(){
    this.quizService.getGeneralInfo().subscribe(data=>{
      this.questions.set(data);
      console.log(data);
    })
  }

}

