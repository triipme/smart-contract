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
  contract.methods.releaseFounderTokens().send({value: web3.utils.toWei('0', 'ether'), from: fromAddress})
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
// TOKEN=0x3c6475f8b4200e0a6acf5aeb2b44b769a3d37216 MNEMONIC=0c9ab39ce6735683499b651b292bcfdb4b8f31e7d1aa32eb40323c9c86529444 truffle exec cmd/releaseFounderTokens.js --network tomomainnet
