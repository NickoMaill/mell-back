import { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import configManager from '../managers/configManager';
import logColors from '../helpers/logColors';

class InitBase {
    public initLogs(app: Express, PORT: number | string) {
        if (configManager.getConfig.NODE_ENV === 'development') {
            console.log(logColors.BgGreen, logColors.FgBlack, "[Untel's Backend configuration loaded] ⚠️ local only ⚠️", logColors.Reload);
            console.log('/////////////////////////////////////////////////////////', '\n');

            for (let variable in configManager.getConfig) {
                console.log(logColors.FgRed, `${variable.padEnd(30, ' ')}`, logColors.Reload, `= ${configManager.getConfig[variable]}`);
            }

            console.log('\n______________________________________________________________\n');
            console.warn('');

            listEndpoints(app).map((info) => {
                if (info.path === '/') {
                    info.path = 'init';
                }

                if (info.path === '*') {
                    info.path = 'error';
                }

                const nameRoute: string = `[${info.path.split('/')[0] !== 'init' && info.path.split('/')[0] !== 'error' ? info.path.split('/')[1] : info.path}]`;

                console.info(`${nameRoute.padEnd(50, ' ')}`, logColors.FgYellow, `${info.methods[0].padEnd(10)}`, logColors.Reload, `${'⇨'.padEnd(10, ' ')} "${info.path}"`);
            });

            console.warn('');
            console.warn(logColors.FgMagenta, `[${new Date().toISOString()}] ||===========================================||`, logColors.Reload);
            console.warn(logColors.FgMagenta, `[${new Date().toISOString()}] `, logColors.Reload, logColors.BgGreen, 'Untel Official Website Backend startup...', logColors.Reload);
            console.warn(logColors.FgMagenta, `[${new Date().toISOString()}] ||===========================================||`, logColors.Reload);
            console.warn('');

            if (configManager.getConfig.NODE_ENV === 'production') {
                console.log(`production server listening on Port : ${PORT} ✅`);
            } else {
                console.log(`listening on http://localhost:${PORT} ✅`);
            }
        }
    }
}

export default new InitBase();
