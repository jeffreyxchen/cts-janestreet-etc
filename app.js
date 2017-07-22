//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();
client.connect(PORT, PROD, function() {

    console.log('CONNECTED TO: ' + TEST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(JSON.stringify({"type": "hello", "team": "CTS"}) + "\n" +
    JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "BOND", "dir": "BUY", "price": 999, "size": 10}) + "\n" +
    JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "BOND", "dir": "SELL", "price": 1000, "size": 10} + "\n"));
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

    // var buf = new Buffer(JSON.stringify(data), "utf-8");
    // var temp = JSON.parse(buf.toString());
    console.log(JSON.stringify(data));
    //console.log(typeof data);
    //var splitted = lines.split('\n');

    // splitted.forEach(function(line) {
    //   if (line.includes("BOOK BOND")) {
    //     console.log(line);
    //   }
    // })
    //console.log('DATA: ' + data);
    // Close the client socket completely
    //client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
