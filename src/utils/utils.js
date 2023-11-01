import {VUE_APP_SITE} from "../config";

export const getImgUrl = (guid) => `${VUE_APP_SITE}/api/img/${guid}/`;
export const getFileUrl = (guid) => `${VUE_APP_SITE}/api/file/${guid}/`;

export const ENV = process.env.NODE_ENV
