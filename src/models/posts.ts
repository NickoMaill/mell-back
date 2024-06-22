export class Post {
    id: number;
    postId: string;
    pictureUrl: string;
    isVideo: boolean;
    likeCount: number;
    commentCount: number;
    postText: string;
    date: Date;
    sortOrder?: number;
    addedAt: Date;
    updatedAt: Date;
}

export type PostPayload = {
    postId: string;
    pictureUrl: string;
    isVideo: boolean;
    likeCount: number;
    commentCount: number;
    postText: string;
    date: Date;
    sortOrder?: number;
};

//---------------------------------------------------------------------------

// CONTRACT

interface User {
    fbid_v2: string;
    full_name: string;
    id: string;
    is_private: boolean;
    is_verified: boolean;
    profile_pic_id: string;
    profile_pic_url: string;
    username: string;
    account_badges?: any[];
    fan_club_info?: FanClubInfo;
    feed_post_reshare_disabled?: boolean;
    has_anonymous_profile_picture?: boolean;
    is_favorite?: boolean;
    is_unpublished?: boolean;
    show_account_transparency_details?: boolean;
    third_party_downloads_enabled?: number;
    transparency_product_enabled?: boolean;
}

interface FanClubInfo {
    autosave_to_exclusive_highlight?: any;
    connected_member_count?: any;
    fan_club_id?: any;
    fan_club_name?: any;
    fan_consideration_page_revamp_eligiblity?: any;
    has_enough_subscribers_for_ssc?: any;
    is_fan_club_gifting_eligible?: any;
    is_fan_club_referral_eligible?: any;
    subscriber_count?: any;
}

interface Caption {
    content_type: string;
    created_at: number;
    created_at_utc: number;
    did_report_as_spam: boolean;
    has_translation: boolean;
    hashtags: string[];
    id: string;
    is_covered: boolean;
    is_ranked_comment: boolean;
    mentions: any[];
    private_reply_status: number;
    share_enabled: boolean;
    text: string;
    type: number;
    user: User;
    user_id: string;
}

interface AudioReattributionInfo {
    should_allow_restore: boolean;
}

interface AdditionalAudioInfo {
    additional_audio_username?: any;
    audio_reattribution_info: AudioReattributionInfo;
}

interface EntryPointContainer {
    comment: { action_type: string };
    overflow?: any;
    pill: { action_type: string; priority: number };
    ufi?: any;
}

interface ContentAppreciationInfo {
    enabled: boolean;
    entry_point_container: EntryPointContainer;
}

interface OriginalSoundInfo {
    allow_creator_to_rename: boolean;
    audio_asset_id: number;
    audio_filter_infos: any[];
    audio_parts: any[];
    audio_parts_by_filter: any[];
    can_remix_be_shared_to_fb: boolean;
    can_remix_be_shared_to_fb_expansion: boolean;
    consumption_info: ConsumptionInfo;
    duration_in_ms: number;
    formatted_clips_media_count?: any;
    hide_remixing: boolean;
    ig_artist: User;
    is_audio_automatically_attributed: boolean;
    is_eligible_for_audio_effects: boolean;
    is_explicit: boolean;
    is_original_audio_download_eligible: boolean;
    is_reuse_disabled: boolean;
    is_xpost_from_fb: boolean;
    oa_owner_is_music_artist: boolean;
    original_audio_subtype: string;
    original_audio_title: string;
    original_media_id: number;
    progressive_download_url: string;
    should_mute_audio: boolean;
    time_created: number;
    trend_rank?: any;
    xpost_fb_creator_info?: any;
}

interface ConsumptionInfo {
    display_media_id?: any;
    is_bookmarked: boolean;
    is_trending_in_clips: boolean;
    should_mute_audio_reason: string;
    should_mute_audio_reason_type?: any;
}

