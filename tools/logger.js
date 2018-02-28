var log4js = require('log4js');
log4js.configure({
    appenders: {
        shmtu2RSS: {
            type: 'file',
            filename: 'logs/shmtu2RSS.log',
            maxLogSize: 2048,
            backups: 3,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: { default: { appenders: ['shmtu2RSS', 'console'], level: 'INFO' } }
});
var logger = log4js.getLogger('shmtu2RSS');

module.exports = logger;