const BN = require('bn.js');
const env = require("../lib/env.js");
const TestingTokenRelease = artifacts.require("TestingTokenRelease");

contract('Token teamReleaseTokens', (accounts) => {
  let now = Math.floor(Date.now() / 1000);
  let days = 24 * 3600;

  it("should release 37.5m tokens to team wallet when call releaseTeamTokens at 31 days from vesting start at - 1st", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now - (31 * days)
        vestingAt         = now
        releasePeriod     = 30 * days
        releaseAmount     = web3.utils.toWei('3750000', 'ether')
        maxTeamTranches   = 12
        deltaTranche      = 1
      })
      .then(() => localInstance.changeVestingStartedAt(vestingStartedAt))
      .then(() => localInstance.changeVestingAt(vestingAt))
      .then(() => localInstance.calTranche(vestingStartedAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          1,
          "1 was not"
        );
      })
      .then(() => localInstance.calReleaseAmount(web3.utils.toWei('45000000', 'ether'), maxTeamTranches, deltaTranche))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.teamWallet())
      .then(result => {
        assert.equal(
          result.valueOf(),
          env.TEAM_WALLET,
          env.TEAM_WALLET + " was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('0', 'ether'),
          "0 was not"
        );
      })
      .then(() => localInstance.releaseTeamTokens())
      .then(result => {
        assert.equal(
          result.logs.length,
          3,
          "3 was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount + " was not"
        );
      })
      .then(() => localInstance.totalTeamAllocated())
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount + " was not"
        );
      })
      .then(() => localInstance.teamTranchesReleased())
      .then(result => {
        assert.equal(
          result.valueOf(),
          1,
          "1 was not"
        );
      }));

  it("should release more 75m tokens to team wallet when call releaseTeamTokens at 61 days from 1st - 2nd", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now - (31 * days)
        vestingAt         = now + (61 * days)
        releasePeriod     = 30 * days
        releaseAmount     = web3.utils.toWei('7500000', 'ether')
        maxTeamTranches   = 12
        deltaTranche      = 2

        expectedTranchesReleased  = 1 + 2
        expectedTotalAllocated    = web3.utils.toWei('11250000', 'ether')
      })
      .then(() => localInstance.changeVestingAt(vestingAt))
      .then(() => localInstance.calTranche(vestingStartedAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTranchesReleased,
          expectedTranchesReleased + " was not"
        );
      })
      .then(() => localInstance.calReleaseAmount(web3.utils.toWei('45000000', 'ether'), maxTeamTranches, deltaTranche))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => teamBalance = result)
      .then(() => localInstance.releaseTeamTokens())
      .then(result => {
        assert.equal(
          result.logs.length,
          3,
          "3 was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          teamBalance.add(new BN(releaseAmount, 10)).toString(),
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.totalTeamAllocated())
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTotalAllocated,
          expectedTotalAllocated.toString() + " was not"
        );
      })
      .then(() => localInstance.teamTranchesReleased())
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTranchesReleased,
          expectedTranchesReleased + " was not"
        );
      }));

  it("should release more 150m tokens to team wallet when call releaseTeamTokens at 120 days from 2st - 3rd", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now - (31 * days)
        vestingAt         = now + ((61 + 120) * days)
        releasePeriod     = 30 * days
        releaseAmount     = web3.utils.toWei('15000000', 'ether')
        maxTeamTranches   = 12
        deltaTranche      = 4

        expectedTranchesReleased  = 1 + 2 + 4
        expectedTotalAllocated    = web3.utils.toWei('26250000', 'ether')
      })
      .then(() => localInstance.changeVestingAt(vestingAt))
      .then(() => localInstance.calTranche(vestingStartedAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTranchesReleased,
          expectedTranchesReleased + " was not"
        );
      })
      .then(() => localInstance.calReleaseAmount(web3.utils.toWei('45000000', 'ether'), maxTeamTranches, deltaTranche))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => teamBalance = result)
      .then(() => localInstance.releaseTeamTokens())
      .then(result => {
        assert.equal(
          result.logs.length,
          3,
          "3 was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          teamBalance.add(new BN(releaseAmount, 10)).toString(),
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.totalTeamAllocated())
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTotalAllocated,
          expectedTotalAllocated.toString() + " was not"
        );
      })
      .then(() => localInstance.teamTranchesReleased())
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTranchesReleased,
          expectedTranchesReleased + " was not"
        );
      }));

  it("should release more 187.5m tokens to team wallet when call releaseTeamTokens at 180 days from 3st - 4rd", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now - (31 * days)
        vestingAt         = now + ((61 + 120 + 180) * days)
        releasePeriod     = 30 * days
        releaseAmount     = web3.utils.toWei('18750000', 'ether')
        maxTeamTranches   = 12
        deltaTranche      = 5

        expectedTranchesReleased  = 1 + 2 + 4 + 5
        expectedTotalAllocated    = web3.utils.toWei('45000000', 'ether')
      })
      .then(() => localInstance.changeVestingAt(vestingAt))
      .then(() => localInstance.calTranche(vestingStartedAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          13,
          "13 was not"
        );
      })
      .then(() => localInstance.calReleaseAmount(web3.utils.toWei('45000000', 'ether'), maxTeamTranches, deltaTranche))
      .then(result => {
        assert.equal(
          result.valueOf(),
          releaseAmount,
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => teamBalance = result)
      .then(() => localInstance.releaseTeamTokens())
      .then(result => {
        assert.equal(
          result.logs.length,
          3,
          "3 was not"
        );
      })
      .then(() => localInstance.balanceOf(env.TEAM_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          teamBalance.add(new BN(releaseAmount, 10)).toString(),
          releaseAmount.toString() + " was not"
        );
      })
      .then(() => localInstance.totalTeamAllocated())
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTotalAllocated,
          expectedTotalAllocated.toString() + " expectedTotalAllocated was not"
        );
      })
      .then(() => localInstance.teamTranchesReleased())
      .then(result => {
        assert.equal(
          result.valueOf(),
          expectedTranchesReleased,
          expectedTranchesReleased + " was not"
        );
      }));

  it("should raise error when allocated equals allocation", () =>
    TestingTokenRelease.deployed()
      .then(instance => {
        localInstance     = instance
        vestingStartedAt  = now - (31 * days)
        vestingAt         = now + ((61 + 120 + 180 + 30) * days)
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
