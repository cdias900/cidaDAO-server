import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import routes from './routes';

class App {
  public express: express.Application;

  private dbUrl: string;

  public constructor() {
    this.express = express();
    this.dbUrl = process.env.DATABASE_URL || '';
    this.middlewares();
    this.database();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private database(): void {
    mongoose.connect(
      this.dbUrl,
      {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      },
      (err) => console.log(err ? `Error in DB connection: ${JSON.stringify(err, undefined, 2)}` : 'Database connection succeded.')
    );
  }

  private routes(): void {
    this.express.use('/api', routes);
  }
}

export default new App().express;
