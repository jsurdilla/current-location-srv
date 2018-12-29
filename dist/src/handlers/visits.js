'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _respond = require('../respond');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const FUZZY_OPTIONS = {
  extract(el) {
    return el.name;
  }
};

exports.default = options => {
  const { createVisit, getById, getByUserId } = options.db;

  const handleCreateVisit = (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
      const { userId, name } = req.body;
      if (!userId || !name) {
        (0, _respond.respondWithError)(res, null, 400, 'userId and name are required');
        return;
      }

      try {
        const visit = yield createVisit({ userId, name });
        res.status(201).json(visit);
      } catch (err) {
        (0, _respond.respondWithError)(res, err, 500, 'An internal server error occurred');
      }
    });

    return function handleCreateVisit(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

  const handleGetVisits = (() => {
    var _ref2 = _asyncToGenerator(function* (req, res) {
      const { visitId, userId, searchString } = req.query;

      // ensure that either a visit ID or a userID-searchString combination exists
      if (!visitId && !(userId && searchString)) {
        (0, _respond.respondWithError)(res, null, 400, 'visitID or a userId-name combination required');
        return;
      }

      try {
        if (visitId) {
          const visit = yield getById(visitId);
          const visits = visit == null ? [] : [visit];
          res.status(200).json(visits);
        } else if (userId && searchString) {
          const visits = yield getByUserId(userId);
          const filtered = _fuzzy2.default.filter(searchString, visits, FUZZY_OPTIONS).map(function (el) {
            return el.original;
          });
          res.status(200).json(filtered);
        }
      } catch (err) {
        (0, _respond.respondWithError)(res, err, 500, 'An internal server error occurred');
      }
    });

    return function handleGetVisits(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  })();

  return {
    handleCreateVisit,
    handleGetVisits
  };
};