import puppeteer from 'puppeteer';
import { DatabaseCoreQuery, initCoreQuery } from '~/core/coreApiTypes';
import tools from '~/helpers/tools';
import { CommentPayload, Show, ShowPayloadType } from '~/models/shows';
import showsModule from '~/module/showsModule';
import moviesModule from '~/module/showsModule';

class ShowManager {
    // public --> start region /////////////////////////////////////////////
    public async getShow(id: number) {
        const movie = await moviesModule.getOne(id);
        return movie;
    }

    public async addShow(payload: ShowPayloadType) {
        
    }
    
    public async getAnyShows(query: any) {
        const movies = await moviesModule.getAny(query);
        return movies;
    }

    public async downloadShowComments(url: string, showId: number): Promise<CommentPayload[]> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        const comments: CommentPayload[] = await page.evaluate(() => {
            const foundedComments: CommentPayload[] = [];
            const critDivs = document.querySelectorAll('.crit');
            Array.from(critDivs).forEach((el: HTMLElement) => {
                const com: CommentPayload = {
                    title: (el.children[1] as HTMLElement).innerText.replace("-", ""),
                    name: (el.children[0].children[0] as HTMLElement).innerText,
                    rating: Number((el.children[2].children[0] as HTMLElement).title.split("/")[0]),
                    description: el.childNodes[8].textContent.trim(),
                    showId: null,
                    date: new Date((el.children[6] as HTMLElement).innerText.split("le ")[1])
                }
                foundedComments.push(com);
            });
            return foundedComments;
        });
        comments.forEach(c => c.showId = showId);
        await browser.close();
        return comments;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new ShowManager();
