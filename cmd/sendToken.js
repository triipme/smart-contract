const TOKEN_ABI = require("../lib/tokenAbi.js");

module.exports = function(callback) {
  var tokenAddress = process.env.TOKEN;
  if(typeof(tokenAddress) == 'undefined'){
    return;
  }

  var toAddress = process.env.TO;
  if(typeof(toAddress) == 'undefined'){
    return;
  }

  var amount = process.env.AMOUNT;
  if(typeof(amount) == 'undefined'){
    return;
  }

  var fromAddress = web3.currentProvider.addresses[0];
  if(typeof(fromAddress) == 'undefined'){
    return;
  }

  contract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
  contract.methods.transfer(toAddress, web3.utils.toWei(amount, 'ether')).send({value: web3.utils.toWei('0', 'ether'), from: fromAddress})
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
    return;
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
    return;
  });

  return true;
}
