// import '../Front_end/src/App.jsx'

import express from "express";
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

// app.use("/upload", express.static('src/upload'))

// app.use(notFound);
// app.use(errorHandler);


export default app;