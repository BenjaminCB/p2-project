let bt = document.getElementById("button");
let data = document.getElementById("fname");
let ws = new WebSocket("ws://localhost:8080/");
let encode = document.getElementById("EC");
let error = document.getElementById("ERR");
let decode = document.getElementById("DC");

ws.addEventListener("open",() => {
    console.log("Connection open");
});

bt.addEventListener("click", () =>{
    ws.send(data.value);
});

function bin2hex (data){
    return parseInt(data, 2).toString(16).toUpperCase();
}
ws.addEventListener("message", (received) => {
    let [eventType, data] = received.data.split("=");
    console.log(eventType);
    switch (eventType) {
        case "encode":
            encode.innerText = bin2hex(data); break;
        case "error":
            error.innerText = bin2hex(data); break;
        case "decode":
            decode.innerText = data; break;
        default:
            console.log("An unknown event was emmitted by the server");
    }
    
});

