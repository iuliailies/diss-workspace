import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SaveTrainingDocument,
  TrainingDocument,
} from '../data-types/training.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private requestURL = 'http://localhost:8090/training-document';

  constructor(private http: HttpClient) {}

  createTraining(training: SaveTrainingDocument): Observable<TrainingDocument> {
    return this.http.post<TrainingDocument>(
      this.requestURL + '/create-training',
      training,
    );
  }

  getCompletedTrainings(id: any): Observable<TrainingDocument[]> {
    return this.http.get<TrainingDocument[]>(
      `${this.requestURL}/get-completed-trainings/${id}`,
    );
  }

  getTodoTrainings(id: any): Observable<TrainingDocument[]> {
    return this.http.get<TrainingDocument[]>(
      `${this.requestURL}/get-todo-trainings/${id}`,
    );
  }

  getTraining(startTraining: any): Observable<TrainingDocument> {
    return this.http.post<TrainingDocument>(
      `${this.requestURL}/get-training`,
      startTraining,
    );
  }

  deleteTraining(id: any): Observable<any> {
    return this.http.delete(`${this.requestURL}/${id}`);
  }

  updateBadge(badge: any): Observable<any> {
    return this.http.post(`${this.requestURL}/update-progress`, badge);
  }

  updateUserProgress(user: any): Observable<any> {
    return this.http.put(`${this.requestURL}/update-user-progress`, user);
  }

  searchTodoTrainings(searchKey: any): Observable<any> {
    return this.http.post<TrainingDocument[]>(
      `${this.requestURL}/search-todo-trainings`,
      searchKey,
    );
  }

  searchCompletedTrainings(searchKey: any): Observable<any> {
    return this.http.post<TrainingDocument[]>(
      `${this.requestURL}/search-completed-trainings`,
      searchKey,
    );
  }
}
