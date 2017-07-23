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

var canceler = [[],0,[],0,[],0,[],0,[],0];

var pennyNOKFHsell = 0, pennyNOKFHbuy = 0;
var pennyNOKUSsell = 0, pennyNOKUSbuy = 0;
var pennyAAPLsell = 0, pennyAAPLbuy = 0;
var pennyMSFTsell = 0, pennyMSFTbuy = 0;
var pennyGOOGsell = 0, pennyGOOGbuy = 0;

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

  function compare(arr) {
    var complete = 0;
    for (var i = 0; i < 20; i++) {
      complete += arr[i]
    }
    return complete;
  }

  function penny(symbol, buyPrice, sellPrice, pennyIdx) {
    var fairValue = (buyPrice + sellPrice) / 2;

    if (canceler[pennyIdx * 2 + 1] >= 20) {
      console.log(canceler[pennyIdx*2])
      if (compare(canceler[pennyIdx*2])/20 > buyPrice) {
        client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "BUY", "price": fairValue + 1, "size": 5}) + "\n")
        counter++;
        console.log(canceler[pennyIdx*2])
        canceler[pennyIdx*2].push(fairValue);
        canceler[pennyIdx*2].splice(0,1);
      } else {
        client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "SELL", "price": fairValue - 1, "size": 5}) + "\n")
        counter++;
        console.log(canceler[pennyIdx*2])
        canceler[pennyIdx*2].push(fairValue);
        canceler[pennyIdx*2].splice(0,1);
      }
    } else {
      console.log(canceler[pennyIdx*2])
      canceler[pennyIdx*2].push(fairValue);
      canceler[pennyIdx*2 + 1]++;
    }

    // var rand = Math.random();
    //
    // if (rand > 0.75) {
    //   client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "BUY", "price": buyPrice, "size": 5}) + "\n")
    //   counter++;
    // } else {
    //   client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "SELL", "price": sellPrice, "size": 5}) + "\n")
    //   counter++;
    // }

    // if (canceler[pennyIdx])
    // var string1 = JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "BUY", "price": fairValue - 2, "size": 5});
    // // var string2 = JSON.stringify({"type": "add", "order_id": counter + 1, "symbol": symbol, "dir": "SELL", "price": fairValue + 2, "size": 5});
    // client.write(string1 +"\n");
    // counter = counter + 2;
    //
    // if(sellPrice - buyPrice > 1) {
    //   // if (canceler[pennyIdx*2] !== 0) {
    //   //   client.write(JSON.stringify({"type": "cancel", "order_id": canceler[pennyIdx*2]}) + "\n")
    //   //   client.write(JSON.stringify({"type": "cancel", "order_id": canceler[pennyIdx*2 + 1]}) + "\n")
    //   // }
    //   //console.log('test');
    //
    //   canceler[pennyIdx*2] = counter;
    //   canceler[pennyIdx*2 + 1] = counter + 1;
    //
    //   //console.log("DOES IT GET HERE??");
    // }
  }

  var pennyArr = [];
  var stringData = data.toString('utf-8').split("\n");
  var obj = JSON.parse(stringData[stringData.length - 2]);
  //console.log(stringData[stringData.length - 3])

  for (var i = 0; i < stringData.length; i++) {
    if (stringData[i][0] === "{") {
      var temp = JSON.parse(stringData[i]);
      if (temp.type === "ack" || temp.type === "reject" || temp.type === "error" || temp.type === "out" || temp.type == "fill") {
        if (temp.type === "fill") {
          if (temp.dir === "BUY") {
            pennyArr.push(temp.order_id);
          } else if (temp.dir === "SELL") {
            var tempIdx = pennyArr.indexOf(temp.order_id);
            pennyArr.splice(tempIdx, 1);
          }
        }
        console.log(pennyArr);
      }
    }
  }

  //Pennying

  if (obj.type === "book") {
    if (obj.symbol === "NOKFH") {
      if (obj.buy[0] !== undefined) {
        pennyNOKFHbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyNOKFHsell = obj.sell[0][0];
      }
      if (pennyNOKFHbuy !== 0 && pennyNOKFHsell !== 0) {
        //console.log('NOKFH');
        penny("NOKFH", pennyNOKFHbuy, pennyNOKFHsell, 0);
        //pennyNOKFHbuy = 0
        //pennyNOKFHsell = 0;
      }
    }
    else if (obj.symbol === "NOKUS") {
      if (obj.buy[0] !== undefined) {
        pennyNOKUSbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyNOKUSsell = obj.sell[0][0];
      }
      if (pennyNOKUSbuy !== 0 && pennyNOKUSsell !== 0) {
        //console.log('NOKUS');
        penny("NOKUS", pennyNOKUSbuy, pennyNOKUSsell, 1);
        //pennyNOKUSbuy = 0;
        //pennyNOKUSsell = 0;
      }
    }
    else if (obj.symbol === "AAPL") {
      if (obj.buy[0] !== undefined) {
        pennyAAPLbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyAAPLsell = obj.sell[0][0];
      }
      if (pennyAAPLbuy !== 0 && pennyAAPLsell !== 0) {
        //console.log('AAPL');
        penny("AAPL", pennyAAPLbuy, pennyAAPLsell, 2);
        //pennyAAPLbuy = 0;
        //pennyAAPLsell = 0;
      }
    }
    else if (obj.symbol === "MSFT") {
      if (obj.buy[0] !== undefined) {
        pennyMSFTbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyMSFTsell = obj.sell[0][0];
      }
      if (pennyMSFTbuy !== 0 && pennyMSFTsell !== 0) {
        //console.log('MSFT');
        penny("MSFT", pennyMSFTbuy, pennyMSFTsell, 3);
        //pennyMSFTbuy = 0;
        //pennyMSFTsell = 0;
      }
    }
    else if (obj.symbol === "GOOG") {
      if (obj.buy[0] !== undefined) {
        pennyGOOGbuy = obj.buy[0][0];
      }
      if (obj.sell[0] !== undefined) {
        pennyGOOGsell = obj.sell[0][0];
      }
      if (pennyGOOGbuy !== 0 && pennyGOOGsell !== 0) {
        //console.log('GOOG');
        penny("GOOG", pennyGOOGbuy, pennyGOOGsell, 4);
        //pennyGOOGbuy = 0;
        //pennyGOOGsell = 0;
      }
    }
    else {
      return;
    }
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
