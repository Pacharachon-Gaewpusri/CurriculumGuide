import app_js from '../src/App.jsx'
import '../src/main.jsx'
import Dashboard from '../src/pages/Dashboard.jsx'
import RootLayout from '../src/layout/RootLayout.jsx'

import express from "express";
import path from 'path';
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.static('../dist'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});

// app.get('/api/dashboard', (req, res) => {
//   res.json({ message: 'Dashboard API endpoint' });
// });

// app.use("/upload", express.static('src/upload'))

// app.use(notFound);
// app.use(errorHandler);
export default app;