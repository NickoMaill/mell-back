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
import mediasController from './controllers/mediasController';
import adminController from './controllers/adminController';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { initSes } from './middlewares/session';
import { checkAuth } from './middlewares/auth';
import moment from 'moment';
import showsController from './controllers/showsController';

const app = express();
const PORT = process.env.PORT || 8000 || 8001;

// #region MIDDLEWARE -> //////////////////////////////////////////
moment.locale("fr");
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(sanitizeXss);
app.use(helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: [
            "'self'", 
            'https://cdn.jsdelivr.net', 
            "unsafe-inline", 
            "'nonce-YLNVC6eGpoz9BIwWyWTm50GXqOLqgilQ'", 
            "https://cdnjs.cloudflare.com",
        ],
    }
}));
app.use(session({
    secret: uuid().replaceAll("-", ""),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto", httpOnly: true, }
}));
app.use(initSes);
// #endregion -> /////////////////////////////////////////////////

// #region WATCHDOG -> ///////////////////////////////////////////
// #endregion -> /////////////////////////////////////////////////

// #region ROUTES -> /////////////////////////////////////////////
app.use('/init', defaultController.Router);
app.use('/login', handlers.noCacheMiddleware, checkAuth, adminController.Router);
app.use('/medias', mediasController.Router);
app.use('/shows', showsController.Router);
// #endregion -> /////////////////////////////////////////////////

// #region COMMONS ROUTES -> /////////////////////////////////////
app.get('/', (_req: AppRequest, res: AppResponse) => {
    if (res.contentType('html')) {
        res.sendFile(path.join(__dirname, '/views/defaultPage.html'));
    } else {
        res.json({ message: 'Welcome to Mell\'s website api' });
    }
});
app.get("/test", async (_req: AppRequest, res: AppResponse) => {
    // await communicationManager.sendMfa("nicomaillols@gmail.com", "076543");
    res.json(true);
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
