const TOMO_ISSUER_ABI = require("../lib/tomoIssuerAbi.js");

module.exports = function(callback) {
  var tokenAddress = process.env.TOKEN;
  if(typeof(tokenAddress) == 'undefined'){
    return;
  }

  var tomoIssuerAddress = process.env.TOMO_ISSUER;
  if(typeof(tomoIssuerAddress) == 'undefined'){
    return;
  }

  var fromAddress = web3.currentProvider.addresses[0];
  if(typeof(fromAddress) == 'undefined'){
    return;
  }

  var amount = process.env.AMOUNT;
  if(typeof(amount) == 'undefined'){
    return;
  }

  contract = new web3.eth.Contract(TOMO_ISSUER_ABI, tomoIssuerAddress);
  contract.methods.apply(tokenAddress).send({value: web3.utils.toWei(amount, 'ether'), from: fromAddress})
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
  // .on('confirmation', function(confirmationNumber, receipt){
  //   console.log('confirmationNumber', confirmationNumber, 'receipt', receipt);
  // })
  // .on('error', console.error);

  return true;
}
