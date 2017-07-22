//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();
client.connect(PORT, TEST, function() {

  console.log('CONNECTED TO: ' + TEST + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
  client.write({"type": "hello", "team": "CTS"});
  console.log('INSIDE CLIENT');
  // function doNOKUSArbitrage (nokus, nokfh) {
  //   var index = 0;
  //   while (index < 100) {
  //     var amt = 1;
  //     amtNOKUS = amt * nokus;
  //     valNOKUS = amtNOKUS + 10;
  //     if (valNOKUS < nokfh) {
  //       //send the following obj
  //       client.write(JSON.stringify({"type": "convert", "order_id": index+new Date(), "symbol": "NOKFH", "dir": "BUY", "size": 1}));
  //       client.write(JSON.stringify({"type": "add", "order_id": index+new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 1}));
  //       console.log('TRADES MADE');
  //     }
  //     // else {
  //     //   var tempAMT = amt;
  //     //   while ((nokus*tempAMT+10)/tempAMT < nokfh) {
  //     //     tempAMT++;
  //     //   }
  //     //   if(tempAMT > 20) {
  //     //     return;
  //     //   }
  //     //   else {
  //     //     //send the following obj
  //     //     client.write("{"type": "convert", "order_id": index+new Date(), "symbol": "NOKFH", "dir": "BUY", "size": 2*tempAMT}\n");
  //     //     client.write("{"type": "add", "order_id": index+new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 2*tempAMT}\n");
  //     //   }
  //     // }
  //   }
  //   index++;
  // }
  function doArbitrage(xlk,bond,aapl,msft,goog,conversionFee){
    // compare xlk/10 with 3bond,2appl,3msft,2goog + 100 conversion fee
    var cost = 3*bond + 2*aapl +3*msft + 2*goog + conversionFee
    if (xlk*10 <= cost){
      //buy xlk
      // ADD ID SYMBOL BUY|SELL PRICE SIZE
      {"type": "add", "order_id": new Date(), "symbol": "XLK", "dir": "BUY", "size": 1};
      // return false
    }
    else{
      //buy bond,appl,msft,goog
      {"type": "add", "order_id":new Date(), "symbol": "BOND", "dir": "BUY", "size": 1};
      {"type": "add", "order_id": new Date(), "symbol": "AAPL", "dir": "BUY", "size": 1};
      {"type": "add", "order_id": new Date(), "symbol": "MSFT", "dir": "BUY", "size": 1};
      {"type": "add", "order_id": new Date(), "symbol": "GOOG", "dir": "BUY", "size": 1};

      // return true
    }
  }

  doArbitrage(400,1000,100,90,200,100);

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
  console.log('DATA: ' + data);
  // Close the client socket completely
  //client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
