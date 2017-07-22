//arbitrage stuff
var net = require('net');

var TEST = '10.0.49.161';
var PROD = '1.1.1.1';
var PORT = 25000;

var client = new net.Socket();
client.connect(PORT, TEST, function() {

  console.log('CONNECTED TO: ' + TEST + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
  // client.write();
  client.write(JSON.stringify({"type": "hello", "team": "CTS"})+"\n"+JSON.stringify({"type": "add", "order_id": 1, "symbol": "BOND", "dir": "BUY", "price": 1010, "size": 1})+"\n");
  console.log('INSIDE CLIENT');
  function doNOKUSArbitrage (nokus, nokfh) {
    var index = 0;
    while (index < 100) {
      var amt = 1;
      amtNOKUS = amt * nokus;
      valNOKUS = amtNOKUS + 10;
      if (valNOKUS < nokfh) {
        //send the following obj
        client.write(JSON.stringify({"type": "add", "order_id": index, "symbol": "NOKFH", "dir": "BUY", "price": 4200, "size": 1})+"\n");
        client.write(JSON.stringify({"type": "convert", "order_id": index, "symbol": "NOKFH", "dir": "SELL", "size": 1})+"\n");
        client.write(JSON.stringify({"type": "add", "order_id": index, "symbol": "NOKUS", "dir": "SELL", "price": 4205, "size": 1})+"\n");
      }
      // else {
      //   var tempAMT = amt;
      //   while ((nokus*tempAMT+10)/tempAMT < nokfh) {
      //     tempAMT++;
      //   }
      //   if(tempAMT > 20) {
      //     return;
      //   }
      //   else {
      //     //send the following obj
      //     client.write("{"type": "convert", "order_id": index+new Date(), "symbol": "NOKFH", "dir": "BUY", "size": 2*tempAMT}\n");
      //     client.write("{"type": "add", "order_id": index+new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 2*tempAMT}\n");
      //   }
      // }
    }
    index++;
  }
  doNOKUSArbitrage(80, 100);
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
