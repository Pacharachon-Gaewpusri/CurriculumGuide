// import app_js from '../Front_end/my-app/src/App.jsx'
// import '../Front_end/my-app/src/main.jsx'
// import Dashboard from '../Front_end/my-app/src/pages/Dashboard.jsx'
// import RootLayout from '../Front_end/my-app/src/layout/RootLayout.jsx'

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

app.use(express.static('../Front_end/my-app'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../Front_end/my-app/index.html'));
});

// app.use("/upload", express.static('src/upload'))

// app.use(notFound);
// app.use(errorHandler);
export default app;