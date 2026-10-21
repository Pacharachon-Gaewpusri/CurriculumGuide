import app_js from '../src/App.jsx'
import '../src/main.jsx'
import Dashboard from '../src/pages/Dashboard.jsx'
import RootLayout from '../src/layout/RootLayout.jsx'
import { fileURLToPath } from 'url';

import express from "express";
import path from 'path';
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5175;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/CurriculumGuide/', (req, res) => {
  res.sendFile(path.resolve('../src/index.html'));
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.static('../src'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../src/index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve('../src/pages/Dashboard.jsx'));
});
app.get('/CurriculumGuide/', (req, res) => {
  res.sendFile(path.resolve('../src/pages/App.jsx'));
});
app.use("/upload", express.static('../src/upload'))

app.get('/api/dashboard', (req, res) => {
  res.json({ message: 'Dashboard API endpoint' });
});
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // Point to Vite's output "dist" folder
  app.use(express.static(path.join(__dirname, '../dist')));

  // Fallback to index.html for Single Page Applications (SPAs)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




app.use(notFound);
app.use(errorHandler);
export default app;