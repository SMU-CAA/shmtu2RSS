var express = require('express');
var logger = require('./tools/logger');
var fs = require('fs');

logger.info(`🍻 shmtu2RSS start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/events', require('./routes/events'));
app.get('/notes', require('./routes/notes'));

var socket = '/var/run/shmtu2RSS.socket'
if(fs.existsSync(socket)){
fs.unlinkSync(socket);
}
app.listen(socket);
process.on('SIGINT', () => {
fs.unlinkSync(socket);
process.exit();
});
