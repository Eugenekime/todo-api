export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  updatedAt?: string;
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
  dueDate?: string;
}

export interface CreateTodo {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
