const Server = require('./server');

const server = new Server('0.0.0.0', 8080);
server.start();
