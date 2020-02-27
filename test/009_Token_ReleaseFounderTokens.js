const BN = require('bn.js');
const env = require("../lib/env.js");
const TestingTokenRelease = artifacts.require("TestingTokenRelease");

contract('Token founderReleaseTokens', (accounts) => {
  let now = Math.floor(Date.now() / 1000);
  let days = 24 * 3600;

  it("should release 5m tokens to founder wallet when call releaseFounderTokens at 751 days from vesting start at - 1st", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now
        vestingAt         = now + (751 * days)
        releasePeriod     = 30 * days
        releaseAmount     = web3.utils.toWei('5000000', 'ether')
      })
      .then(() => localInstance.changeVestingStartedAt(vestingStartedAt))
      .then(() => localInstance.changeVestingAt(vestingAt))
      .then(() => localInstance.calTranche(vestingStartedAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          25,
          "25 was not"
        );
      })
      .then(() => localInstance.calReleaseAmount(web3.utils.toWei('5000000', 'ether'), 25, 25))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.founderWallet())
      .then(result => {
        assert.equal(
          result.valueOf(),
          env.FOUNDER_WALLET,
          env.FOUNDER_WALLET + " was not"
        );
      })
      .then(() => localInstance.balanceOf(env.FOUNDER_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('0', 'ether'),
          "0 was not"
        );
      })
      .then(() => localInstance.releaseFounderTokens())
      .then(result => {
        assert.equal(
          result.logs.length,
          3,
          "3 was not"
        );
      })
      .then(() => localInstance.balanceOf(env.FOUNDER_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount + " balance was not"
        );
      })
      .then(() => localInstance.totalFounderAllocated())
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount + " allocated was not"
        );
      })
      .then(() => localInstance.founderTranchesReleased())
      .then(result => {
        assert.equal(
          result.valueOf(),
          25,
          "25 was not"
        );
      }));

  it("should raise error when allocated equals allocation", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now
        vestingAt         = now + ((751 + 30) * days)
      })
      .then(() => localInstance.changeVestingAt(vestingAt))
      .then(() => localInstance.releaseTeamTokens())
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));
});
