const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
//routes
const index = require('./Routes/index');

const app = express();

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'Public/Pages'));
app.set('view engine', 'ejs');

app.use('/Public',express.static(path.join(__dirname, '/Public')));
app.use('/', index);

let server = app.listen(443, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});