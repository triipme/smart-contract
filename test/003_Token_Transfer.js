const BN = require('bn.js');
const env = require("../lib/env.js");
const Token = artifacts.require("Token");

contract('Token tranfer', (accounts) => {
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

  it("should add 3 tokens to toAddress, sub 3 tokens of fromAddress and add 0.015 tokens fee to issuerAddress when call transfer with 3 ether", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        issuerAddress = accounts[0]
        toAddress     = accounts[1]
        fromAddress   = accounts[4]
        transferValue = web3.utils.toWei('3', 'ether')
        recieveValue  = transferValue
        feeValue      = web3.utils.toWei('0.015', 'ether')
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.transfer(toAddress, transferValue, { from: fromAddress }))
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
          "3 ether was not"
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
          "3 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(accounts[0]))
      .then(result => {
        assert.equal(
          result.valueOf(),
          feeValue,
          "0.015 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          fromBalance.sub(new BN(web3.utils.toWei('3.015', 'ether'), 10)).toString(),
          "sub 3.015 ether was not"
        );
      }));

  it("should raise error when transfer amount is greater than balance", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        toAddress     = accounts[2]
        fromAddress   = accounts[1]
        transferValue = web3.utils.toWei('3', 'ether')
      })
      .then(() => localInstance.transfer(toAddress, transferValue, { from: fromAddress }))
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));

  it("should not add tokens to toAddress, sub tokens of fromAddress, add fee to issuerAddress", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        issuerAddress = accounts[0]
        toAddress     = accounts[2]
        fromAddress   = accounts[1]
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('0', 'ether'),
          "0 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('3', 'ether'),
          "3 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('0.015', 'ether'),
          "0.015 ether was not"
        );
      }));

  it("changes feePercentage is 0%", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
      })
      .then(() => localInstance.changeFeePercentage(0))
      .then(() => localInstance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf(),
          0,
          "0% was not"
        );
      }));

  it("should add 3 tokens to toAddress, sub 3 tokens of fromAddress and when call transfer with 3 ether", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        toAddress     = accounts[1]
        fromAddress   = accounts[4]
        transferValue = web3.utils.toWei('3', 'ether')
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => toBalance = result)
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.transfer(toAddress, transferValue, { from: fromAddress }))
      .then(result => {
        assert.equal(
          result.logs.length,
          1,
          "1 was not"
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
          transferValue,
          "3 ether was not"
        );

        return result
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          toBalance.add(new BN(web3.utils.toWei('3', 'ether'), 10)).toString(),
          "add 3 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          fromBalance.sub(new BN(web3.utils.toWei('3', 'ether'), 10)).toString(),
          "sub 3 ether was not"
        );
      }));
});
