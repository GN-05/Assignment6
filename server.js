import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { Book } from './models/Book.js';

const dbUri = process.env.MONGODB_URI;
const port = Number(process.env.PORT) || 3000;

const app = express();

function logger(req, res, next) {
  const time = new Date().toLocaleTimeString();
  console.log(`${time} ${req.method} ${req.path}`);
  next();
}

function validateBook(req, res, next) {
  const { title, author, year, read } = req.body || {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (title.trim().length > 120) {
    return res.status(400).json({ error: 'title must be 120 characters or less' });
  }
  if (typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'author is required' });
  }
  if (author.trim().length > 80) {
    return res.status(400).json({ error: 'author must be 80 characters or less' });
  }
  if (year !== undefined && (typeof year !== 'number' || year < 0)) {
    return res.status(400).json({ error: 'year must be a number (0 or more)' });
  }
  if (read !== undefined && typeof read !== 'boolean') {
    return res.status(400).json({ error: 'read must be true or false' });
  }
  next();
}

app.use(logger);
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/api/books');
});

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/books', validateBook, async (req, res) => {
  try {
    const { title, author, year, read } = req.body;
    const book = await Book.create({ title, author, year, read });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/books/:id', validateBook, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const { title, author, year, read } = req.body;
    const book = await Book.findByIdAndUpdate(
      id,
      { title, author, year: year ?? null, read: read ?? false },
      { returnDocument: 'after', runValidators: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: 'Invalid JSON in request body' });
});

try {
  await mongoose.connect(dbUri);
  console.log('Connected to MongoDB');
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
} catch (err) {
  console.error('DB connection failed:', err.message);
  process.exit(1);
}