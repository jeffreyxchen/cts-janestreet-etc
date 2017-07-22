function penny(symbol, buyPrice, sellPrice) {
  if(buyPrice - sellPrice > 0.02) {
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "BUY", "price": buyPrice+0.01, "size": 1})+"\n");
    counter++;
    client.write(JSON.stringify({"type": "add", "order_id": counter, "symbol": symbol, "dir": "SELL", "price": sellPrice-0.01, "size": 1})+"\n");
    counter++;
  }
}
