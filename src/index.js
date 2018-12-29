import express from 'express';
import bodyParser from 'body-parser';

import { createVisit, getById, getByUserId } from '../db/visits';

const app = express();
const port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

app.post('/visit', async (req, res) => {
  try {
    const visit = await createVisit({
      userId: req.body.userId,
      locationName: req.body.name,
    });

    res.status(201)
      .json(visit)
      .end();
  } catch (err) {
    res.status(500);
    res.json({
      code: 500,
      message: 'An internal error occurred.',
    });
    res.end();
  }
});

app.get('/visit', async (req, res) => {
  const { visitId, userId, searchString } = req.query;

  try {
    let visits;
    if (visitId) {
      const visit = await getById(visitId);
      visits = [visit];
    } else if (userId && searchString) {
      visits = await getByUserId(userId);
    } else {
      res.status(400);
      res.json({ code: 400, message: 'visitID or a userId-name combination required' });
      res.end();
      return;
    }

    res.status(200);
    res.json(visits);
    res.end();
  } catch (err) {
    res.status(500);
    res.json({
      code: 500,
      message: 'An internal error occurred.',
    });
    res.end();
  }
});

app.listen(port);
