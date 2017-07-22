const io = require('socket.io-client');
var socket = io('http://10.0.49.161');

console.log("hello");

socket.on('connect', function(){
  console.log('connected');
})

//arbitrage stuff
