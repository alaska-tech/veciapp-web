const { name: APP_NAME, version: APP_VERSION } = require("../../package.json");
const ENVIRONMENT = process.env.NODE_ENV ?? "";

export const loggedUserInfoKey =
  APP_NAME + " " + APP_VERSION + " " + ENVIRONMENT + " " + "loggedUserInfoKey";
export const JWTKey =
  APP_NAME + " " + APP_VERSION + " " + ENVIRONMENT + " " + "JWTKey";
