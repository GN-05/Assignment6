# Books API

A REST API for managing books, built with Node.js, Express and MongoDB (Mongoose).

## How to Run

### Step 1: Install Node.js
Download it from https://nodejs.org (version 20 or later). To check, open a terminal and type:
```bash
node -v
```
You should see a version number like `v20.x.x` or higher.

### Step 2: Install the packages
Open a terminal inside the project folder and run:
```bash
npm install
```
This creates a `node_modules` folder.

### Step 3: Get a MongoDB connection string
1. Sign up for free at https://www.mongodb.com/cloud/atlas and create a free (**M0**) cluster.
2. Create a database user with a username and a password.
3. Go to **Network Access**, click **Add IP Address**, then **Allow Access from Anywhere**.
4. Go to your cluster, click **Connect**, then **Drivers**, and copy the connection string.

### Step 4: Create the `.env` file
1. In the project folder, make a copy of `.env.example` and name it `.env`.
2. Open `.env` and paste your connection string. Replace `<password>` with your real password and add `booksdb` after `.mongodb.net/`:
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/booksdb
PORT=3000
```

> `.env` is listed in `.gitignore`, so it is never pushed to GitHub.

### Step 5: Start the server
```bash
npm run dev
```
It works if the terminal shows:
```
Connected to MongoDB
Listening on http://localhost:3000
```

### Step 6: Check it in the browser
Open http://localhost:3000. You should see `[]`, which means there are no books yet.

## Book Model

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | String | Yes | not empty, max 120 characters |
| `author` | String | Yes | not empty, max 80 characters |
| `year` | Number | No | 0 or more, default `null` |
| `read` | Boolean | No | default `false` |

MongoDB also adds `_id`, `createdAt`, `updatedAt` and `__v`.

## Routes

Base URL: `http://localhost:3000`

| Method | Route | Description | Success | Errors |
|---|---|---|---|---|
| GET | `/` | Redirects to `/api/books` | 302 | - |
| GET | `/api/books` | Get all books | 200 | 500 |
| GET | `/api/books/:id` | Get one book | 200 | 400, 404, 500 |
| POST | `/api/books` | Create a book | 201 | 400, 500 |
| PUT | `/api/books/:id` | Replace a book | 200 | 400, 404, 500 |
| DELETE | `/api/books/:id` | Delete a book | 204 | 400, 404, 500 |

### GET /api/books

Response `200`:
```json
[
  {
    "_id": "6af0ad3d6688744b7df1c2f0",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "year": 1937,
    "read": true,
    "createdAt": "2026-11-08T17:11:25.984Z",
    "updatedAt": "2026-11-08T17:11:25.984Z",
    "__v": 0
  }
]
```

### GET /api/books/:id

- Response `200`: the book object (same as above).
- Response `400`: `{ "error": "Invalid id" }`
- Response `404`: `{ "error": "Book not found" }`

### POST /api/books

Request body (`year` and `read` are optional; any other fields such as `_id` are ignored):
```json
{ "title": "The Hobbit", "author": "J.R.R. Tolkien", "year": 1937, "read": true }
```
- Response `201`: the new book with its `_id`.

- Response `400` (invalid data), one message at a time:
  - `{ "error": "title is required" }`
  - `{ "error": "title must be 120 characters or less" }`
  - `{ "error": "author is required" }`
  - `{ "error": "author must be 80 characters or less" }`
  - `{ "error": "year must be a number (0 or more)" }`
  - `{ "error": "read must be true or false" }`
- Response `400` (malformed JSON): `{ "error": "Invalid JSON in request body" }`

### PUT /api/books/:id

Replaces the whole book, so `title` and `author` are required. A missing `year` or `read` goes back to its default.

Request body:
```json
{ "title": "The Hobbit (Illustrated Edition)", "author": "J.R.R. Tolkien", "year": 1937, "read": false }
```
- Response `200`: the updated book.
- Response `400`: same validation messages as POST, or `{ "error": "Invalid id" }`
- Response `404`: `{ "error": "Book not found" }`

### DELETE /api/books/:id

- Response `204`: no body.
- Response `400`: `{ "error": "Invalid id" }`
- Response `404`: `{ "error": "Book not found" }`

### Unknown routes

- Response `404`: `{ "error": "Not found" }`

## Error Handling

- The `validateBook` middleware checks the body on POST and PUT and returns `400` with a clear message.
- Only `title`, `author`, `year` and `read` are saved. The server sets `_id`, `createdAt` and `updatedAt`.
- An invalid id returns `400`. A valid id with no book returns `404`.
- Malformed JSON returns `400`.
- Database calls are wrapped in `try/catch`, so errors return `500` and the server keeps running.

## Testing

1. Keep the server running.
2. Open a **second** terminal. On Windows, use **Git Bash**, because Command Prompt breaks the quotes in the commands.
3. Add a book:
```bash
curl -i -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{"title":"The Hobbit","author":"J.R.R. Tolkien","year":1937,"read":true}'
```
4. You should see `HTTP/1.1 201 Created`. Refresh http://localhost:3000 and the book appears.

All 15 tests (every route and every error case) with their real output are in [TESTING.md](TESTING.md).