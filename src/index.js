import express from 'express';
import bodyParser from 'body-parser';

import visitsDb from './db/visits';
import visits from './handlers/visits';

const { createVisit, getById, getByUserId } = visitsDb;

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const visitsHandler = visits({
  db: {
    createVisit, getById, getByUserId,
  },
});

app.post('/visit', visitsHandler.handleCreateVisit);
app.get('/visit', visitsHandler.handleGetVisits);

app.listen(port);
