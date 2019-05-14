const { request } = require('https');
const { parse } = require('url');

const url = parse(
  `https://angular.app.sbb.ch/${process.env.NORMALIZED_BRANCH_NAME}`
);
return new Promise((resolve, reject) =>
  request(
    {
      ...url,
      method: 'POST',
      headers: { authorization: process.env.STAGING_AUTH }
    },
    res => res.on('end', () => resolve())
  ).on('error', e => reject(e))
);
