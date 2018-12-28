import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json())

// auto-incrementing visit ID
let id = 1;

let visits = [];

app.post('/visit', (req, res) => {
    const visit = req.body;
    visit.visitId = `visit-${id}`;
    id++;

    visits.push(visit);

    res.status(201)
        .json(visit)
        .end();
});

app.get('/visit', (req, res) => {
    const visitId = req.query.visitId;
    const visit = visits.find(v => v.visitId === visitId);

    res.status(200);
    res.json(visit);
    res.end();
});

app.listen(port);