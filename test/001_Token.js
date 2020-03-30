const env = require("../lib/env.js");
const Token = artifacts.require("Tiim");

contract('Token init', (accounts) => {
  it("should set name is " + env.TOKEN_NAME, () =>
    Token.deployed()
      .then(instance => instance.name())
      .then(result => {
        assert.equal(
          result.valueOf(),
          env.TOKEN_NAME,
          env.TOKEN_NAME + " was not"
        );
      }));

  it("should set symbol is " + env.TOKEN_SYMBOL, () =>
    Token.deployed()
      .then(instance => instance.symbol())
      .then(result => {
        assert.equal(
          result.valueOf(),
          env.TOKEN_SYMBOL,
          env.TOKEN_SYMBOL + " was not"
        );
      }));

  it("should set decimals is 18", () =>
    Token.deployed()
      .then(instance => instance.decimals())
      .then(result => {
        assert.equal(
          result.valueOf(),
          18,
          "18 was not"
        );
      }));

  it("should set totalSupply is 500m", () =>
    Token.deployed()
      .then(instance => instance.totalSupply())
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('500000000', 'ether'),
          "500m was not"
        );
      }));

  it("should set owner", () =>
    Token.deployed()
      .then(instance => instance.issuer())
      .then(result => {
        assert.equal(
          result.valueOf(),
          accounts[0],
          "owner was not"
        );
      }));

  it("should set feePercentage is 0.5%", () =>
    Token.deployed()
      .then(instance => instance.feePercentage())
      .then(result => {
        assert.equal(
          result.valueOf(),
          50,
          "0.5% was not"
        );
      }));

  it("should set issuer balance is 0", () =>
    Token.deployed()
      .then(instance => instance.balanceOf(accounts[0]))
      .then(result => {
        assert.equal(
          result.valueOf(),
          0,
          "0 was not"
        );
      }));

  it("should set COMMUNITY_RESERVE_WALLET is 125,000,000 ether", () =>
    Token.deployed()
      .then(instance => instance.balanceOf(env.COMMUNITY_RESERVE_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('125000000', 'ether'),
          "125,000,000 ether was not"
        );
      }));

  it("should set CROWD_FUND_WALLET is 165,000,000 ether", () =>
    Token.deployed()
      .then(instance => instance.balanceOf(env.CROWD_FUND_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('165000000', 'ether'),
          "165,000,000 ether was not"
        );
      }));

  it("should set ECO_WALLET is 75,000,000 ether", () =>
    Token.deployed()
      .then(instance => instance.balanceOf(env.ECO_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('75000000', 'ether'),
          "75,000,000 ether was not"
        );
      }));

  it("should set COMPANY_WALLET is 85,000,000 ether", () =>
    Token.deployed()
      .then(instance => instance.balanceOf(env.COMPANY_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('85000000', 'ether'),
          "85,000,000 ether was not"
        );
      }));

  it("should set teamAllocation is 45,000,000 ether", () =>
    Token.deployed()
      .then(instance => instance.teamAllocation())
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('45000000', 'ether'),
          "45000000 ether was not"
        );
      }));

  it("should set founderAllocation is 5,000,000 ether", () =>
    Token.deployed()
      .then(instance => instance.founderAllocation())
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('5000000', 'ether'),
          "5000000 ether was not"
        );
      }));

  it("should set TEAM_WALLET is 0 ether", () =>
    Token.deployed()
      .then(instance => instance.balanceOf(env.TEAM_WALLET))
      .then(result => {
        assert.equal(
          result.valueOf(),
          web3.utils.toWei('0', 'ether'),
          "0 ether was not"
        );
      }));
});
