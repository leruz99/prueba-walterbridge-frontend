import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from "@angular/forms";  
import { Renderer2 } from '@angular/core';
import { ApiTasksService } from '../services/api-tasks.service';
import { Task, TaskRequest } from '../models/task';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-basic-view',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './basic-view.component.html',
  styleUrls: ['./basic-view.component.css']  
})
export class BasicViewComponent implements OnInit, OnDestroy {

  taskArray: Task[] = [];
  selectedTask: Task = new Task();
  taskRequest: TaskRequest = new TaskRequest();
  isEdit: boolean = false;
  filterTitle: string = "";
  filteredTasks: Task[] = [];

  
  private subscriptions: Subscription = new Subscription();

  constructor(private renderer: Renderer2, private taskService: ApiTasksService) {
    this.renderer.addClass(document.body, 'basic-view-background');
  }
  
  ngOnInit() {
    this.loadTasks();
    
    
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'basic-view-background');
    this.subscriptions.unsubscribe(); 
  }
  
  

  loadTasks() {
    this.subscriptions.add(this.taskService.getAllTasks().subscribe(
      tasks => {
        this.taskArray = tasks;
        console.log(this.taskArray)
      },
      error => console.error('Error fetching tasks', error)
      
    ));
    
  }

  openForEdit(task: Task) {
    this.selectedTask = { ...task };
    this.isEdit = true;
  }

  addOrEdit() {
    if (!this.selectedTask.title || !this.selectedTask.description) {
      alert("Please complete all the fields before adding the task.");
      return;
    }

    if (this.selectedTask.id === 0 || this.selectedTask.id === undefined) {
      this.taskRequest.description =this.selectedTask.description;
      this.taskRequest.title = this.selectedTask.title;
      this.subscriptions.add(this.taskService.createTask(this.taskRequest).subscribe(
        newTask => {
          this.taskArray.push(newTask);
          console.log("task save ")
          this.clearSelectedTask();
        },
        error => console.error('Error creating task', error)
      ));
    } else {
      this.subscriptions.add(this.taskService.updateTask(this.selectedTask).subscribe(
        updatedTask => {
          const index = this.taskArray.findIndex(task => task.id === updatedTask.id);
          if (index !== -1) {
            this.taskArray[index] = updatedTask;
          }
          this.clearSelectedTask();
          console.log("task update ")
        },
        error => console.error('Error updating task', error)
      ));
    }
  }

  delete(taskDeleted:Task) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.selectedTask = taskDeleted;
      this.subscriptions.add(this.taskService.deleteTask(this.selectedTask.id).subscribe(
        () => {
          this.taskArray = this.taskArray.filter(task => task.id !== this.selectedTask.id);
          this.clearSelectedTask();
        },
        error => console.error('Error deleting task', error)
      ));
    }
  }

  clearSelectedTask() {
    this.selectedTask = new Task();
    this.isEdit = false;
  }


  toggleCompletion(task: Task) {
    this.subscriptions.add(this.taskService.changeTaskStatus(task.id).subscribe(
      () => {
        task.completed = !task.completed;
      },
      error => console.error('Error changing task status', error)
    ));
  }

}
