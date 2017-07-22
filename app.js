//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 20000;

var client = new net.Socket();
client.connect(PORT, PROD, function() {

    console.log('CONNECTED TO: ' + PROD + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write("HELLO CTS\n");

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    var splitted = data.split('\n');

    splitted.forEach(function(line) {
      if (data.includes("BOOK BOND")) {
        console.log(line);
      }
    })
    //console.log('DATA: ' + data);
    // Close the client socket completely
    //client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
