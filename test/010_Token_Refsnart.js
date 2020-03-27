const BN = require('bn.js');
const env = require("../lib/env.js");
const Token = artifacts.require("Token");

contract('Token refsnart', (accounts) => {
  it("changes feePercentage is 0.5%", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        instance.changeFeePercentage(50)
      })
      .then(() => localInstance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf(),
          50,
          "0.5% was not"
        );
      }));

  it("should add 2.985 tokens to toAddress, sub 3 tokens of fromAddress and add 0.015 tokens fee to issuerAddress when call transfer with 3 ether", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        issuerAddress = accounts[0]
        toAddress     = accounts[12]
        fromAddress   = accounts[4]
        transferValue = web3.utils.toWei('3', 'ether')
        recieveValue  = web3.utils.toWei('2.985', 'ether')
        feeValue      = web3.utils.toWei('0.015', 'ether')
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => issuerBalance = result)
      .then(() => localInstance.refsnart(toAddress, transferValue, { from: fromAddress }))
      .then(result => {
        assert.equal(
          result.logs.length,
          3,
          "3 was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[0].event,
          'Transfer',
          "Transfer was not"
        );

        assert.equal(
          result.logs[0].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[0].args['1'],
          toAddress,
          toAddress + " was not"
        );

        assert.equal(
          result.logs[0].args['2'],
          recieveValue,
          "2.985 ether was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[1].event,
          'Transfer',
          "Transfer was not"
        );

        assert.equal(
          result.logs[1].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[1].args['1'],
          issuerAddress,
          issuerAddress + " was not"
        );

        assert.equal(
          result.logs[1].args['2'],
          feeValue,
          "0.015 ether was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[2].event,
          'Fee',
          "Fee was not"
        );

        assert.equal(
          result.logs[2].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['1'],
          toAddress,
          toAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['2'],
          issuerAddress,
          issuerAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['3'],
          feeValue,
          "0.015 ether was not"
        );

        return result
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          recieveValue,
          "2.985 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          issuerBalance.add(new BN(feeValue, 10)).toString(),
          "0.015 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          fromBalance.sub(new BN(transferValue, 10)).toString(),
          "sub 3 ether was not"
        );
      }));
});
