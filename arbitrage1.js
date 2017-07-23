
//if true we should buy components to make xlk ourselves
function doArbitrage(xlk,bond,aapl,msft,goog,conversionFee){
  // compare xlk/10 with 3bond,2appl,3msft,2goog + 100 conversion fee
  counter=0;
  conversionFee=100;
  var cost = 3*bond + 2*aapl +3*msft + 2*goog + conversionFee
  if (xlk*10 <= cost){
    //buy xlk
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "XLK", "dir": "BUY", "size": 1})+"\n")
    // return false
  }
  else{
    //buy bond,appl,msft,goog
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "BOND", "dir": "BUY", "size": 1})+"\n")
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "AAPL", "dir": "BUY", "size": 1})+"\n")
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "MSFT", "dir": "BUY", "size": 1})+"\n")
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": "GOOG", "dir": "BUY", "size": 1})+"\n")    

    // return true
  }
  counter++
}
//
// doArbitrage(387,1000,100,90,200,100)
//
// //get market fair value
// function getFairValue(currBestBid,currBestOffer){
//   return (currBestBid+currBestOffer)/2
// }
//
// //get profit
// function getEdge(dirSign,fairValue,orderPrice){
//   dirSign = dirSign==='buy' ? 1 : -1
//   var edge = dirSign*(fairValue - orderPrice)
//   return edge;
// }
//
// function pennying(currBestBid,currBestOffer){
//   var newBid = currBestBid + 1;
//   var newOffer = currBestOffer + 1;
//   return [newBid,newOffer]
// }
