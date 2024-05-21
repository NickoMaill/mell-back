import { Router } from 'express';
import puppeteer, { launch } from 'puppeteer';
import { AppRequest, AppResponse } from '~/core/controllerBase';
import logManager from '~/managers/logManager';
import { CategoryPayload } from '~/models/categories';
import categoryModule from '~/module/categoryModule';

class CategoriesController {
    private readonly Route = Router();
    constructor() {
        this.Route.get('/', this.init);
        this.Route.get('/all', this.getAll);
        this.Route.post('/', this.insertOne);
        this.Route.get('/scrapp', this.scrapp);
    }

    private init(_req: AppRequest, res: AppResponse) {
        logManager.info('categoriesController.init', 'default init route requested');
        res.json({ message: 'Default init route' });
    }

    private async getAll(_req: AppRequest, res: AppResponse) {
        const cat = await categoryModule.getCategories({});
        res.json(cat);
    }

    private async insertOne(req: AppRequest<CategoryPayload>, res: AppResponse) {
        const payload = req.body;
        await categoryModule.addItem(payload);
        res.json({ success: true });
    }

    private async scrapp(req: AppRequest, res: AppResponse) {
        // Lancement du navigateur Puppeteer
        const browser = await puppeteer.launch({ headless: false });

        // Ouvrir une nouvelle page
        const page = await browser.newPage();

        // URL de la page à scraper
        const url = 'https://www.imdb.com/title/tt0120915/';

        // Naviguer jusqu'à l'URL
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        });

        // // Attendre que la page soit entièrement chargée
        //await page.waitForSelector(".hero__primary-text");
        // await page.waitForSelector(".story-line__plot");
        const bodyHandle = await page.$('body');
        const html = await page.evaluate((body) => body.innerHTML, bodyHandle);

        // Récupérer le titre du film
        const title = await page.evaluate(() => {
            const titleElement = document.querySelector('.hero__primary-text') as HTMLElement;
            return titleElement ? titleElement.innerText.trim() : 'Titre non trouvé';
        });

        // Récupérer le résumé du film
        const summary = await page.evaluate(() => {
            const summaryElement = document.querySelector('.sc-7193fc79-1') as HTMLElement;
            return summaryElement ? summaryElement.innerText.trim() : 'Résumé non trouvé';
        });

        const genre = await page.evaluate(() => {
            const element = document.querySelector('.ipc-chip-list__scroller') as HTMLElement;
            const out = [];
            Array.from(element.children).forEach((el: HTMLAnchorElement) => {
                out.push((el.children[0] as HTMLSpanElement).innerText);
            });
            return out.join(', ');
        });

        // const quotes = await page.evaluate(() => {
        //   // Fetch the first element with class "quote"
        //   const quote = document.querySelector(".quote") as HTMLElement;

        //   // Fetch the sub-elements from the previously fetched quote element
        //   // Get the displayed text and return it (`.innerText`)
        //   const text = (quote.querySelector(".text") as HTMLElement).innerText;
        //   const author = (quote.querySelector(".author") as HTMLElement).innerText;

        //   return { text, author };
        // });

        // Afficher le titre et le résumé du film
        console.log('Titre du film:', title);
        console.log('Résumé du film:', summary);
        console.log('Genres:', genre);
        //console.log(quotes);

        // Fermer le navigateur Puppeteer
        await browser.close();
        res.json({ success: true });
    }

    public get Router() {
        return this.Route;
    }
}
export default new CategoriesController();
