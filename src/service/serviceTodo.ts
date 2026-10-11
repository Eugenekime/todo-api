import type {
  CreateTodo,
  Todo,
  TodoQueryOptions,
  UpdateTodo,
} from '../types/todo.types.js';
import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import type { Filter } from 'mongodb';

type TodoDocument = Omit<Todo, '_id'>;

const todosCollection = getDB().collection<TodoDocument>('todos');

async function getAllTodo(options: TodoQueryOptions) {
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;

  const filter: Filter<TodoDocument> = {};

  if (options.completed !== undefined) {
    filter.completed = options.completed;
  }

  if (options.dueFrom !== undefined || options.dueTo !== undefined) {
    const dueDateFilter: { $gte?: string; $lte?: string } = {};

    if (options.dueFrom !== undefined) {
      dueDateFilter.$gte = options.dueFrom;
    }

    if (options.dueTo !== undefined) {
      dueDateFilter.$lte = options.dueTo;
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

  const total = await todosCollection.countDocuments();

  const filtered = await todosCollection.countDocuments(filter);

  const todos = await todosCollection
    .find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  return {
    todos,
    meta: { limit, offset },
    total,
    filtered,
  };
}

async function getSingleTodo(id: string): Promise<Todo | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const todo = await todosCollection.findOne({
    _id: new ObjectId(id),
  });

  return todo;
}

async function createTodo(body: CreateTodo): Promise<Todo> {
  const newTodo = {
    title: body.title.trim(),
    description: body.description.trim(),
    priority: body.priority ?? 'low',
    dueDate: body.dueDate ? new Date(body.dueDate).toISOString() : 'anytime',
    createdAt: new Date().toISOString(),
    completed: false,
  };

  const result = await todosCollection.insertOne(newTodo);

  return {
    ...newTodo,
    _id: result.insertedId,
  };
}

async function updateTodo(id: string, body: UpdateTodo): Promise<Todo | null> {
  if (!ObjectId.isValid(id)) {
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
    updates.dueDate = body.dueDate;
  }

  updates.updatedAt = new Date().toISOString();

  return todosCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: 'after' }
  );
}

async function deleteTodo(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await todosCollection.deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount === 1;
}

export { getAllTodo, createTodo, updateTodo, getSingleTodo, deleteTodo };