interface ClipsMetadata {
    achievements_info: AchievementsInfo;
    additional_audio_info: AdditionalAudioInfo;
    asset_recommendation_info?: any;
    audio_canonical_id: string;
    audio_ranking_info: AudioRankingInfo;
    audio_type: string;
    branded_content_tag_info: BrandedContentTagInfo;
    breaking_content_info?: any;
    breaking_creator_info?: any;
    challenge_info?: any;
    clips_creation_entry_point: string;
    content_appreciation_info: ContentAppreciationInfo;
    contextual_highlight_info?: any;
    cutout_sticker_info: any[];
    disable_use_in_clips_client_cache: boolean;
    external_media_info?: any;
    featured_label?: any;
    is_fan_club_promo_video: boolean;
    is_public_chat_welcome_video: boolean;
    is_shared_to_fb: boolean;
    mashup_info: MashupInfo;
    merchandising_pill_info?: any;
    music_info?: any;
    nux_info?: any;
    original_sound_info: OriginalSoundInfo;
    originality_info?: any;
    professional_clips_upsell_type: number;
    reels_on_the_rise_info?: any;
    reusable_text_attribute_string?: any;
    reusable_text_info?: any;
    shopping_info?: any;
    show_achievements: boolean;
    show_tips?: any;
    template_info?: any;
    viewer_interaction_settings?: any;
}

interface AchievementsInfo {
    num_earned_achievements?: any;
    show_achievements: boolean;
}

interface AudioRankingInfo {
    best_audio_cluster_id: string;
}

interface BrandedContentTagInfo {
    can_add_tag: boolean;
}

interface MashupInfo {
    can_toggle_mashups_allowed: boolean;
    formatted_mashups_count?: any;
    has_been_mashed_up: boolean;
    has_nonmimicable_additional_audio: boolean;
    is_creator_requesting_mashup: boolean;
    is_light_weight_check: boolean;
    is_pivot_page_available: boolean;
    mashup_type?: any;
    mashups_allowed: boolean;
    non_privacy_filtered_mashups_media_count?: any;
    original_media?: any;
    privacy_filtered_mashups_media_count?: any;
}

interface ImageVersions {
    additional_items: AdditionalItems;
    items: ImageItem[];
    scrubber_spritesheet_info_candidates: ScrubberSpritesheetInfoCandidates;
    smart_thumbnail_enabled: boolean;
}

interface AdditionalItems {
    first_frame: Frame;
    igtv_first_frame: Frame;
    smart_frame?: any;
}

interface Frame {
    height: number;
    url: string;
    width: number;
}

interface ImageItem {
    height: number;
    url: string;
    width: number;
}

interface ScrubberSpritesheetInfoCandidates {
    default: ScrubberSpritesheetInfo;
}

interface ScrubberSpritesheetInfo {
    file_size_kb: number;
    max_thumbnails_per_sprite: number;
    rendered_width: number;
    sprite_height: number;
    sprite_urls: string[];
    sprite_width: number;
    thumbnail_duration: number;
    thumbnail_height: number;
    thumbnail_width: number;
    thumbnails_per_row: number;
    total_thumbnail_num_per_sprite: number;
    video_length: number;
}

interface MediaCroppingInfo {
    square_crop: Crop;
}

interface Crop {
    crop_bottom: number;
    crop_left: number;
    crop_right: number;
    crop_top: number;
}

interface SharingFrictionInfo {
    bloks_app_url?: any;
    sharing_friction_payload?: any;
    should_have_sharing_friction: boolean;
}

