const SafeMath = artifacts.require("SafeMath");
const Ownable = artifacts.require("Ownable");
const FixedFeeScheme = artifacts.require("FixedFeeScheme");
const PercentageFeeScheme = artifacts.require("PercentageFeeScheme");
const Pausable = artifacts.require("Pausable");
const Token = artifacts.require("TOKEN");

var COMMUNITY_RESERVE_WALLET = process.env.COMMUNITY_RESERVE_WALLET
var CROWD_FUND_WALLET = process.env.CROWD_FUND_WALLET
var ECO_WALLET = process.env.ECO_WALLET
var COMPANY_WALLET = process.env.COMPANY_WALLET
var TEAM_WALLET = process.env.TEAM_WALLET
var FOUNDER_WALLET = process.env.FOUNDER_WALLET
var FEE_SCHEME = process.env.FEE_SCHEME

module.exports = function(deployer) {
  deployer.link(SafeMath, FixedFeeScheme);
  deployer.link(Ownable, FixedFeeScheme);
  deployer.deploy(FixedFeeScheme);

  deployer.link(SafeMath, PercentageFeeScheme);
  deployer.link(Ownable, PercentageFeeScheme);
  deployer.deploy(PercentageFeeScheme);
  // deployer.deploy(PercentageFeeScheme);
  //   .then(() => PercentageFeeScheme.deployed())
  //   .then(percentageFeeSchemeContract => {
  //     deployer.link(SafeMath, Token);
  //     deployer.link(Ownable, Token);
  //     deployer.link(Pausable, Token);
  //     return deployer.deploy(
  //       Token,
  //       TOKENCommunityReserveWallet,
  //       TOKENCrowdFundAllocationWallet,
  //       TOKENEcoWallet,
  //       TOKENCompanyWallet,
  //       teamWallet,
  //       founderWallet,
  //       TOKENCrowdFundTomoAllocationWallet,
  //       percentageFeeSchemeContract.address,
  //       {
  //         gas: 4501930,
  //         gasPrice: 30000000000000
  //       }
  //     )
  //   });

  // deployer.link(SafeMath, Token);
  // deployer.link(Ownable, Token);
  // deployer.link(Pausable, Token);
  // return deployer.deploy(
  //   Token,
  //   COMMUNITY_RESERVE_WALLET,
  //   CROWD_FUND_WALLET,
  //   ECO_WALLET,
  //   COMPANY_WALLET,
  //   TEAM_WALLET,
  //   FOUNDER_WALLET,
  //   FEE_SCHEME,
  //   {
  //     // gas: 4501930,
  //     gas: 4901930,
  //     gasPrice: 10000000000000
  //   }
  // )
};
