import http from "http";
import websocket from "websocket";
import fs from "fs";
import url from "url";

const clientHTML = fs.readFileSync("./src/index.html");

let connections = [];

let server = new http.Server();
server.listen(3000);

let wsServer = new websocket.server({
    httpServer: server
});

server.on("request", (req, res) => {
    let pathname = url.parse(req.url).pathname;
    if (pathname === "/") {
        res.writeHead(200, {"Content-Type": "text/html"}).end(clientHTML);
    } else {
        res.writeHead(404).end();
    }
});

wsServer.on('request', (req) => {
    console.log((new Date()) + ' Connection from origin ' + req.origin + '.');
    let connection = req.accept(null, req.origin);
    connections.push(connection);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', msg => {
    let remove_leftover = msg.utf8Data;
    remove_leftover += "Fisk";
    let event = "endcode=";
    connection.sendUTF(event + remove_leftover);

    });


});
