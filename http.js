class Request {
    constructor(path, method, headers) {
        this.path = path;
        this.method = method;
        this.headers = headers;
    }
};

function parseRequest(data) {
    let lines = data.toString().split('\r\n');

    let requestLine = lines[0].split(' ');
    let method = requestLine[0];
    let path = requestLine[1];

    if(!Object.values(Methods).includes(method)) {
        return null;
    }

    let request = new Request(path, method, {});

    lines.forEach(line => {
        let parts = line.split(': ');
        let key = parts[0];
        let value = parts[1];

        if (parts.length > 1) {
            request.headers[key] = value;
        }
    });

    return request;
}

class Response {
    constructor(statusCode, headers, body) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;

        Object.assign(this.headers, {
            'Content-Type': 'text/html',
            'Content-Length': Buffer.byteLength(body),
            'Connection': 'close',
            'Date': new Date().toUTCString(),
            'Server': 'DumbHTTPD',
        });
    }

    stringify() {
        let response = `HTTP/1.1 ${this.statusCode} ${this.statusCodeText}\r\n`;
        Object.keys(this.headers).forEach(header => {
            response += `${header}: ${this.headers[header]}\r\n`;
        });
        response += '\r\n';
        response += this.body;
        return response;
    }

    send(client) {
        client.write(this.stringify());
    }
};

const Methods = {
  GET: 'GET'
};

module.exports = {
    Request,
    Response,
    Methods,

    parseRequest,
};
