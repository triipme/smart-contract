const BN = require('bn.js');
const env = require("../lib/env.js");
const Token = artifacts.require("Tiim");

contract('Token tranferFrom', (accounts) => {
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

  it("should raise error when call approve but does not enough tokens fee", () =>
    Token.deployed()
      .then(instance => {
        localInstance   = instance
        fromAddress     = accounts[3]
        spenderAddress  = accounts[1]
        allowedAmount   = web3.utils.toWei('3', 'ether')
      })
      .then(() => localInstance.approve(spenderAddress, allowedAmount, { from: fromAddress }))
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));

  it("should set 3 ether to allowed of owner and add 0.015 ether fee to issuer when approve 3 ether for spender", () =>
    Token.deployed()
      .then(instance => {
        localInstance   = instance
        spenderAddress  = accounts[1]
        fromAddress     = accounts[5]
        allowedAmount   = web3.utils.toWei('3', 'ether')
      })
      .then(instance => localInstance.approve(spenderAddress, allowedAmount, { from: fromAddress }))
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
          accounts[0],
          accounts[0] + " was not"
        );

        assert.equal(
          result.logs[0].args['2'],
          web3.utils.toWei('0.015', 'ether'),
          "0.015 ether was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[1].event,
          'Fee',
          "Fee was not"
        );

        assert.equal(
          result.logs[1].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[1].args['1'],
          0,
          "0 was not"
        );

        assert.equal(
          result.logs[1].args['2'],
          accounts[0],
          accounts[0] + " was not"
        );

        assert.equal(
          result.logs[1].args['3'],
          web3.utils.toWei('0.015', 'ether'),
          "0.015 ether was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[2].event,
          'Approval',
          "Approval was not"
        );

        assert.equal(
          result.logs[2].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['1'],
          spenderAddress,
          spenderAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['2'],
          allowedAmount,
          "3 ether was not"
        );

        return result
      })
      .then(() => localInstance.allowance(fromAddress, spenderAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          allowedAmount,
          "3 ether was not"
        );
      }));

  it("should set 5 ether to allowed of owner and add 0.025 ether fee to issuer when approve 5 ether for spender", () =>
    Token.deployed()
      .then(instance => {
        localInstance   = instance
        issuerAddress   = accounts[0]
        fromAddress     = accounts[5]
        spenderAddress  = accounts[1]
        allowedAmount   = web3.utils.toWei('5', 'ether')
        feeTx           = web3.utils.toWei('0.025', 'ether')
      })
      .then(() => localInstance.approve(spenderAddress, allowedAmount, { from: fromAddress }))
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
          issuerAddress,
          issuerAddress + " was not"
        );

        assert.equal(
          result.logs[0].args['2'],
          feeTx,
          "0.025 ether was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[1].event,
          'Fee',
          "Fee was not"
        );

        assert.equal(
          result.logs[1].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[1].args['1'],
          0,
          "0 was not"
        );

        assert.equal(
          result.logs[1].args['2'],
          issuerAddress,
          issuerAddress + " was not"
        );

        assert.equal(
          result.logs[1].args['3'],
          feeTx,
          "0.025 ether was not"
        );

        return result
      })
      .then(result => {
        assert.equal(
          result.logs[2].event,
          'Approval',
          "Approval was not"
        );

        assert.equal(
          result.logs[2].args['0'],
          fromAddress,
          fromAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['1'],
          spenderAddress,
          spenderAddress + " was not"
        );

        assert.equal(
          result.logs[2].args['2'],
          allowedAmount,
          "5 ether was not"
        );

        return result
      })
      .then(() => localInstance.allowance(fromAddress, spenderAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          allowedAmount,
          "5 ether was not"
        );
      }));

  it("should raise error when approve amount is greater than balance", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        return instance.approve(accounts[1], web3.utils.toWei('99124999997', 'ether'), { from: accounts[5] })
      })
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));

  it("should not change allowed of onwer for spender", () =>
    Token.deployed()
      .then(instance => localInstance.allowance(accounts[5], accounts[1]))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('5', 'ether'),
          "5 ether was not"
        );
      }));

  it("should sub 4 ether to allowed of owner, add 4 ether to toAddress, add 0.02 fee to issuerAddress when call transferFrom 4 ether", () =>
    Token.deployed()
      .then(instance => {
        localInstance     = instance
        fromAddress       = accounts[5]
        toAddress         = accounts[2]
        spenderAddress    = accounts[1]
        issuerAddress     = accounts[0]
        transferValue     = web3.utils.toWei('4', 'ether')
        receiveValue      = transferValue
        feeValue          = web3.utils.toWei('0.02', 'ether')
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => issuerBalance = result)
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => recieverBalance = result)
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.allowance(fromAddress, spenderAddress))
      .then(result => remainingAllowed = result.sub(new BN(transferValue, 10)).toString())
      .then(() => localInstance.transferFrom(fromAddress, toAddress, transferValue, { from: spenderAddress }))
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
          receiveValue,
          "4 ether was not"
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
          "0.02 ether was not"
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
          "0.02 ether was not"
        );

        return result
      })
      .then(() => localInstance.allowance(fromAddress, spenderAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          remainingAllowed,
          "1 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(toAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          recieverBalance.add(new BN(receiveValue, 10)).toString(),
          "4 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          fromBalance.sub(new BN(web3.utils.toWei('4.02', 'ether'), 10)).toString(),
          "4.02 ether was not"
        );
      })
      .then(() => localInstance.balanceOf(issuerAddress))
      .then(result => {
        assert.equal(
          result.valueOf(),
          issuerBalance.add(new BN(feeValue, 10)).toString(),
          "0.02 ether was not"
        );
      }));

  it("should raise error when transfer amount is greater than remainning allowed of owner", () =>
    Token.deployed()
      .then(instance => {
        localInstance     = instance
        fromAddress       = accounts[5]
        toAddress         = accounts[2]
        spenderAddress    = accounts[1]
      })
      .then(() => localInstance.allowance(fromAddress, spenderAddress))
      .then(result => transferValue = result.add(new BN(web3.utils.toWei('1', 'ether'), 10)).toString())
      .then(() => localInstance.transferFrom(fromAddress, toAddress, transferValue, { from: spenderAddress }))
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));

  it("should raise error when fromAddress does not enough fee", () =>
    Token.deployed()
      .then(instance => {
        localInstance     = instance
        fromAddress       = accounts[5]
        toAddress         = accounts[2]
        spenderAddress    = accounts[1]
      })
      .then(() => localInstance.balanceOf(fromAddress))
      .then(result => fromBalance = result)
      .then(() => localInstance.approve(spenderAddress, fromBalance.valueOf().toString(), { from: fromAddress }))
      .then(() => localInstance.transferFrom(fromAddress, toAddress, fromBalance.valueOf().toString(), { from: spenderAddress }))
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));
});
