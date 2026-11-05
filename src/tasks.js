// The task store: pure functions over an array of tasks.
// A task is { id, title, done, due, priority }. The store owns id assignment only.

let nextId = 1;

export function reset() {
  nextId = 1;
}

// A due date is an ISO calendar date "YYYY-MM-DD", or null when unset.
function normalizeDue(due) {
  if (due === undefined || due === null || due === '') return null;
  const clean = typeof due === 'string' ? due.trim() : null;
  if (!clean || !/^\d{4}-\d{2}-\d{2}$/.test(clean)) throw new Error('due must be a valid date');
  const [year, month, day] = clean.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('due must be a valid date');
  }
  return clean;
}

// A priority is an integer from 1 to 5, defaulting to 3.
function normalizePriority(priority) {
  if (typeof priority === 'boolean') throw new Error('priority must be an integer between 1 and 5');
  const num = Number(priority);
  if (!Number.isInteger(num) || num < 1 || num > 5) throw new Error('priority must be an integer between 1 and 5');
  return num;
}

export function create(tasks, { title, done = false, due = null, priority = 3 }) {
  const clean = typeof title === 'string' ? title.trim() : '';
  if (!clean) throw new Error('title is required');
  const task = {
    id: nextId++,
    title: clean,
    done: Boolean(done),
    due: normalizeDue(due),
    priority: normalizePriority(priority),
  };
  tasks.push(task);
  return task;
}

export function list(tasks, { done } = {}) {
  if (done === undefined) return [...tasks];
  return tasks.filter(task => task.done === done);
}

export function update(tasks, id, patch) {
  const task = tasks.find(t => t.id === Number(id));
  if (!task) return null;
  if (patch.title !== undefined) {
    const clean = String(patch.title).trim();
    if (!clean) throw new Error('title is required');
    task.title = clean;
  }
  if (patch.done !== undefined) task.done = Boolean(patch.done);
  if (patch.due !== undefined) task.due = normalizeDue(patch.due);
  if (patch.priority !== undefined) task.priority = normalizePriority(patch.priority);
  return task;
}

export function remove(tasks, id) {
  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
