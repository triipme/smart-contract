const PercentageFeeScheme = artifacts.require("PercentageFeeScheme");

contract('PercentageFeeScheme', (accounts) => {
  it("should set feePercentage is 0.5% when init", () =>
    PercentageFeeScheme.deployed()
      .then(instance => instance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf(),
          50,
          "0.5% was not"
        );
      }));

  it("should return fee 0.015 ether when call estimateFee with 3 - ether", () =>
    PercentageFeeScheme.deployed()
      .then(instance => instance.estimateFee(web3.utils.toWei('3', 'ether')))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('0.015', 'ether'),
          "0.015 ether was not"
        );
      }));

  it("should raise error when set feePercentage over 100%", () =>
    PercentageFeeScheme.deployed()
      .then(instance => instance.setFeePercentage(10100))
      .catch(function(error) {
        assert.include(
            error.message,
            'Returned error: VM Exception while processing transaction: revert'
        )
      }));

  it("should not change feePercentage after set feePercentage over 100%", () =>
    PercentageFeeScheme.deployed()
      .then(instance => instance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf(),
          50,
          "0.5% was not"
        );
      }));

  it("should change feePercentage when call setFeePercentage with 2.5%", () =>
    PercentageFeeScheme.deployed()
      .then(instance => {
        localInstance = instance
        instance.setFeePercentage(250)
      })
      .then(() => localInstance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf().toString(),
          250,
          "2.5% was not"
        );
      }));

  it("should return fee 0.05 ether when call estimateFee with 2 - ether", () =>
    PercentageFeeScheme.deployed()
      .then(instance => instance.estimateFee(web3.utils.toWei('2', 'ether')))
      .then(result => {
        assert.equal(
          result.valueOf().toString(),
          web3.utils.toWei('0.05', 'ether'),
          "0.05 ether was not"
        );
      }));
});
