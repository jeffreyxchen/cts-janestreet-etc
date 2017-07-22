//arbitrage stuff
var net = require('net');
var adr = require('./arbitrageADR');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();
var nokfh_buy = 0;
var nokfh_sell = 0;
var nokus_buy = 0;
var nokus_sell = 0;
var counter = 0;

client.connect(PORT, TEST, function() {

  console.log('CONNECTED TO: ' + TEST + ':' + PROD);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
  client.write(JSON.stringify({"type": "hello", "team": "CTS"}) + "\n");
  client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "BUY", "price": 999, "size": 100})+"\n");
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
  function bonds() {
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "BUY", "price": 999, "size": 1})+"\n");
    counter++;
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "SELL", "price": 1000, "size": 1})+"\n");
    counter++;
  }

  bonds();

  var stringData = data.toString('utf-8').split("\n");
  var obj = JSON.parse(stringData[stringData.length - 2]);

  }
);

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
