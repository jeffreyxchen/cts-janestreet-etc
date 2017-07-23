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
    // else {
    //   var tempAMT = amt;
    //   while ((nokus*tempAMT+10)/tempAMT < nokfh) {
    //     tempAMT++;
    //   }
    //   if(tempAMT > 10) {
    //     return;
    //   }
    //   else {
    //     client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKUS", "dir": "BUY", "price": nokus, "size": 2*tempAMT})+"\n");
    //     counter++;
    //     client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "NOKUS", "dir": "SELL", "size": 2*tempAMT})+"\n");
    //     counter++;
    //     client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKFH", "dir": "SELL", "price": nokfh, "size": 2*tempAMT})+"\n");
    //     counter++;
    //   }
    // }
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
    }
    // else {
    //   var tempAMT = amt;
    //   while ((nokus*tempAMT+10)/tempAMT < nokfh) {
    //     tempAMT++;
    //   }
    //   if(tempAMT > 10) {
    //     return;
    //   }
    //   else {
    //     client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKFH", "dir": "BUY", "price": nokfh, "size": 2*tempAMT})+"\n");
    //     counter++;
    //     client.write(JSON.stringify({"type": "convert", "order_id": counter, "symbol": "NOKUS", "dir": "BUY", "size": 2*tempAMT})+"\n");
    //     counter++;
    //     client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "NOKUS", "dir": "SELL", "price": nokus, "size": 2*tempAMT})+"\n");
    //     counter++;
    //   }
    // }
  }

  function penny(symbol, buyPrice, sellPrice) {
    if(sellPrice - buyPrice > 0.02) {
      console.log('test');
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "BUY", "price": buyPrice+0.01, "size": 1})+"\n");
      counter++;
      client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "SELL", "price": sellPrice-0.01, "size": 1})+"\n");
      counter++;
      console.log("DOES IT GET HERE??");
    }
  }

  var stringData = data.toString('utf-8').split("\n");
  var obj = JSON.parse(stringData[stringData.length - 2]);
  console.log(stringData[stringData.length - 3])
  // if (obj.type === "ack" || obj.type === "reject" || obj.type === "error" || obj.type === "out" || obj.type == "fill") {
  //   console.log(obj);
  // }

  //Pennying
  var pennyNOKFHsell = 0, pennyNOKFHbuy = 0;
  var pennyNOKUSsell = 0, pennyNOKUSbuy = 0;
  var pennyAAPLsell = 0, pennyAAPLbuy = 0;
  var pennyMSFTsell = 0, pennyMSFTbuy = 0;
  var pennyGOOGsell = 0, pennyGOOGbuy = 0;
  if (obj.type === "book") {
    if (obj.symbol === "NOKFH") {
      if (obj.buy[0] !== undefined) {
        pennyNOKFHbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyNOKFHsell = obj.sell[0][0];
      }
    }
    else if (obj.symbol === "NOKUS") {
      if (obj.buy[0] !== undefined) {
        pennyNOKUSbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyNOKUSsell = obj.sell[0][0];
      }
    }
    else if (obj.symbol === "AAPL") {
      if (obj.buy[0] !== undefined) {
        pennyAAPLbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyAAPLsell = obj.sell[0][0];
      }
    }
    else if (obj.symbol === "MSFT") {
      if (obj.buy[0] !== undefined) {
        pennyMSFTbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyMSFTsell = obj.sell[0][0];
      }
    }
    else if (obj.symbol === "GOOG") {
      if (obj.buy[0] !== undefined) {
        pennyGOOGbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyGOOGsell = obj.sell[0][0];
      }
    }
    else {
      return;
    }
  }

  if (pennyNOKFHbuy !== 0 && pennyNOKFHsell !== 0) {
    console.log('NOKFH');
    penny("NOKFH", pennyNOKFHbuy, pennyNOKFHsell);
  }
  if (pennyNOKUSbuy !== 0 && pennyNOKUSsell !== 0) {
    console.log('NOKUS');
    penny("NOKUS", pennyNOKUSbuy, pennyNOKUSsell);
  }
  if (pennyAAPLbuy !== 0 && pennyAAPLsell !== 0) {
    console.log('AAPL');
    penny("AAPL", pennyAAPLbuy, pennyAAPLsell);
  }
  if (pennyMSFTbuy !== 0 && pennyMSFTsell !== 0) {
    console.log('MSFT');
    penny("MSFT", pennyMSFTbuy, pennyMSFTsell);
  }
  if (pennyGOOGbuy !== 0 && pennyGOOGsell !== 0) {
    console.log('GOOG');
    penny("GOOG", pennyGOOGbuy, pennyGOOGsell);
  }

  //ADR Arbitrage
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

    // if (nokus_buy !== 0 && nokfh_sell !== 0) {
    //   doNOKUSArbitrage(nokus_buy, nokfh_sell);
    // }
    //
    // if (nokus_sell !== 0 && nokfh_buy !== 0) {
    //   doNOKFHArbitrage(nokus_sell, nokfh_buy);
    // }

  }
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
