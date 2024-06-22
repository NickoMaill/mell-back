import fetch from "node-fetch";
import { Post, PostPayload, PostsRootObject } from "~/models/posts";
import feedModule from "~/module/feedModule";
import { DatabaseCoreQuery } from "~/core/coreApiTypes";
import FeedModule from "~/module/feedModule";

class SocialManager {

    // public --> start region /////////////////////////////////////////////
    public async fetchInstagramPosts(page: string = "") {
        const request = await fetch(
            `https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts?username_or_id_or_url=mell_humour&url_embed_safe=true${page !== "" ? `&pagination_token=${page}` : ""}`, 
            {
                method: "GET",
                headers: {
                    'x-rapidapi-key': 'f8e155da39mshb4bb9c73c1e3bd6p15dcb5jsn925cb7e1ab14',
                    'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
                }
            }
        )
        const response: { data: PostsRootObject, pagination_token: string } = await request.json();
        const posts: { pageToken: string; content: PostPayload[] } =
        {
            pageToken: response.pagination_token,
            content: response.data.items.map(p => {
                return {
                    postId: p.code,
                    postText: p.caption?.text ?? "",
                    pictureUrl: p.thumbnail_url,
                    isVideo: p.is_video,
                    likeCount: p.like_count,
                    commentCount: p.comment_count,
                    date: new Date(p.taken_at * 1000)
                }
            })
        }
        return posts;
    }

    public async fetchAllInstagramPosts(): Promise<PostPayload[]> {
        let posts = [];
        let i = 0;
        let sortOrder = 0;
        let pageToken = "";
        while (i < 5) {
            const fetchedPosts = await this.fetchInstagramPosts(pageToken);
            pageToken = fetchedPosts.pageToken;
            fetchedPosts.content.forEach(p => { p.sortOrder = sortOrder; sortOrder++ })
            posts = [...posts, ...fetchedPosts.content];
            i++;
        }
        return posts;
    }

    public async appendPostsInDB(posts: PostPayload[]) {
        const feed = new FeedModule();
        posts.forEach(async (p) => {
            feed.setPayload(p);
            await feed.performNewPublic();
        })
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new SocialManager();