const TOKEN_ABI = require("../lib/tokenAbi.js");

module.exports = function(callback) {
  var tokenAddress = process.env.TOKEN;
  if(typeof(tokenAddress) == 'undefined'){
    return;
  }

  var fromAddress = process.env.FROM;
  if(typeof(fromAddress) == 'undefined'){
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

  var signerAddress = web3.currentProvider.addresses[0];
  if(typeof(signerAddress) == 'undefined'){
    return;
  }

  contract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
  contract.methods.transferFrom(fromAddress, toAddress, web3.utils.toWei(amount, 'ether')).send({value: web3.utils.toWei('0', 'ether'), from: signerAddress})
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
