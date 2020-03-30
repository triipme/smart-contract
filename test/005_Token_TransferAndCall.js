const BN = require('bn.js');
const env = require("../lib/env.js");
const Token = artifacts.require("Tiim");
const TestingTokenReceiver = artifacts.require("TestingTokenReceiver");

contract('Token transferAndCall', (accounts) => {
  let testingTokenReceiverAddress = TestingTokenReceiver.address

  it("changes feePercentage is 0.5%", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
      })
      .then(() => localInstance.changeFeePercentage(50))
      .then(() => localInstance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf(),
          50,
          "0.5% was not"
        );
      }));

  it("should do transfer and call fallback of receiver", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance

        issuerAddress = accounts[0]
        fromAddress   = accounts[6]
        toAddress     = testingTokenReceiverAddress
        transferValue = web3.utils.toWei('3', 'ether')
        receiveValue  = transferValue
        feeValue      = web3.utils.toWei('0.015', 'ether')
        data          = web3.utils.toHex('valid')
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => issuerBalance = result)
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => toBalance = result)
      .then(() => localInstance.transferAndCall(toAddress, transferValue, web3.utils.hexToBytes(data), { from: fromAddress }))
      .then(result => {
        assert.equal(
          result.receipt.rawLogs.length,
          5,
          "5 was not"
        );

        return result;
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
          receiveValue,
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
      .then(result => {
        receiveLog = TestingTokenReceiver.decodeLogs([result.receipt.rawLogs[4]])[0]

        assert.equal(
          receiveLog.event,
          'Receive',
          "Receive was not"
        );

        assert.equal(
          receiveLog.args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          receiveLog.args['1'],
          receiveValue,
          "3 ether was not"
        );

        assert.equal(
          receiveLog.args['2'],
          data,
          data + " was not"
        );

        return result
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          toBalance.add(new BN(web3.utils.toWei('3', 'ether'), 10)).toString(),
          "3 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          issuerBalance.add(new BN(web3.utils.toWei('0.015', 'ether'), 10)).toString(),
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

  it("should raise error when receiver raise exception", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance

        issuerAddress = accounts[0]
        fromAddress   = accounts[6]
        toAddress     = testingTokenReceiverAddress
        transferValue = web3.utils.toWei('3', 'ether')
        receiveValue  = transferValue
        feeValue      = web3.utils.toWei('0.015', 'ether')
        data          = web3.utils.toHex('invalid')
      })
      .then(() => localInstance.transferAndCall(toAddress, transferValue, web3.utils.hexToBytes(data), { from: fromAddress }))
      .catch(function(error) {
        assert.include(
          error.message,
          'invalid'
        )
      }));

  it("should not add tokens to toAddress, sub tokens of fromAddress, add fee to issuerAddress", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance

        issuerAddress = accounts[0]
        fromAddress   = accounts[6]
        toAddress     = testingTokenReceiverAddress
        transferValue = web3.utils.toWei('3', 'ether')
        receiveValue  = transferValue
        feeValue      = web3.utils.toWei('0.015', 'ether')
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('3', 'ether'),
          "3 ether was not"
        );
      }));

  it("should do transfer when toAddress is not contract", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance

        issuerAddress = accounts[0]
        fromAddress   = accounts[6]
        toAddress     = accounts[10]
        transferValue = web3.utils.toWei('3', 'ether')
        receiveValue  = transferValue
        feeValue      = web3.utils.toWei('0.015', 'ether')
        data          = web3.utils.toHex('valid')
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => issuerBalance = result)
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => toBalance = result)
      .then(() => localInstance.transferAndCall(toAddress, transferValue, web3.utils.hexToBytes(data), { from: fromAddress }))
      .then(result => {
        assert.equal(
          result.receipt.rawLogs.length,
          3,
          "3 was not"
        );

        return result;
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          toBalance.add(new BN(web3.utils.toWei('3', 'ether'), 10)).toString(),
          "3 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          issuerBalance.add(new BN(web3.utils.toWei('0.015', 'ether'), 10)).toString(),
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
});
