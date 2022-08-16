const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2);

// Fetch data from gamemaster
const data = require('./data/data');
data.startServer();

// Routes
app.use(require('./routes/routes'));

app.use('/', serveStatic(path.join(__dirname, '/dist')));

// Listen port
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});