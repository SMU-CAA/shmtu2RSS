var express = require('express');
var logger = require('./tools/logger');

logger.info(`🍻 shmtu2RSS start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/events', require('./routes/events'));
app.get('/notes', require('./routes/notes'));
app.listen(1203);