import { AppRequest, AppResponse } from "~/core/controllerBase";
import socialManager from '~/managers/socialManager';
import GenericController from "./tableController";
import { Post, PostPayload } from "~/models/posts";
import FeedModule from "~/module/feedModule";

class SocialMediaController extends GenericController<Post, PostPayload> {
    constructor() {
        super(FeedModule);
        this.router.get("/fetchPosts", this.fetchPosts);
    }
    private async fetchPosts(_req: AppRequest, res: AppResponse) {
        const posts = await socialManager.fetchAllInstagramPosts();
        await socialManager.appendPostsInDB(posts);
        res.json({ success: true });
    }
}
export default new SocialMediaController();