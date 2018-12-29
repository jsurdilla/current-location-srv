'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _visits = require('./db/visits');

var _visits2 = _interopRequireDefault(_visits);

var _visits3 = require('./handlers/visits');

var _visits4 = _interopRequireDefault(_visits3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { createVisit, getById, getByUserId } = _visits2.default;

const app = (0, _express2.default)();
const port = process.env.PORT || 3000;

app.use(_bodyParser2.default.json());

const visitsHandler = (0, _visits4.default)({
  db: {
    createVisit, getById, getByUserId
  }
});

app.post('/visit', visitsHandler.handleCreateVisit);
app.get('/visit', visitsHandler.handleGetVisits);

app.listen(port);