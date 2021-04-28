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

function bin2hex(data) {
    let hex = "";

    // go through every byte of the data string
    for (let i = 0; i < data.length; i += 8) {
        // extract the current byte from the data
        let byte = data.slice(i, i + 8);

        // if it is the last part of the data it might not be a complete byte
        while (byte.length < 8) byte += "0";

        // convert byte to hexadecimal
        byte = parseInt(byte, 2).toString(16).toUpperCase();

        // correct parsing of byte containing all zeroes
        while (byte.length < 2) byte += "0";

        hex += byte + " ";
    };

    return hex;
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

