import http from "http";
import websocket from "websocket";
import fs from "fs";
import url from "url";
import shelljs from "shelljs";
import * as data from "../util/data_processing.js";

const cwd = process.cwd();

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
    let after_msg = msg.utf8Data;
    let config = JSON.parse(cwd+"/../config.json");
    fs.writeFileSync(config.inputFile, after_msg);
    shelljs.exec("../run.sh");
    let event = "endcode=";
    let read = fs.readFileSync(config.encodedFile);
    connection.sendUTF(event + read);
    }); 

    connection.on('message', msg => {
        let remove_leftover = msg.utf8Data;
        remove_leftover += "yeah";
        let event = "error=";
        connection.sendUTF(event + remove_leftover);
    });

    connection.on('message', msg => {
        let remove_leftover = msg.utf8Data;
        remove_leftover += "Fladfisk";
        let event = "decode=";
        connection.sendUTF(event + remove_leftover);
    });
});

