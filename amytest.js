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

var AAPL_buy = 0, AAPL_sell = 0;
var BOND_buy = 0, BOND_sell = 0;
var MSFT_buy = 0, MSFT_sell = 0;
var GOOG_buy = 0, GOOG_sell = 0;
var XLK_buy = 0, XLK_sell = 0;
var counter = 0;

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
  function doXLKArbitrage(xlk,bond,aapl,msft,goog,conversionFee){
    // compare xlk/10 with 3bond,2appl,3msft,2goog + 100 conversion fee
    var cost = 3*bond + 2*aapl +3*msft + 2*goog + conversionFee;
    if (xlk*10 < cost){
      //buy xlk
      console.log(cost, '>', xlk*10);
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "XLK", "dir": "BUY", "price": xlk,"size": 10})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "XLK", "dir": "SELL", "size": 10})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "SELL","price":bond, "size": 3})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "AAPL", "dir": "SELL","price":aapl, "size": 2})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "MSFT", "dir": "SELL","price":msft, "size": 3})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "GOOG", "dir": "SELL","price":goog, "size": 2})+"\n")
      counter++;
    }
  }

  function doReverseXLKArbitrage(xlk,bond,aapl,msft,goog,conversionFee) {
    var cost = conversionFee;
    var total = 3*bond + 2*aapl +3*msft + 2*goog;
    if (total < xlk*10 + cost){
      //sell xlk
      console.log(cost, '<', xlk*10);
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "BUY","price":bond, "size": 3})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "AAPL", "dir": "BUY","price":aapl, "size": 2})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "MSFT", "dir": "BUY","price":msft, "size": 3})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "GOOG", "dir": "BUY","price":goog, "size": 2})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "XLK", "dir": "BUY", "size": 10})+"\n")
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "XLK", "dir": "SELL", "price": xlk,"size": 10})+"\n")
      counter++;
    }
  }

  var stringData = data.toString('utf-8').split("\n");
  var obj = JSON.parse(stringData[stringData.length - 2]);

  if (obj.symbol === "AAPL") {
    if (!obj.buy[0]) {
      AAPL_buy = obj.buy[0][0];
    }
    if (!obj.sell[0]) {
      AAPL_sell = obj.sell[0][0];
    }
  }
  if (obj.symbol === "BOND") {
    if (!obj.buy[0]) {
      BOND_buy = obj.buy[0][0];
    }
    if (!obj.sell[0]) {
      BOND_sell = obj.sell[0][0];
    }
  }
  if (obj.symbol === "MSFT") {
    if (!obj.buy[0]) {
      MSFT_buy = obj.buy[0][0];
    }
    if (!obj.sell[0]) {
      MSFT_sell = obj.sell[0][0];
    }
  }
  if (obj.symbol === "GOOG") {
    if (!obj.buy[0]) {
      GOOG_buy = obj.buy[0][0];
    }
    if (!obj.sell[0]) {
      GOOG_sell = obj.sell[0][0];
    }
  }
  if (obj.symbol === "XLK") {
    if (!obj.buy[0]) {
      XLK_buy = obj.buy[0][0];
    }
    if (!obj.sell[0]) {
      XLK_sell = obj.sell[0][0];
    }
  }

  if(XLK_buy !== 0 && AAPL_sell !== 0 && BOND_sell !== 0 && MSFT_sell !== 0 && GOOG_sell !== 0) {
    console.log('doing XLK');
    doXLKArbitrage(XLK_buy,BOND_sell,AAPL_sell,MSFT_sell,GOOG_sell,150);
  }
  if(XLK_sell !== 0 && AAPL_buy !== 0 && BOND_buy !== 0 && MSFT_buy !== 0 && GOOG_buy !== 0) {
    console.log('doing reverse XLK');
    doReverseXLKArbitrage(XLK_sell,BOND_buy,AAPL_buy,MSFT_buy,GOOG_buy,150);
  }

  // var stringData = data.toString('utf-8').split("\n");
  // var obj = JSON.parse(stringData[stringData.length - 2]);
  //
  // if (obj.type === "book" && (obj.symbol === "XLK" || obj.symbol === "AAPL"
  // ||obj.symbol==='BOND'||obj.symbol==='GOOG')) {
  //
  // }
  //
  // doArbitrage()

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
