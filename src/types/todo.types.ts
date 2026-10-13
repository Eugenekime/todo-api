import type { ObjectId } from 'mongodb';

export interface Todo {
  _id: ObjectId;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  updatedAt?: Date;
}
export type TodoQueryOptions = {
  limit?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  offset?: number;
  dueFrom?: string;
  dueTo?: string;
  sortBy?: string;
  order?: string;
};

export interface UpdateTodo {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface CreateTodo {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
}