interface Item {
    are_remixes_crosspostable: boolean;
    boost_unavailable_identifier?: any;
    boost_unavailable_reason?: any;
    can_reshare: boolean;
    can_save: boolean;
    caption: Caption;
    caption_is_edited: boolean;
    clips_metadata: ClipsMetadata;
    clips_tab_pinned_user_ids: any[];
    coauthor_producers: any[];
    code: string;
    comment_count: number;
    comment_inform_treatment: CommentInformTreatment;
    comment_threading_enabled: boolean;
    commerce_integrity_review_decision: string;
    commerciality_status: string;
    creator_viewer_insights: any[];
    crosspost: string[];
    deleted_reason: number;
    device_timestamp: number;
    fb_aggregated_comment_count: number;
    fb_aggregated_like_count: number;
    fb_user_tags: FbUserTags;
    fbid: string;
    featured_products: any[];
    filter_type: number;
    fundraiser_tag: FundraiserTag;
    has_audio: boolean;
    has_liked: boolean;
    has_more_comments: boolean;
    has_privately_liked: boolean;
    has_shared_to_fb: number;
    id: string;
    ig_media_sharing_disabled: boolean;
    image_versions: ImageVersions;
    inline_composer_display_condition: string;
    inline_composer_imp_trigger_time: number;
    integrity_review_decision: string;
    invited_coauthor_producers: any[];
    is_artist_pick: boolean;
    is_auto_created: boolean;
    is_comments_gif_composer_enabled: boolean;
    is_cutout_sticker_allowed: boolean;
    is_dash_eligible: number;
    is_eligible_for_media_note_recs_nux: boolean;
    is_in_profile_grid: boolean;
    is_open_to_public_submission: boolean;
    is_organic_product_tagging_eligible: boolean;
    is_paid_partnership: boolean;
    is_pinned: boolean;
    is_post_live_clips_media: boolean;
    is_quiet_post: boolean;
    is_reshare_of_text_post_app_media_in_ig: boolean;
    is_reuse_allowed: boolean;
    is_tagged_media_shared_to_viewer_profile_grid: boolean;
    is_third_party_downloads_eligible: boolean;
    is_unified_video: boolean;
    is_video: boolean;
    like_and_view_counts_disabled: boolean;
    like_count: number;
    location?: any;
    max_num_visible_preview_comments: number;
    media_cropping_info: MediaCroppingInfo;
    media_name: string;
    media_note: MediaNote;
    media_type: number;
    merchant_with_pending_order_sheets?: any;
    multi_author_posting_enabled: boolean;
    music_canonical_id?: any;
    next_max_id: string;
    number_of_qualities: number;
    open_to_public_submission_setting: OpenToPublicSubmissionSetting;
    original_media_has_visual_reply_media: boolean;
    photo_of_you: boolean;
    pinned_for_testing?: any;
    pk: string;
    play_count: number;
    preview_comments: any[];
    product_suggestions: any[];
    remix_enabled: boolean;
    remix_video_count: number;
    school?: any;
    sharing_friction_info: SharingFrictionInfo;
    show_shop_entrypoint: boolean;
    sponsor_tags: any[];
    subscribe_cta_visible: boolean;
    supports_reel_reaction: boolean;
    tagged_users: any[];
    taken_at: number;
    taken_at_ts: number;
    thumbnail_url: string;
    timeline_pinned_user_ids: number[];
    top_likers: any[];
    user: User;
    usertags: Usertags;
    video_dash_manifest: string;
    video_duration: number;
    video_versions: VideoVersion[];
    viewer_count: number;
    viewer_interaction_settings: any[];
}

interface CommentInformTreatment {
    action_type: string;
    visual_treatment: string;
}

interface FbUserTags {
    creation_time: number;
    media_id: string;
    user: FbUser;
    user_id: string;
    usertags: Usertags[];
}

interface FbUser {
    fbid_v2: string;
    full_name: string;
    id: string;
    is_private: boolean;
    is_verified: boolean;
    profile_pic_id: string;
    profile_pic_url: string;
    username: string;
}

interface FundraiserTag {
    creation_time: number;
    fundraiser: Fundraiser;
    has_sharing_friction: boolean;
    media_id: string;
    user: FbUser;
    user_id: string;
}

interface Fundraiser {
    beneficiary: Beneficiary;
    donor_display_preference: string;
    id: string;
    media_count: number;
    original_goal_amount: number;
    raised_amount: number;
    update_time: number;
}

interface Beneficiary {
    name: string;
    user: User;
}

interface MediaNote {
    height: number;
    label: string;
    url: string;
    width: number;
}

interface OpenToPublicSubmissionSetting {
    submission_setting: string;
    submission_setting_expiry_timestamp: number;
}

interface Usertags {
    in: User[];
}

interface VideoVersion {
    height: number;
    id: string;
    type: number;
    url: string;
    width: number;
}

export interface PostsRootObject {
    items: Item[];
    more_available: boolean;
    next_max_id: string;
    num_results: number;
    status: string;
}
