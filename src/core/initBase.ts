import { Express } from 'express';
import listEndpoints from 'express-list-endpoints';
import configManager from '../managers/configManager';
import logColors from '../helpers/logColors';
import { DatabaseCore } from './dataBaseCore';
import { StandardError } from './standardError';

class InitBase {
    public async initLogs(app: Express, PORT: number | string) {
        if (configManager.getConfig.NODE_ENV === 'development') {
            console.log(logColors.BgGreen, logColors.FgBlack, "[Mel's Backend configuration loaded] ⚠️ local only ⚠️", logColors.Reload);
            console.log('/////////////////////////////////////////////////////////', '\n');

            for (let variable in configManager.getConfig) {
                console.log(logColors.FgRed, `${variable.padEnd(30, ' ')}`, logColors.Reload, `= ${configManager.getConfig[variable]}`);
            }

            console.log('\n______________________________________________________________\n');
            console.warn('');

            listEndpoints(app).forEach((info) => {
                if (info.path === '/') {
                    info.path = 'init';
                }

                if (info.path === '*') {
                    info.path = 'error';
                }
                info.methods.forEach((r) => {
                    const nameRoute: string = `[${info.path.split('/')[0] !== 'init' && info.path.split('/')[0] !== 'error' ? info.path.split('/')[1] : info.path}]`;
                    console.info(`${nameRoute.padEnd(50, ' ')}`, logColors.FgYellow, `${r.padEnd(10)}`, logColors.Reload, `${'⇨'.padEnd(10, ' ')} "${info.path}"`);
                });
            });
            const dateStr = new Date().toISOString();
            console.warn('');
            console.warn(logColors.FgMagenta, `[${dateStr}] ||===========================================||`, logColors.Reload);
            console.warn(logColors.FgMagenta, `[${dateStr}] `, logColors.Reload, logColors.BgGreen, 'MELL Official Website Backend startup...', logColors.Reload);
            console.warn(logColors.FgMagenta, `[${dateStr}] ||===========================================||`, logColors.Reload);
            console.warn('');

            const dbCore = new DatabaseCore();
            dbCore.ping();

            if (configManager.getConfig.NODE_ENV === 'production') {
                console.log(`production server listening on Port : ${PORT} ✅`);
            } else {
                console.log(`listening on http://localhost:${PORT} ✅`);
            }
        }
    }
}

export default new InitBase();
