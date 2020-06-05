const TOKEN_ABI = require("../lib/tokenAbi.js");

module.exports = function(callback) {
  var tokenAddress = process.env.TOKEN;
  if(typeof(tokenAddress) == 'undefined'){
    return;
  }

  var fromAddress = web3.currentProvider.addresses[0];
  if(typeof(fromAddress) == 'undefined'){
    return;
  }

  contract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
  contract.methods.releaseTeamTokens().send({value: web3.utils.toWei('0', 'ether'), from: fromAddress})
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
// TOKEN=0x3c6475f8b4200e0a6acf5aeb2b44b769a3d37216 MNEMONIC=4e5790ea560995e97dc94a8b153dd3c33ee695e977486147f5de2c90b6490896 truffle exec cmd/releaseTeamTokens.js --network tomomainnet
