import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as store from '../src/tasks.js';

let tasks;

beforeEach(() => {
  store.reset();
  tasks = [];
});

test('creates a task and assigns increasing ids', () => {
  const first = store.create(tasks, { title: 'write the demo' });
  const second = store.create(tasks, { title: 'read it back' });
  assert.equal(first.id, 1);
  assert.equal(second.id, 2);
  assert.equal(tasks.length, 2);
});

test('stores an optional due date, defaulting to null', () => {
  const withDue = store.create(tasks, { title: 'a', due: '2026-12-31' });
  assert.equal(withDue.due, '2026-12-31');
  const withoutDue = store.create(tasks, { title: 'b' });
  assert.equal(withoutDue.due, null);
  assert.throws(() => store.create(tasks, { title: 'c', due: 'not-a-date' }), /valid date/);
  assert.throws(() => store.create(tasks, { title: 'd', due: 20261231 }), /valid date/);
  assert.throws(() => store.create(tasks, { title: 'e', due: '2026-02-30' }), /valid date/);
});

test('trims the title and rejects an empty one', () => {
  assert.equal(store.create(tasks, { title: '  spaced  ' }).title, 'spaced');
  assert.throws(() => store.create(tasks, { title: '   ' }), /title is required/);
});

test('lists every task, or only the matching ones', () => {
  store.create(tasks, { title: 'a' });
  const done = store.create(tasks, { title: 'b', done: true });
  assert.equal(store.list(tasks).length, 2);
  assert.deepEqual(store.list(tasks, { done: true }), [done]);
  assert.equal(store.list(tasks, { done: false }).length, 1);
});

test('updates a task, and reports a missing one', () => {
  const task = store.create(tasks, { title: 'a' });
  assert.equal(store.update(tasks, task.id, { done: true }).done, true);
  assert.equal(store.update(tasks, 999, { done: true }), null);
  assert.throws(() => store.update(tasks, task.id, { title: '' }), /title is required/);
});

test('updates and clears a due date', () => {
  const task = store.create(tasks, { title: 'a' });
  assert.equal(store.update(tasks, task.id, { due: '2027-01-01' }).due, '2027-01-01');
  assert.equal(store.update(tasks, task.id, { due: null }).due, null);
  assert.throws(() => store.update(tasks, task.id, { due: 'nope' }), /valid date/);
});

test('removes a task, and reports a missing one', () => {
  const task = store.create(tasks, { title: 'a' });
  assert.equal(store.remove(tasks, task.id), true);
  assert.equal(tasks.length, 0);
  assert.equal(store.remove(tasks, task.id), false);
});
