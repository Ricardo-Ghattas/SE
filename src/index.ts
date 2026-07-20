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
import { HttpException } from './util/exceptions/Http/httpException';


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
// After: Enhanced Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ( err instanceof HttpException) {
        const httpException = err as HttpException;
        // Log includes name, status, message, and details
        logger.error(" %s [%d] \"%s\" %o", httpException.name, httpException.status, httpException.message, httpException.details || {});
        // Response includes message and details
        res.status(httpException.status).json({
            message: httpException.message,
            details: httpException.details || undefined
        });
    } else {
        logger.error("Unhandled Error: %s", err.message);
        res.status(500).json({ 
            message: "Internal Server Error"
        });
    }
})
app.listen(config.port, config.host, () => {
  logger.info(`Server is running on http://%s:%d`, config.host, config.port);
});
