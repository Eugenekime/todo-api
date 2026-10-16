import type {
  CreateTodo,
  Todo,
  TodoQueryOptions,
  UpdateTodo,
} from '../types/todo.types.js';
import mongoose from 'mongoose';
import type { TodoFields } from '../models/Todo.js';
import TodoModel from '../models/Todo.js';
import type { QueryFilter } from 'mongoose';

async function getAllTodo(options: TodoQueryOptions) {
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;

  const filter: QueryFilter<TodoFields> = {};

  if (options.completed !== undefined) {
    filter.completed = options.completed;
  }

  if (options.dueFrom !== undefined || options.dueTo !== undefined) {
    const dueDateFilter: { $gte?: Date; $lte?: Date } = {};

    if (options.dueFrom !== undefined) {
      dueDateFilter.$gte = new Date(options.dueFrom);
    }

    if (options.dueTo !== undefined) {
      dueDateFilter.$lte = new Date(options.dueTo);
    }

    filter.dueDate = dueDateFilter;
  }

  if (options.priority !== undefined) {
    filter.priority = options.priority;
  }

  if (options.search !== undefined && options.search.trim() !== '') {
    filter.$or = [
      { title: { $regex: options.search.trim(), $options: 'i' } },
      { description: { $regex: options.search.trim(), $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {};

  if (options.sortBy !== undefined) {
    const direction = options.order === 'desc' ? -1 : 1;

    if (options.sortBy === 'dueDate') {
      sort.dueDate = direction;
    }

    if (options.sortBy === 'createdAt') {
      sort.createdAt = direction;
    }
  }

  if (Object.keys(sort).length === 0) {
    sort.createdAt = -1;
  }

  sort._id = -1;

  const total = await TodoModel.countDocuments();

  const filtered = await TodoModel.countDocuments(filter);

  const todos = await TodoModel.find(filter)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .exec();

  return {
    todos,
    meta: { limit, offset },
    total,
    filtered,
  };
}

async function getSingleTodo(id: string): Promise<Todo | null> {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  const todo = await TodoModel.findById(id).lean<Todo>().exec();

  return todo;
}

async function createTodo(body: CreateTodo): Promise<Todo> {
  const newTodo = {
    title: body.title.trim(),
    description: body.description.trim(),
    priority: body.priority ?? 'low',
    dueDate: body.dueDate == null ? null : new Date(body.dueDate),
    completed: false,
  };

  const todo = await TodoModel.create(newTodo);

  return todo.toObject() as Todo;
}

async function updateTodo(id: string, body: UpdateTodo): Promise<Todo | null> {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const updates: Partial<Omit<Todo, '_id'>> = {};

  if (body.title !== undefined) {
    updates.title = body.title.trim();
  }

  if (body.description !== undefined) {
    updates.description = body.description.trim();
  }

  if (body.completed !== undefined) {
    updates.completed = body.completed;
  }

  if (body.priority !== undefined) {
    updates.priority = body.priority;
  }

  if (body.dueDate !== undefined) {
    if (body.dueDate === null) {
      updates.dueDate = null;
    } else {
      const dueDate = new Date(body.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid due date');
      }
      updates.dueDate = dueDate;
    }
  }

  return TodoModel.findByIdAndUpdate(
    id,
    { $set: updates },
    { returnDocument: 'after', runValidators: true }
  )
    .lean<Todo>()
    .exec();
}

async function deleteTodo(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }

  const deletedTodo = await TodoModel.findByIdAndDelete(id);

  return deletedTodo !== null;
}

export { getAllTodo, createTodo, updateTodo, getSingleTodo, deleteTodo };
