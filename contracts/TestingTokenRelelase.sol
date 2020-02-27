pragma solidity >=0.4.25 <0.7.0;

import "./Token.sol";

contract TestingTokenRelease is TRC21 {
  string private _name;
  string private _symbol;
  uint8  private _decimals;

  event Released(address indexed receiver, uint256 amount);
  event BeforeReleased(uint256 currentTranche, uint256 tranchesReleased);
  event InReleased(uint256 currentTranche, uint256 tranchesReleased, address to, uint256 releaseAmount);
  event Refund(address indexed patronWallet, uint256 tokenRemainingToken);
  event ReceiverCall(address indexed to, uint256 value, bytes data);

  // Team and Founder vesting: 50m TOKEN = 45m team members + 5m founder
  uint256    private _vestingAt;
  uint256    private _vestingStartedAt;
  uint256    private _releasePeriod = 30 days;

  // Team vesting
  address    private _teamWallet;
  uint256    private _teamAllocation;
  uint256    private _maxTeamTranches = 12; // release team tokens 12 tranches every 30 days period = 1 year
  uint256    private _totalTeamAllocated = 0;
  uint256    private _teamTranchesReleased = 0;

  // Founder vesting
  address    private _founderWallet;
  uint256    private _founderAllocation;
  uint256    private _maxFounderTranches = 25; // release founder tokens 24 tranches every 30 days period = 2 years
  uint256    private _totalFounderAllocated = 0;
  uint256    private _founderTranchesReleased = 0;

  constructor(string  memory name,
              string  memory symbol,
              address communityReserveWallet,
              address crowdFundWallet,
              address ecoWallet,
              address companyWallet,
              address teamWallet,
              address founderWallet
              ) public {

    _teamWallet = teamWallet;
    _founderWallet = founderWallet;

    _name = name;
    _symbol = symbol;
    _decimals = 18;
    _vestingStartedAt = 1554051599; // March 31, 2019 23:59:59 GMT+07:00
    _vestingAt = 0;

    _changeIssuer(msg.sender);
    _changeFeePercentage(50);

    uint256 millionUnit = (10 ** 18) * (10 ** 6);
    _setTotalSupply(500 * millionUnit);                           // 500,000,000
    _setAllocation(communityReserveWallet, 125 * millionUnit);    // 125,000,000
    _setAllocation(crowdFundWallet, 165 * millionUnit);           // 165,000,000
    _setAllocation(ecoWallet, 75 * millionUnit);                  //  75,000,000
    _setAllocation(companyWallet, 85 * millionUnit);              //  85,000,000
    _teamAllocation = 45 * millionUnit;                           //  45,000,000
    _founderAllocation = 5 * millionUnit;                         //   5,000,000
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == issuer());
    _;
  }

  function vestingAt() public view returns (uint256) {
    return _vestingAt;
  }

  function vestingStartedAt() public view returns (uint256) {
    return _vestingStartedAt;
  }

  function releasePeriod() public view returns (uint256) {
    return _releasePeriod;
  }

  function teamWallet() public view returns (address) {
    return _teamWallet;
  }

  function teamAllocation() public view returns (uint256) {
    return _teamAllocation;
  }

  function maxTeamTranches() public view returns (uint256) {
    return _maxTeamTranches;
  }

  function totalTeamAllocated() public view returns (uint256) {
    return _totalTeamAllocated;
  }

  function teamTranchesReleased() public view returns (uint256) {
    return _teamTranchesReleased;
  }

  function founderWallet() public view returns (address) {
    return _founderWallet;
  }

  function founderAllocation() public view returns (uint256) {
    return _founderAllocation;
  }

  function maxFounderTranches() public view returns (uint256) {
    return _maxFounderTranches;
  }

  function totalFounderAllocated() public view returns (uint256) {
    return _totalFounderAllocated;
  }

  function founderTranchesReleased() public view returns (uint256) {
    return _founderTranchesReleased;
  }

  /**
  * @dev Change vestingStartedAt
  * @param value vestingStartedAt
  */
  function changeVestingStartedAt(uint256 value) onlyOwner public {
    _vestingStartedAt = value;
  }

  /**
  * @dev Change vestingAt
  * @param value vestingAt
  */
  function changeVestingAt(uint256 value) onlyOwner public {
    _vestingAt = value;
  }

  /**
   * @return tranche of founder allocation.
   */
  function calTranche(uint256 startAt, uint256 releasePeriod) public view returns (uint256) {
    uint256 _now = now;
    if (_vestingAt != 0) {
      _now = _vestingAt;
    }

    require(startAt <= _now);
    require(0 < releasePeriod);

    return _now.sub(startAt).div(releasePeriod);
  }

  function calReleaseAmount(uint256 allocation, uint256 maxTranches, uint256 deltaTranche) public view returns (uint256) {
    require(0 < maxTranches);

    return allocation.div(maxTranches).mul(deltaTranche);
  }

  function _releaseTokenByTranche(
    address to,
    uint256 startAt,
    uint256 releasePeriod,
    uint256 totalAllocated,
    uint256 allocation,
    uint256 tranchesReleased,
    uint256 maxTranches
  ) internal returns (uint256, uint256){

    require(to != address(0));
    require(totalAllocated < allocation);
    require(tranchesReleased < maxTranches);

    uint256 currentTranche = calTranche(_vestingStartedAt, _releasePeriod);
    if (maxTranches < currentTranche) {
      currentTranche = maxTranches;
    }

    if (tranchesReleased < currentTranche) {
      uint256 deltaTranche = currentTranche - tranchesReleased;
      uint256 releaseAmount = calReleaseAmount(allocation, maxTranches, deltaTranche);
      _setAllocation(to, releaseAmount);
      emit Transfer(address(0), to, releaseAmount);
      emit Released(to, releaseAmount);

      return (deltaTranche, releaseAmount);
    }

    return (0, 0);
  }

  /**
    @dev Release TOKEN Token to Team based on 12 tranches release every 30 days
    @return true if successful
  */
  function releaseTeamTokens() public onlyOwner returns (bool) {
    (uint256 deltaTranche, uint256 releaseAmount) = _releaseTokenByTranche( _teamWallet, _vestingStartedAt, _releasePeriod, _totalTeamAllocated, _teamAllocation, _teamTranchesReleased, _maxTeamTranches);

    if (releaseAmount > 0) {
      _totalTeamAllocated = _totalTeamAllocated.add(releaseAmount);
      _teamTranchesReleased = _teamTranchesReleased.add(deltaTranche);
    }

    return true;
  }

  /**
    @dev Release TOKEN Token to Founder based on 24 tranches release every 30 days
    @return true if successful
  */
  function releaseFounderTokens() public onlyOwner returns (bool) {
    (uint256 deltaTranche, uint256 releaseAmount) = _releaseTokenByTranche( _founderWallet, _vestingStartedAt, _releasePeriod, _totalFounderAllocated, _founderAllocation, _founderTranchesReleased, _maxFounderTranches);

    if (releaseAmount > 0) {
      _totalFounderAllocated = _totalFounderAllocated.add(releaseAmount);
      _founderTranchesReleased = _founderTranchesReleased.add(deltaTranche);
    }


    return true;
  }
}
