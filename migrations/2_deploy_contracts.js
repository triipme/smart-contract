const env = require("../lib/env.js");
const Token = artifacts.require("TOKEN");
const TestingTokenReceiver = artifacts.require("TestingTokenReceiver");
const TestingTokenRelease = artifacts.require("TestingTokenRelease");

module.exports = function(deployer) {
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
};
