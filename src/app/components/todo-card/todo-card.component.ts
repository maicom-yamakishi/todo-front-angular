import { Component, computed, inject } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { TodoSignalService } from '../../services/todo-signal.service';
import { TodoKeyLocalStorage } from '../../models/enum/todoKeyLocalStorage';
import { Todo } from '../../models/model/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,],
  templateUrl: './todo-card.component.html'
})
export class TodoCardComponent {
  private todoSignalsService = inject(TodoSignalService);
  private todosSignal = this.todoSignalsService.todosState;
  public todosList = computed(() => this.todosSignal());
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';


  public ngOnInit(): void {
    if(this.isLocalStorageAvailable){
      this.getTodosInLocalStorage();
    }
  }

  private getTodosInLocalStorage(): void {
    const todosDatas = localStorage.getItem(
      TodoKeyLocalStorage.TODO_LIST
    ) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  private saveTodosInLocalStorage(): void {
    this.todoSignalsService.saveTodosInLocalStorage();
  }

  public handleDoneTodo(todoId: number): void {
    if (todoId) {
      this.todosSignal.update((todos) => {
        const todoSelected = todos.find((todo) => todo?.id === todoId) as Todo;
        todoSelected && (todoSelected.done = true)
        return todos
      })
      this.saveTodosInLocalStorage();
    }
  }

  public handleDeleteTodo(todo: Todo): void {
    if (todo) {
      const index = this.todosList().indexOf(todo);
      if (index !== -1){
        this.todosSignal.update((todos) => todos.filter((_, i)=> i!== index))
        this.saveTodosInLocalStorage();
      }
    }
  }
}
