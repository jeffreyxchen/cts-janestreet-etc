function penny(symbol, buyPrice, sellPrice) {
  if(buyPrice < sellPrice) {
    client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": symbol, "dir": "BUY", "price": buyPrice+0.01, "size": 1})+"\n");
    client.write(JSON.stringify({"type": "add", "order_id": new Date(), "symbol": symbol, "dir": "SELL", "price": sellPrice-0.01, "size": 1})+"\n");
  }
}
