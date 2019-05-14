const { request } = require('https');
const { parse } = require('url');
const { normalizedBranch } = require('./prepublish');

const url = parse(
  `https://angular.app.sbb.ch/${normalizedBranch}`
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
