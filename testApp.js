//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();

var ADR = require('./arbitrageADR');

client.connect(PORT, TEST, function() {

  console.log('CONNECTED TO: ' + TEST + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
  // client.write();
  client.write(JSON.stringify({"type": "hello", "team": "CTS"})+"\n"+JSON.stringify({"type": "add", "order_id": 1, "symbol": "BOND", "dir": "BUY", "price": 1010, "size": 1})+"\n");
  console.log('INSIDE CLIENT');
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
  var obj = JSON.parse(data.to)
  // Close the client socket completely
  //client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
