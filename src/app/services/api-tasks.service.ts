import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class ApiTasksService {
  private apiUrl = 'http://localhost:8080/api/tasks'; 

  constructor(private http: HttpClient) { }


  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}`);
  }


  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/get-task/${id}`);
  }


  createTask(task: TaskRequest): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Task>(`${this.apiUrl}`, task, { headers });
  }

  updateTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, {
      'title':task.title,
      'description':task.description,
      "quote":task.quote
    }, { headers });
  }


  changeTaskStatus(id: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/state/${id}`, null);
  }


  deleteTask(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
