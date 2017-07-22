//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();
client.connect(PORT, TEST, function() {

    console.log('CONNECTED TO: ' + TEST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(JSON.stringify({"type": "hello", "team": "CTS"}));
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {


    //var buf = Buffer.from(JSON.stringify(data));
    console.log(data.toString('utf-8'))
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
