import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Question } from '../models/quiz.model';

@Injectable({
  providedIn: 'root',
})

export class QuizService {

   
    url = environment.baseUrl;
 generalData = environment.generalUrl;
 personalData = environment.personalUrl;
 familyData = environment.familyUrl;


    http=inject(HttpClient);

    getGeneralInfo(){
      return this.http.get<Question[]>(`${this.url}${this.generalData}`);
    }

    getPersonalInfo(){
      return this.http.get<Question[]>(`${this.url}${this.personalData}`);
    }

    getFamilyInfo(){
      return this.http.get<Question[]>( `${this.url}${this.familyData}`);
    }
    
}

