
//if true we should buy components to make xlk ourselves
function doArbitrage(xlk,bond,aapl,msft,goog,conversionFee){
  // compare xlk/10 with 3bond,2appl,3msft,2goog + 100 conversion fee
  var cost = 3*bond + 2*aapl +3*msft + 2*goog + conversionFee
  if (xlk*10 <= cost){
    //buy xlk
    // ADD ID SYMBOL BUY|SELL PRICE SIZE
    ADD ID XLK BUY PRICE 10
    {"type": "add", "order_id": /*insert number*/, "symbol": "XLK", "dir": "BUY", "size": 1};
    // return false
  }
  else{
    //buy bond,appl,msft,goog
    ADD ID BOND BUY PRICE 10
    ADD ID AAPL BUY PRICE 10
    ADD ID MSFT BUY PRICE 10
    ADD ID GOOG BUY PRICE 10

    {"type": "add", "order_id": /*insert number*/, "symbol": "BOND", "dir": "BUY", "size": 1};
    {"type": "add", "order_id": /*insert number*/, "symbol": "AAPL", "dir": "BUY", "size": 1};
    {"type": "add", "order_id": /*insert number*/, "symbol": "MSFT", "dir": "BUY", "size": 1};
    {"type": "add", "order_id": /*insert number*/, "symbol": "GOOG", "dir": "BUY", "size": 1};

    // return true
  }
}

doArbitrage(387,1000,100,90,200,100)

//get market fair value
function getFairValue(currBestBid,currBestOffer){
  return (currBestBid+currBestOffer)/2
}

//get profit
function getEdge(dirSign,fairValue,orderPrice){
  dirSign = dirSign==='buy' ? 1 : -1
  var edge = dirSign*(fairValue - orderPrice)
  return edge;
}

function pennying(currBestBid,currBestOffer){
  var newBid = currBestBid + 1;
  var newOffer = currBestOffer + 1;
  return [newBid,newOffer]
}
