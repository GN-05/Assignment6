# Testing with curl

Start the server with `npm run dev`, then run these commands in a second terminal. Replace the id with the `_id` you get from test 1. Each block shows the command and its real output.

> On Windows, use **Git Bash**. Command Prompt does not understand the single quotes `'...'` and the server will reply `Invalid JSON in request body`.

## CRUD routes

### 1. Create a book (201)
```bash
$ curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit","author":"J.R.R. Tolkien","year":1937,"read":true}'
HTTP/1.1 201 Created
{"title":"The Hobbit","author":"J.R.R. Tolkien","year":1937,"read":true,"_id":"6af1b0ca2767199b8ad882f2","createdAt":"2026-11-09T11:38:50.482Z","updatedAt":"2026-11-09T11:38:50.482Z","__v":0}
```

### 2. Create a second book with only the required fields (201)
```bash
$ curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Frank Herbert"}'
HTTP/1.1 201 Created
{"title":"Dune","author":"Frank Herbert","year":null,"read":false,"_id":"6af1b0ca2767199b8ad882f3","createdAt":"2026-11-09T11:38:50.552Z","updatedAt":"2026-11-09T11:38:50.552Z","__v":0}
```

### 3. Get all books (200)
```bash
$ curl -i http://localhost:3000/api/books
HTTP/1.1 200 OK
[{"_id":"6af1b0ca2767199b8ad882f3","title":"Dune","author":"Frank Herbert","year":null,"read":false,"createdAt":"2026-11-09T11:38:50.552Z","updatedAt":"2026-11-09T11:38:50.552Z","__v":0},{"_id":"6af1b0ca2767199b8ad882f2","title":"The Hobbit","author":"J.R.R. Tolkien","year":1937,"read":true,"createdAt":"2026-11-09T11:38:50.482Z","updatedAt":"2026-11-09T11:38:50.482Z","__v":0}]
```

### 4. Get one book (200)
```bash
$ curl -i http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2
HTTP/1.1 200 OK
{"_id":"6af1b0ca2767199b8ad882f2","title":"The Hobbit","author":"J.R.R. Tolkien","year":1937,"read":true,"createdAt":"2026-11-09T11:38:50.482Z","updatedAt":"2026-11-09T11:38:50.482Z","__v":0}
```

### 5. Update a book (200)
```bash
$ curl -i -X PUT http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2 \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit (Illustrated Edition)","author":"J.R.R. Tolkien","year":1937,"read":false}'
HTTP/1.1 200 OK
{"_id":"6af1b0ca2767199b8ad882f2","title":"The Hobbit (Illustrated Edition)","author":"J.R.R. Tolkien","year":1937,"read":false,"createdAt":"2026-11-09T11:38:50.482Z","updatedAt":"2026-11-09T11:38:50.591Z","__v":0}
```

### 6. Delete a book (204)
```bash
$ curl -i -X DELETE http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2
HTTP/1.1 204 No Content
```

## Error cases

### 7. Create with invalid data (400)
```bash
$ curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"","year":"abc","read":"yes"}'
HTTP/1.1 400 Bad Request
{"error":"title is required"}
```

### 8. Create with read as text (400)
```bash
$ curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Frank Herbert","read":"yes"}'
HTTP/1.1 400 Bad Request
{"error":"read must be true or false"}
```

### 9. Create with malformed JSON (400)
```bash
$ curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Dune",'
HTTP/1.1 400 Bad Request
{"error":"Invalid JSON in request body"}
```

### 10. Get a book with an invalid id (400)
```bash
$ curl -i http://localhost:3000/api/books/123
HTTP/1.1 400 Bad Request
{"error":"Invalid id"}
```

### 11. Get a book that was deleted (404)
```bash
$ curl -i http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2
HTTP/1.1 404 Not Found
{"error":"Book not found"}
```

### 12. Update with a missing required field (400)
```bash
$ curl -i -X PUT http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2 \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune"}'
HTTP/1.1 400 Bad Request
{"error":"author is required"}
```

### 13. Update a book that was deleted (404)
```bash
$ curl -i -X PUT http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2 \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Frank Herbert"}'
HTTP/1.1 404 Not Found
{"error":"Book not found"}
```

### 14. Delete a book that was already deleted (404)
```bash
$ curl -i -X DELETE http://localhost:3000/api/books/6af1b0ca2767199b8ad882f2
HTTP/1.1 404 Not Found
{"error":"Book not found"}
```

### 15. Unknown route (404)
```bash
$ curl -i http://localhost:3000/api/unknown
HTTP/1.1 404 Not Found
{"error":"Not found"}
```