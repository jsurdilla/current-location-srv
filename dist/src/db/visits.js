'use strict';

var _pg = require('pg');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const pool = new _pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const INSERT_VISIT_SQL = `
  INSERT INTO visits (user_id, name)
  VALUES ($1, $2)
  RETURNING *`;

const SELECT_BY_ID = `
  SELECT *
  FROM visits
  WHERE visit_id = $1`;

const SELECT_BY_USER_ID = `
  SELECT *
  FROM visits
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT $2`;

const MAPPING = {
  user_id: 'userId',
  visit_id: 'visitId'
};

const camelCase = event => {
  const e = event;
  Object.entries(MAPPING).forEach(([k1, k2]) => {
    e[k2] = event[k1];
    delete e[k1];
  });

  return e;
};

const createVisit = (() => {
  var _ref = _asyncToGenerator(function* ({ userId, name }) {
    return new Promise((() => {
      var _ref2 = _asyncToGenerator(function* (resolve, reject) {
        try {
          const res = yield pool.query(INSERT_VISIT_SQL, [userId, name]);
          resolve(camelCase(res.rows[0]));
        } catch (err) {
          reject(err);
        }
      });

      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    })());
  });

  return function createVisit(_x) {
    return _ref.apply(this, arguments);
  };
})();

const getById = (() => {
  var _ref3 = _asyncToGenerator(function* (visitId) {
    return new Promise((() => {
      var _ref4 = _asyncToGenerator(function* (resolve, reject) {
        try {
          const res = yield pool.query(SELECT_BY_ID, [visitId]);
          if (res.rowCount === 0) {
            resolve(null);
            return;
          }
          resolve(camelCase(res.rows[0]));
        } catch (err) {
          reject(err);
        }
      });

      return function (_x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    })());
  });

  return function getById(_x4) {
    return _ref3.apply(this, arguments);
  };
})();

const getByUserId = (() => {
  var _ref5 = _asyncToGenerator(function* (userId, { limit } = { limit: 5 }) {
    return new Promise((() => {
      var _ref6 = _asyncToGenerator(function* (resolve, reject) {
        try {
          const res = yield pool.query(SELECT_BY_USER_ID, [userId, limit]);
          resolve(res.rows.map(function (v) {
            return camelCase(v);
          }));
        } catch (err) {
          reject(err);
        }
      });

      return function (_x8, _x9) {
        return _ref6.apply(this, arguments);
      };
    })());
  });

  return function getByUserId(_x7) {
    return _ref5.apply(this, arguments);
  };
})();

module.exports = {
  createVisit,
  getById,
  getByUserId
};