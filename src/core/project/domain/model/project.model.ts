import { Todo } from './todo.model';

export class Project {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  todos: Todo[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
