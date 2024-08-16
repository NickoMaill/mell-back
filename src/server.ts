import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { sanitizeXss } from './middlewares/xss';
import { AppRequest, AppResponse } from './core/controllerBase';
import handlers from './middlewares/handlers';
import initBase from './core/initBase';
import { StandardError } from './core/standardError';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { initSes } from './middlewares/session';
import moment from 'moment';
import 'moment/locale/fr';
import defaultController from './controllers/defaultController';
import mediasController from './controllers/mediasController';
import adminController from './controllers/adminController';
import showsController from './controllers/showsController';
import socialMediaController from './controllers/socialMediaController';
import logController from './controllers/logController';
import configManager from './managers/configManager';
import mapController from './controllers/mapController';
import commentsController from './controllers/commentsController';
import articlesController from './controllers/articlesController';
import newsParperProviderController from './controllers/newsParperProviderController';
import dataTextController from './controllers/dataTextController';

const server = express();
const PORT = process.env.PORT || 8000 || 8001;
// #region MIDDLEWARE -> //////////////////////////////////////////
moment.locale('fr');
server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: '10mb' }));
server.use(express.static('public'));
server.use(
    cors({
        origin: configManager.getConfig.FRONT_BASEURL,
        credentials: true,
    })
);
server.use(cookieParser());
server.use(morgan('dev'));
server.use(sanitizeXss);
server.use(
    session({
        secret: uuid().replaceAll('-', ''),
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto', httpOnly: true },
    })
);
server.use(initSes);
// #endregion -> /////////////////////////////////////////////////

// #region WATCHDOG -> ///////////////////////////////////////////
// #endregion -> /////////////////////////////////////////////////

// #region ROUTES -> /////////////////////////////////////////////
server.use('/init', defaultController.Router);
server.use('/login', adminController.Router);
server.use('/medias', mediasController.router);
server.use('/shows', showsController.router);
server.use('/social', socialMediaController.router);
server.use('/logs', logController.router);
server.use('/map', mapController.Router);
server.use('/shows/comments', commentsController.router);
server.use('/articles', articlesController.router);
server.use('/newsPaperProvider', newsParperProviderController.router);
server.use('/dataText', dataTextController.router);
// #endregion -> /////////////////////////////////////////////////

// #region COMMONS ROUTES -> /////////////////////////////////////
server.get('/', (_req: AppRequest, res: AppResponse) => {
    res.json({ message: "Welcome to Mell's website api" });
});

server.get('*', (_req: AppRequest, res: AppResponse) => {
    throw new StandardError('app.*', 'NOT_FOUND', 'not_found', 'resources not found', 'the resources you requested are not found');
});
// #endregion -> /////////////////////////////////////////////////

// #region ERROR HANDLERS -> /////////////////////////////////////
server.use(handlers.errorHandler);
// #endregion -> /////////////////////////////////////////////////

// #region SERVER INIT -> ////////////////////////////////////////
server.listen(PORT, () => initBase.initLogs(server, PORT));
// #endregion -> /////////////////////////////////////////////////
