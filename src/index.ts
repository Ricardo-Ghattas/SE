import config from './config';
import express, { NextFunction, Request, Response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './Middlewares/requestLogger';
import routes from './routes';
import { ApiException } from './util/exceptions/ApiExceptions';
import { ItemsNotFoundException } from './util/exceptions/repositoryException';
import { ServiceException } from './util/exceptions/ServiceException';


const app = express();

// configure helmet
app.use(helmet());

// configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure cors
app.use(cors());

// configure middleware
app.use(requestLogger);

// configure routes
app.use('/', routes)

// configure 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// configure Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    void req;
    void next;
    if (err instanceof ApiException) {
        const apiExeption = err as ApiException;
        logger.error("API Exception of status %d: %s", apiExeption.status, err.message);
        res.status(apiExeption.status).json({ error: err.message });
    } else if (err instanceof ItemsNotFoundException) {
        logger.warn("Resource not found: %s", err.message);
        res.status(404).json({ error: err.message });
    } else if (err instanceof ServiceException) {
        logger.warn("Invalid request: %s", err.message);
        res.status(400).json({ error: err.message });
    } else {
        logger.error("Unhandled Error: %s", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(config.port, config.host, () => {
  logger.info(`Server is running on http://%s:%d`, config.host, config.port);
});
