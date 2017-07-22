//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();
client.connect(PORT, PROD, function() {

    console.log('CONNECTED TO: ' + PROD + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(JSON.stringify({"type": "hello", "team": "CTS"}) + "\n");
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    //console.log(typeof data.toString('utf-8'));
    var stringData = data.toString('utf-8').split("\n");
    console.log(stringData[stringData.length - 2]);
    // var obj = JSON.parse(stringData);
    // if (obj.type === "book" && (obj.symbol === "NOKFH" || obj.symbol === "NOKUS")) {
    //   console.log(obj);
    // }
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
