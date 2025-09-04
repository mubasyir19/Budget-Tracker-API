import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mainRouter from './routes/route';

const app: Express = express();
const port = process.env.PORT || 5000;

config();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('short'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', mainRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    code: 'SUCCESS',
    message: 'Welcome to Budget Tracker API',
    data: null,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
