export interface IConfigEnv {
    NODE_ENV?;
    FRONT_BASEURL?;
    API_BASEURL?;
    SHOW_ERROR_DETAILS?;
    SECRET_REFRESH?;
    ACCESS_SECRET?;
    HTTPS?;
    BREVO_APIKEY?;
    BREVO_LIST_ID?;
    BREVO_ORDER_TEMPLATE_ID?;
    BREVO_SENDER?;
    BREVO_USER_MAIL?;
    [key: string]: any;
}
