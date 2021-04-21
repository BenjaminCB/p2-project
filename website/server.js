import http from "http";
import websocket from "websocket";
import fs from "fs";
import url from "url";
import shelljs from "shelljs";
import * as data from "../util/data_processing.js";

const cwd = process.cwd();

const clientHTML = fs.readFileSync(cwd + "/website/index.html");

let connections = [];

let server = new http.Server();
server.listen(8080);

let wsServer = new websocket.server({
    httpServer: server
});

server.on("request", (req, res) => {
    let pathname = url.parse(req.url).pathname;
    if (pathname === "/") {
        res.writeHead(200, {"Content-Type": "text/html"}).end(clientHTML);
    } else if (pathname === "/style") {
        let fStream = fs.createReadStream(cwd + "/website/style.css");
        res.writeHead(200, {"Content-Type": "text/css"});
        fStream.pipe(res);
    } else if (pathname === "/image/marble") {
        let fStream = fs.createReadStream(cwd + "/website/marble.jpg");
        res.writeHead(200, {"Content-Type": "image/jpg"});
        fStream.pipe(res);
    } else if (pathname === "/script") {
        let fStream = fs.createReadStream(cwd + "/website/script.js");
        res.writeHead(200, {"Content-Type": "application/javascript"});
        fStream.pipe(res);
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
        // get the current config file
        let config = data.parseConfig();

        // write the message to the input file
        fs.writeFileSync(config.inputFile, msg.utf8Data);

        // let the other programs handle encoding decoding etc...
        shelljs.exec(cwd + "/run.sh");

        // read and send the encoding message
        let event = "encode=";
        let read = fs.readFileSync(config.encodedFile);
        connection.sendUTF(event + read);

        // read and send the error message
        event = "error=";
        read = fs.readFileSync(config.errorFile);
        connection.sendUTF(event + read);

        // read and send the decoded message
        event = "decode=";
        read = fs.readFileSync(config.decodedFile);
        connection.sendUTF(event + read);

    });
});
