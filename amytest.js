//arbitrage stuff
var net = require('net');
var adr = require('./arbitrageADR');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();

client.connect(PORT, TEST, function() {

  console.log('CONNECTED TO: ' + TEST + ':' + PROD);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
  client.write(JSON.stringify({"type": "hello", "team": "CTS"}) + "\n");
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
  //console.log(typeof data.toString('utf-8'));
  function doArbitrage(xlk,bond,aapl,msft,goog,conversionFee){
    // compare xlk/10 with 3bond,2appl,3msft,2goog + 100 conversion fee
    counter=0;
    conversionFee=100;
    var cost = 3*bond + 2*aapl +3*msft + 2*goog + conversionFee
    if (xlk*10 <= cost){
      //buy xlk
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "XLK", "dir": "BUY", "size": 1})+"\n")
      // return false
    }
    else{
      //buy bond,appl,msft,goog
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "BUY", "size": 1})+"\n")
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "AAPL", "dir": "BUY", "size": 1})+"\n")
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "MSFT", "dir": "BUY", "size": 1})+"\n")
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "GOOG", "dir": "BUY", "size": 1})+"\n")

      // return true
    }
    counter++
  }

  var stringData = data.toString('utf-8').split("\n");
  var obj = JSON.parse(stringData[stringData.length - 2]);

  if (obj.type === "book" && (obj.symbol === "XLK" || obj.symbol === "AAPL"
  ||obj.symbol==='BOND'||obj.symbol==='GOOG')) {

  }

  doArbitrage()

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
