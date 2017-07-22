
{"type": "hello", "team": "CTS"}

//nokus = stock, nokfh = ADR, conversion rate = 10/conversion
function doNOKUSArbitrage (nokus, nokfh) {
  var index = 0;
  while (index < 100) {
    var amt = 1;
    amtNOKUS = amt * nokus;
    valNOKUS = amtNOKUS + 10;
    if (valNOKUS < nokfh) {
      //send the following obj
      {"type": "convert", "order_id": index+new Date(), "symbol": "NOKFH", "dir": "BUY", "size": 1};
      {"type": "add", "order_id": index+new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 1};
    } else {
      var tempAMT = amt;
      while ((nokus*tempAMT+10)/tempAMT < nokfh) {
        tempAMT++;
      }
      if(tempAMT > 20) {
        return;
        else {
          //send the following obj
          {"type": "convert", "order_id": index+new Date(), "symbol": "NOKFH", "dir": "BUY", "size": 2*tempAMT};
          {"type": "add", "order_id": index+new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 2*tempAMT};
        }
      }
    }
    index++;
  }
}

doNOKUSArbitrage(90, 100);

// function doNOKFHArbitrage (nokus, nokfh) {
//   var amt = 1;
//   amtNOKFH = amt * nokus;
//   valNOKFH = amtNOKFH + 10;
//   if (valNOKFH < nokus) {
//     //send the following obj
//     {"type": "convert", "order_id": /*insert number*/, "symbol": "NOKUS", "dir": "BUY", "size": 1};
//     {"type": "add", "order_id": /*insert number*/, "symbol": "NOKFH", "dir": "SELL", "size": 1};
//   } else {
//     var tempAMT = amt;
//     while ((nokus*tempAMT+10)/tempAMT < nokfh) {
//       tempAMT++;
//     }
//     if(tempAMT > 20) {
//       return;
//       else {
//         //send the following obj
//         {"type": "convert", "order_id": /*insert number*/, "symbol": "NOKUS", "dir": "BUY", "size": 2*tempAMT};
//         {"type": "add", "order_id": /*insert number*/, "symbol": "NOKFH", "dir": "SELL", "size": 2*tempAMT};
//       }
//     }
//   }
