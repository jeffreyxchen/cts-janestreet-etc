//nokus = stock, nokfh = ADR, conversion rate = 10/conversion

function doNOKUSArbitrage (nokus, nokfh, client) {
  var amt = 1;
  amtNOKUS = amt * nokus;
  valNOKUS = amtNOKUS + 10;
  if (valNOKUS < nokfh) {
    client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKUS", "dir": "BUY", "price": nokus, "size": 5})+"\n");
    client.write(JSON.stringify({"type": "convert", "order_id": new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 5})+"\n");
    client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKFH", "dir": "SELL", "price": nokfh, "size": 5})+"\n");
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
      client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKUS", "dir": "BUY", "price": nokus, "size": 2*tempAMT})+"\n");
      client.write(JSON.stringify({"type": "convert", "order_id": new Date(), "symbol": "NOKUS", "dir": "SELL", "size": 2*tempAMT})+"\n");
      client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKFH", "dir": "SELL", "price": nokfh, "size": 2*tempAMT})+"\n");
    }
  }
}

function doNOKFHArbitrage (nokus, nokfh, client) {
  var amt = 1;
  amtNOKFH = amt * nokfh;
  valNOKFH = amtNOKFH + 10;
  if (valNOKFH < nokus) {
    client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKFH", "dir": "BUY", "price": nokfh, "size": 5})+"\n");
    client.write(JSON.stringify({"type": "convert", "order_id": new Date(), "symbol": "NOKUS", "dir": "BUY", "size": 5})+"\n");
    client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKUS", "dir": "SELL", "price": nokus, "size": 5})+"\n");
  } else {
    var tempAMT = amt;
    while ((nokus*tempAMT+10)/tempAMT < nokfh) {
      tempAMT++;
    }
    if(tempAMT > 10) {
      return;
    }
    else {
      client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKFH", "dir": "BUY", "price": nokfh, "size": 2*tempAMT})+"\n");
      client.write(JSON.stringify({"type": "convert", "order_id": new Date(), "symbol": "NOKUS", "dir": "BUY", "size": 2*tempAMT})+"\n");
      client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": "NOKUS", "dir": "SELL", "price": nokus, "size": 2*tempAMT})+"\n");
    }
  }
}

module.exports = {
  doNOKUSArbitrage : doNOKUSArbitrage,
  doNOKFHArbitrage : doNOKFHArbitrage
}
