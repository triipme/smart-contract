const env = require("../lib/env.js");
const Token = artifacts.require("Tiim");
const TestingTokenReceiver = artifacts.require("TestingTokenReceiver");
const TestingTokenRelease = artifacts.require("TestingTokenRelease");
// const TestingIncreasement = artifacts.require("TestingIncreasement");

module.exports = function(deployer) {
  // deployer.deploy(TestingIncreasement);

  deployer.deploy(
    Token,
    env.TOKEN_NAME,
    env.TOKEN_SYMBOL,
    env.COMMUNITY_RESERVE_WALLET,
    env.CROWD_FUND_WALLET,
    env.ECO_WALLET,
    env.COMPANY_WALLET,
    env.TEAM_WALLET,
    env.FOUNDER_WALLET
  )

  if (deployer.network == 'test'){
    deployer.deploy(TestingTokenReceiver)

    deployer.link(Token, TestingTokenRelease);
    deployer.deploy(
      TestingTokenRelease,
      env.TOKEN_NAME,
      env.TOKEN_SYMBOL,
      env.COMMUNITY_RESERVE_WALLET,
      env.CROWD_FUND_WALLET,
      env.ECO_WALLET,
      env.COMPANY_WALLET,
      env.TEAM_WALLET,
      env.FOUNDER_WALLET
    )
  }
};
