const dotenv = require('dotenv').config({ override: true });
const dotenvExpand = require('dotenv-expand');


dotenvExpand.expand(dotenv);
// console.log('Details:: ', dotenv);
/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: parseInt(process.env.PORT ?? '4001'),
  DatabaseUrl: process.env.DATABASE_URL ?? '',
  GoogleClientID: process.env.GOOGLE_CLIENT_ID ?? '',
  GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  RefreshSecret: process.env.REFRESH_SECRET ?? '',
  AccessSecret: process.env.ACCESS_SECRET ?? '',
  Jwt: {
    Secret: process.env.JWT_SECRET ?? '',
    Exp: process.env.COOKIE_EXP ?? '', // exp at the same time as the cookie
  },
} as const;
