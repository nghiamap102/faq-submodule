/**
 * All available routes for the app
 */

export const baseUrl = '/ognl';

export const adminUrl = '/ognl/admin';

// Frontend Area

export const OGNL_HOME = `${baseUrl}/home`;

export const POST_DETAIL = `${OGNL_HOME}/post`;

export const POSTS_DETAIL = `${OGNL_HOME}/posts`;

export const PAGE_DETAIL = `${OGNL_HOME}/page`;

// Admin Area

export const OGNL_ADMIN = `${adminUrl}`;

export const DASHBOARD = `${adminUrl}/dashboard`;

export const APP_CONFIG = `${adminUrl}/app-config`;

export const POSTS_MANAGER = `${adminUrl}/posts`;

export const CATEGORIES_MANAGER = `${adminUrl}/categories`;

export const TAGS_MANAGER = `${adminUrl}/tags`;

export const PAGES_MANAGER = `${adminUrl}/pages`;

export const MEDIAS_MANAGER = `${adminUrl}/medias`;

export const DOCUMENTS_MANAGER = `${adminUrl}/documents`;

export const CONFIGURATION_MANAGER = `${adminUrl}/configuration`;
