import express, { Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { sanitizeXss } from './middlewares/xss';
import { AppRequest, AppResponse } from './core/controllerBase';
import handlers from './middlewares/handlers';
import initBase from './core/initBase';
import { StandardError } from './core/standardError';
import defaultController from './controllers/defaultController';
import categoriesController from './controllers/categoriesController';
import mediasController from './controllers/mediasController';

const app = express();
const PORT = process.env.PORT || 8000 || 8001;

// #region MIDDLEWARE -> //////////////////////////////////////////
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(sanitizeXss);
app.use(helmet());
// #endregion -> /////////////////////////////////////////////////

// #region WATCHDOG -> ///////////////////////////////////////////
// #endregion -> /////////////////////////////////////////////////

// #region ROUTES -> /////////////////////////////////////////////
app.use('/init', defaultController.Router);
app.use('/categories', categoriesController.Router);
app.use('/medias', mediasController.Router);
// #endregion -> /////////////////////////////////////////////////

// #region COMMONS ROUTES -> /////////////////////////////////////
app.get('/', (_req: AppRequest, res: Response) => {
    if (res.contentType('html')) {
        res.sendFile(path.join(__dirname, '/views/defaultPage.html'));
    } else {
        res.json({ message: 'Welcome to Mell\'s website api' });
    }
});

app.get('*', (_req: AppRequest, res: AppResponse) => {
    if (res.contentType('html')) {
        res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
    } else {
        throw new StandardError('app.*', 'NOT_FOUND', 'not_found', 'resources not found', 'the resources you requested are not found');
    }
});
// #endregion -> /////////////////////////////////////////////////

// #region ERROR HANDLERS -> /////////////////////////////////////
app.use(handlers.errorHandler);
// #endregion -> /////////////////////////////////////////////////

// #region SERVER INIT -> ////////////////////////////////////////
app.listen(PORT, () => initBase.initLogs(app, PORT));
// #endregion -> /////////////////////////////////////////////////
