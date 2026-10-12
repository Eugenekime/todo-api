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
    dueDate: '2024-12-31T00:00:00.000Z',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'react',
    description: 'Finish the TODO API',
    completed: false,
    priority: 'high',
    dueDate: '2024-08-31T00:00:00.000Z',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 3,
    title: 'next',
    description: 'Finish the TODO API',
    completed: true,
    priority: 'high',
    dueDate: '2024-10-22T00:00:00.000Z',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 4,
    title: 'express',
    description: 'Finish the TODO API',
    completed: true,
    priority: 'high',
    dueDate: '2024-09-15T00:00:00.000Z',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
];

function getAllTodo(options: TodoQueryOptions) {
  let filteredTodos = [...todos];
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
  if (options.sortBy !== undefined) {
    const sortBy = options.sortBy;
    if (sortBy === 'dueDate') {
      filteredTodos = filteredTodos.sort((a, b) => {
        if (a.dueDate === null && b.dueDate === null) {
          return 0;
        }

        if (a.dueDate === null) {
          return 1;
        }

        if (b.dueDate === null) {
          return -1;
        }
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();

        if (options.order === 'desc') {
          return dateB - dateA;
        }
        return dateA - dateB;
      });
    }
    if (sortBy === 'createdAt') {
      if (options.order === 'desc') {
        filteredTodos = filteredTodos.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        filteredTodos = filteredTodos.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    }
  }
  if (options.dueFrom !== undefined) {
    const from = new Date(options.dueFrom);
    filteredTodos = filteredTodos.filter((todo) => {
      if (todo.dueDate === null) {
        return false;
      }
      const formatted = new Date(todo.dueDate);
      return formatted >= from;
    });
  }
  if (options.dueTo !== undefined) {
    const to = new Date(options.dueTo);
    filteredTodos = filteredTodos.filter((todo) => {
      if (todo.dueDate === null) {
        return false;
      }
      const formatted = new Date(todo.dueDate);
      return formatted <= to;
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
    dueDate: dueDate ? dueDate.toISOString() : null,
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
    if (body.dueDate === null) {
      todo.dueDate = null;
    } else {
      const dueDate = new Date(body.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid due date');
      }
      todo.dueDate = dueDate.toISOString();
    }
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
