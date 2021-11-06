const net = require('net');
const http = require('./http');

module.exports = class Server {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    accept(client) {
        client.on('data', (data) => {
            let request = http.parseRequest(data);

            if (!request) {
                let response = new http.Response(400, {},
                `
                <!doctype html>
                <html>
                    <head>
                        <title>Bad Request</title>
                    </head>
                    <body>
                        <h1>Bad Request</h1>
                    </body>
                </html>
                `);

                response.send(client);
            } else {

                let response = new http.Response(200, {},
                `
                <!doctype html>
                <html>
                    <head>
                        <title>Hello World</title>
                    </head>
                    <body>
                        <h1>Hello World</h1>
                    </body>
                </html>
                `);

                response.send(client);
            }
        });
    }

    start() {
        this.server = net.createServer(this.accept);
        this.server.listen(this.port, this.host);
    }
};
