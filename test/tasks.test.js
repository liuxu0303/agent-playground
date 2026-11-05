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

test('removes a task, and reports a missing one', () => {
  const task = store.create(tasks, { title: 'a' });
  assert.equal(store.remove(tasks, task.id), true);
  assert.equal(tasks.length, 0);
  assert.equal(store.remove(tasks, task.id), false);
});
