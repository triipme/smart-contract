const BN = require('bn.js');
const env = require("../lib/env.js");
const Token = artifacts.require("Token");

contract('Token calReleaseAmount', (accounts) => {
  let now = Math.floor(Date.now() / 1000);

  it("should return 15.000.000 when location is 45.000.000, maxTranches is 12, deltaTranche is 4", () =>
    Token.deployed()
      .then(instance => {
        localInstance = instance
        allocation    = 45000000
        maxTranches   = 12
        deltaTranche  = 4
      })
      .then(() => localInstance.calReleaseAmount(allocation, maxTranches, deltaTranche))
      .then(result => {
        assert.equal(
          result.valueOf(),
          15000000,
          "15000000 was not"
        );
      }));
});
