import { Router } from 'express';
import logManager from '~/managers/logManager';
import { AppRequest, AppResponse } from '../core/controllerBase';
import puppeteer from 'puppeteer';
import { CommentPayload } from '~/models/shows';

class DefaultController {
    private readonly Route = Router();
    constructor() {
        this.Route.get('/', this.init);
        this.Route.get('/scrapp', this.scrapp);
    }
    private init(_req: AppRequest, res: AppResponse) {
        logManager.info('defaultController.get', 'default init route requested');
        res.json({ message: 'Default init route' });
    }
    private async scrapp(req: AppRequest, res: AppResponse) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Va à la page spécifiée
        await page.goto('https://www.billetreduc.com/309278/evtcrit.htm?CRITIQUESpg=4', {
            waitUntil: 'networkidle2',
        });
        
        // Récupère le contenu de chaque div ayant la classe 'crit'
        const comments: CommentPayload[] = await page.evaluate(() => {
            // Sélectionne toutes les divs avec la classe 'crit'
            const foundedComments: CommentPayload[] = [];
            const critDivs = document.querySelectorAll('.crit');
            Array.from(critDivs).forEach((el: HTMLElement) => {
                const com: CommentPayload = {
                    title: (el.children[1] as HTMLElement).innerText.replace("-", ""),
                    name: (el.children[0].children[0] as HTMLElement).innerText,
                    rating: Number((el.children[2].children[0] as HTMLElement).title.split("/")[0]),
                    description: el.childNodes[8].textContent.trim(),
                    showId: 1
                }
                foundedComments.push(com);
            });
            return foundedComments;
        });
        // Ferme le navigateur
        await browser.close();
        res.json(comments);
    }
    public get Router() {
        return this.Route;
    }
}

export default new DefaultController();
