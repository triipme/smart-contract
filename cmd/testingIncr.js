const TOKEN_ABI = require("../lib/testingIncreasementAbi.js");

module.exports = function(callback) {
  var tokenAddress = process.env.TOKEN;
  if(typeof(tokenAddress) == 'undefined'){
    return;
  }

  var signerAddress = web3.currentProvider.addresses[0];
  if(typeof(signerAddress) == 'undefined'){
    return;
  }

  contract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
  contract.methods.incr().send({value: web3.utils.toWei('0', 'ether'), from: signerAddress})
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
    return;
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
    return;
  })
  .on('error', function(error){
    console.log('error', error);
    return;
  });

  return true;
}
