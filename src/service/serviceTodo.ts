import type {
  CreateTodo,
  Todo,
  TodoQueryOptions,
  UpdateTodo,
} from '../types/todo.types.js';

const todos: Todo[] = [
  {
    id: 1,
    title: 'Complete project',
    description: 'Finish the TODO API',
    completed: false,
    priority: 'high',
    dueDate: '2024-12-31',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'react',
    description: 'Finish the TODO API',
    completed: false,
    priority: 'high',
    dueDate: '2024-08-31',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    title: 'next',
    description: 'Finish the TODO API',
    completed: true,
    priority: 'high',
    dueDate: '2024-10-22',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 4,
    title: 'express',
    description: 'Finish the TODO API',
    completed: true,
    priority: 'high',
    dueDate: '2024-9-15',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

function getAllTodo(options: TodoQueryOptions) {
  let filteredTodos = todos;
  if (options.completed !== undefined) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed === options.completed
    );
  }
  if (options.priority !== undefined) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.priority === options.priority
    );
  }
  if (options.search !== undefined) {
    const search = options.search.toLowerCase().trim();
    filteredTodos = filteredTodos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(search) ||
        todo.description.toLowerCase().includes(search)
    );
  }
  if (options.dueFrom !== undefined && options.dueTo !== undefined) {
    const from = new Date(options.dueFrom);
    const to = new Date(options.dueTo);
    filteredTodos = filteredTodos.filter((todo) => {
      const formatted = new Date(todo.dueDate);
      if (options.dueFrom !== undefined && options.dueTo !== undefined) {
        return formatted >= from && formatted <= to;
      }
    });
  }
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;

  const start = offset;

  const end = start + limit;
  const total = todos.length;

  const filtered = filteredTodos.length;
  filteredTodos = filteredTodos.slice(start, end);
  return {
    todos: filteredTodos,
    meta: { limit, offset },
    total,
    filtered,
  };
}

function getSingleTodo(id: number): Todo | null {
  const todo = todos.find((todo) => todo.id === id);
  return todo ?? null;
}

function createTodo(body: CreateTodo): Todo {
  const newId =
    todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (dueDate && isNaN(dueDate.getTime())) {
    throw new Error('Invalid due date');
  }
  const newTodo = {
    id: newId,
    title: body.title.trim(),
    description: body.description.trim(),
    priority: body.priority ?? 'low',
    dueDate: dueDate ? dueDate.toISOString() : 'anytime',
    createdAt: new Date().toISOString(),
    completed: false,
  };
  todos.push(newTodo);
  return newTodo;
}

function updateTodo(id: number, body: UpdateTodo): Todo | null {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return null;
  }
  if (body.title !== undefined) {
    todo.title = body.title.trim();
  }

  if (body.completed !== undefined) {
    todo.completed = body.completed;
  }

  if (body.priority !== undefined) {
    todo.priority = body.priority;
  }
  if (body.description !== undefined) {
    todo.description = body.description.trim();
  }

  if (body.dueDate !== undefined) {
    todo.dueDate = body.dueDate;
  }

  todo.updatedAt = new Date().toISOString();
  return todo;
}

function deleteTodo(id: number) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
}

export { getAllTodo, createTodo, updateTodo, getSingleTodo, deleteTodo };
