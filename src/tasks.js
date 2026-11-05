// The task store: pure functions over an array of tasks.
// A task is { id, title, done }. The store owns id assignment only.

let nextId = 1;

export function reset() {
  nextId = 1;
}

export function create(tasks, { title, done = false }) {
  const clean = typeof title === 'string' ? title.trim() : '';
  if (!clean) throw new Error('title is required');
  const task = { id: nextId++, title: clean, done: Boolean(done) };
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
  return task;
}

export function remove(tasks, id) {
  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
