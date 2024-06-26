import express from 'express';
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
import mediasController from './controllers/mediasController';
import adminController from './controllers/adminController';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { initSes } from './middlewares/session';
import moment from 'moment';
import showsController from './controllers/showsController';
import socialMediaController from './controllers/socialMediaController';
import logController from './controllers/logController';
import configManager from './managers/configManager';

const server = express();
const PORT = process.env.PORT || 8000 || 8001;
// #region MIDDLEWARE -> //////////////////////////////////////////
moment.locale("fr");
server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: '10mb' }));
server.use(express.static('public'));
server.use(cors({
    origin: configManager.getConfig.FRONT_BASEURL,
    credentials: true
  }));
server.use(cookieParser());
server.use(morgan('dev'));

server.use(sanitizeXss);
// server.use(helmet.contentSecurityPolicy({
//     directives: {
//         scriptSrc: [
//             "'self'", 
//             'https://cdn.jsdelivr.net', 
//             "unsafe-inline", 
//             "'nonce-YLNVC6eGpoz9BIwWyWTm50GXqOLqgilQ'", 
//             "https://cdnjs.cloudflare.com",
//         ],
//     }
// }));
server.use(session({
    secret: uuid().replaceAll("-", ""),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto", httpOnly: true, }
}));
server.use(initSes);
// #endregion -> /////////////////////////////////////////////////

// #region WATCHDOG -> ///////////////////////////////////////////
// #endregion -> /////////////////////////////////////////////////

// #region ROUTES -> /////////////////////////////////////////////
server.use('/init', defaultController.Router);
server.use('/login', adminController.Router);
server.use('/medias', mediasController.Router);
server.use('/shows', showsController.router);
server.use('/social', socialMediaController.router);
server.use('/logs', logController.router);
// #endregion -> /////////////////////////////////////////////////

// #region COMMONS ROUTES -> /////////////////////////////////////
server.get('/', (_req: AppRequest, res: AppResponse) => {
    if (res.contentType('html')) {
        res.sendFile(path.join(__dirname, '/views/defaultPage.html'));
    } else {
        res.json({ message: 'Welcome to Mell\'s website api' });
    }
});
server.get("/test", async (_req: AppRequest, res: AppResponse) => {
    // await communicationManager.sendMfa("nicomaillols@gmail.com", "076543");
    res.json(true);
});

server.post('/test-form', (req, res) => {
    console.log(req.body);
    res.send(`Received form data: ${JSON.stringify(req.body)}`);
});

server.get('*', (_req: AppRequest, res: AppResponse) => {
    if (res.contentType('html')) {
        res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
    } else {
        throw new StandardError('app.*', 'NOT_FOUND', 'not_found', 'resources not found', 'the resources you requested are not found');
    }
});
// #endregion -> /////////////////////////////////////////////////

// #region ERROR HANDLERS -> /////////////////////////////////////
server.use(handlers.errorHandler);
// #endregion -> /////////////////////////////////////////////////

// #region SERVER INIT -> ////////////////////////////////////////
server.listen(PORT, () => initBase.initLogs(server, PORT));
// #endregion -> /////////////////////////////////////////////////
