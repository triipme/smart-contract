const BN = require('bn.js');
const env = require("../lib/env.js");
const Token = artifacts.require("Tiim");

contract('Token calTranche', (accounts) => {
  let now = Math.floor(Date.now() / 1000);

  it("should return 0 when startAt is 29 days ago and releasePeriod is 3 days", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now - (29 * 3600)
        releasePeriod = 30 * 3600
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          0,
          "0 was not"
        );
      }));

  it("should return 1 when startAt is 31 days ago and releasePeriod is 3 days", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now - (31 * 3600)
        releasePeriod = 30 * 3600
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          1,
          "1 was not"
        );
      }));

  it("should return 2 when startAt is 80 days ago and releasePeriod is 3 days", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now - (80 * 3600)
        releasePeriod = 30 * 3600
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          2,
          "2 was not"
        );
      }));

  it("should return 3 when startAt is 91 days ago and releasePeriod is 3 days", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now - (91 * 3600)
        releasePeriod = 30 * 3600
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          3,
          "3 was not"
        );
      }));

  it("should return 12 when startAt is 361 days ago and releasePeriod is 3 days", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now - (361 * 3600)
        releasePeriod = 30 * 3600
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .then(result => {
        assert.equal(
          result.valueOf(),
          12,
          "12 was not"
        );
      }));

  it("should raise error when startAt is greater than now", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now + (31 * 3600)
        releasePeriod = 30 * 3600
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));

  it("should raise error when releasePeriod is 0", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        startAt = now - (31 * 3600)
        releasePeriod = 0
      })
      .then(() => localInstance.calTranche(startAt, releasePeriod))
      .catch(function(error) {
        assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert'
        )
      }));
});
