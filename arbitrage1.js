

function doArbitrage(xlk,bond,appl,msft,goog,conversionFee){
  // compare xlk/10 with 3bond,2appl,3msft,2goog + 100 conversion fee
  var cost = 3*bond + 2*appl +3*msft + 2*goog + conversionFee
  if (xlk*10 <= cost){
    return false
  }
  else{
    return true
  }
}

doArbitrage(387,1000,100,90,200,100)

//get profit
function getEdge(dirSign,fairValue,orderPrice){
  dirSign = dirSign==='buy' ? 1 : -1
  var edge = dirSign*(fairValue - orderPrice)
  return edge;
}

function pennying(currBestbid,currBestOffer){
  var newBid = currBestbid + 1;
  var newOffer = currBestOffer + 1;

}
