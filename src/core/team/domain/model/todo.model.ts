import { TodoStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface TodoProps {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  assigneeId: string | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoProps {
  title: string;
  description?: string | null;
  assigneeId: string | null;
  projectId: string;
}

export class Todo {
  private constructor(private props: TodoProps) {}

  static create(props: CreateTodoProps): Todo {
    const now = new Date();

    return new Todo({
      id: randomUUID(),
      title: props.title,
      description: props.description ?? null,
      status: TodoStatus.Pending,
      assigneeId: props.assigneeId,
      projectId: props.projectId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: TodoProps): Todo {
    return new Todo(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get status(): TodoStatus {
    return this.props.status;
  }

  get assigneeId(): string | null {
    return this.props.assigneeId;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(title: string): void {
    if (!title.trim()) {
      throw new Error('Project title cannot be empty');
    }

    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  changeDescription(description: string | null): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  changeStatus(status: TodoStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }
}
