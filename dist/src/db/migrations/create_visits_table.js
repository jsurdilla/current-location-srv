'use strict';

var _pg = require('pg');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const pool = new _pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const CREATE_VISITS = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  CREATE TABLE IF NOT EXISTS "visits" (
      "visit_id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      "user_id"  text NOT NULL,
      "name"     text NOT NULL,
  
      "created_at" timestamp NOT NULL DEFAULT (now() at time zone 'UTC')
  );`;

_asyncToGenerator(function* () {
  const client = yield pool.connect();
  try {
    yield client.query(CREATE_VISITS);
  } finally {
    client.release();
  }
})().catch(e => console.log(e.stack)); // eslint-disable-line no-console