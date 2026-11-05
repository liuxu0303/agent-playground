# agent-playground

A small demo app used to exercise the dsh-superagent workflow. It is a task
board: a JSON HTTP API backed by an in-memory store, and a browser UI that
talks to it.

The point is not the task board. The point is having a repository where an
agent can pick up a request from an issue, change code, add a test, and open a
pull request that a person can review.

## Run it

```sh
npm start          # serves http://127.0.0.1:3000
npm test           # runs the unit tests
```

No dependencies, no build step.

## Layout

| Path | Holds |
| --- | --- |
| `src/tasks.js` | The task store: create, list, update, remove. Pure functions over an array |
| `src/server.js` | The HTTP server: a JSON API under `/api/tasks` and the static UI |
| `public/index.html` | The browser UI |
| `test/tasks.test.js` | Tests for the store, via `node --test` |

## API

| Method | Path | Does |
| --- | --- | --- |
| `GET` | `/api/tasks` | Lists tasks |
| `POST` | `/api/tasks` | Creates a task from `{"title": "…", "due": "YYYY-MM-DD"}` (`due` is optional) |
| `PATCH` | `/api/tasks/:id` | Updates `title`, `done`, or `due` |
| `DELETE` | `/api/tasks/:id` | Removes a task |

## Good things to ask the agent for

- "Add a `due` date to each task and show it in the UI."
- "The list endpoint should support `?done=false`."
- "Add a test that creating a task without a title is rejected."
