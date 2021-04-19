let bt = document.getElementById("button");
let data = document.getElementById("fname");
let ws = new WebSocket("ws://localhost:3000/");
let encode = document.getElementById("EC");
let error = document.getElementById("ERR");
let decode = document.getElementById("DC");

ws.addEventListener("open",() => {
    console.log("Connection open");
});

bt.addEventListener("click", () =>{
    ws.send(data.value);
});

ws.addEventListener("message", (received) => {
    let [eventType, data] = received.data.split("=");
    console.log(eventType);
    switch (eventType) {
        case "encode":
            encode.innerText = data; break;
        case "error":
            error.innerText = data; break;
        case "decode":
            decode.innerText = data; break;
        default:
            console.log("An unknown event was emmitted by the server");
    }
});
