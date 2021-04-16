import express from "express";
import http from "http";
import * as WebSocket from "ws";
const app = express();
const direname = process.cwd();
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

app.get("/", function (req, res) {
    res.sendFile(direname + "/index.html");
});
app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});