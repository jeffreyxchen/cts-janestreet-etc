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
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
  //console.log(typeof data.toString('utf-8'));
  function doNOKUSArbitrage (nokus, nokfh) {
    var amt = 1;
    amtNOKUS = amt * nokus;
    valNOKUS = amtNOKUS + 10;
    if (valNOKUS < nokfh) {
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKUS", "dir": "BUY", "price": nokus, "size": 5})+"\n");
      counter++;
      client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "NOKUS", "dir": "SELL", "size": 5})+"\n");
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKFH", "dir": "SELL", "price": nokfh, "size": 5})+"\n");
      counter++;
    }
    else {
      var tempAMT = amt;
      while ((nokus*tempAMT+10)/tempAMT < nokfh) {
        tempAMT++;
      }
      if(tempAMT > 10) {
        return;
      }
      else {
        client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKUS", "dir": "BUY", "price": nokus, "size": 2*tempAMT})+"\n");
        counter++;
        client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "NOKUS", "dir": "SELL", "size": 2*tempAMT})+"\n");
        counter++;
        client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKFH", "dir": "SELL", "price": nokfh, "size": 2*tempAMT})+"\n");
        counter++;
      }
    }
  }

  function doNOKFHArbitrage (nokus, nokfh) {
    var amt = 1;
    amtNOKFH = amt * nokfh;
    valNOKFH = amtNOKFH + 10;
    if (valNOKFH < nokus) {
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKFH", "dir": "BUY", "price": nokfh, "size": 5})+"\n");
      counter++;
      client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "NOKUS", "dir": "BUY", "size": 5})+"\n");
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKUS", "dir": "SELL", "price": nokus, "size": 5})+"\n");
      counter++;
    } else {
      var tempAMT = amt;
      while ((nokus*tempAMT+10)/tempAMT < nokfh) {
        tempAMT++;
      }
      if(tempAMT > 10) {
        return;
      }
      else {
        client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKFH", "dir": "BUY", "price": nokfh, "size": 2*tempAMT})+"\n");
        counter++;
        client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "NOKUS", "dir": "BUY", "size": 2*tempAMT})+"\n");
        counter++;
        client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKUS", "dir": "SELL", "price": nokus, "size": 2*tempAMT})+"\n");
        counter++;
      }
    }
  }

  var stringData = data.toString('utf-8').split("\n");
  var obj = JSON.parse(stringData[stringData.length - 2]);
  // if (obj.type === "ack" || obj.type === "reject" || obj.type === "error" || obj.type === "out" || obj.type == "fill") {
  //   console.log(obj);
  // }

  if (obj.type === "book" && (obj.symbol === "NOKFH" || obj.symbol === "NOKUS")) {
    if (obj.symbol === "NOKUS") {
      if (obj.buy[0] !== undefined) {
        nokus_buy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        nokus_sell = obj.sell[0][0]
      }
    } else {
      if (obj.buy[0] !== undefined) {
        nokfh_buy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        nokfh_sell = obj.sell[0][0]
      }
    }

    if (nokus_buy !== 0 && nokfh_sell !== 0) {
      doNOKUSArbitrage(nokus_sell, nokfh_buy);
    }

    if (nokus_sell !== 0 && nokfh_buy !== 0) {
      doNOKFHArbitrage(nokus_buy, nokfh_sell);
    }

  }
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
