pragma solidity >=0.4.25 <0.7.0;

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    c = _a * _b;
    assert(c / _a == _b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // assert(_b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
    return _a / _b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    assert(_b <= _a);
    return _a - _b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    c = _a + _b;
    assert(c >= _a);
    return c;
  }
}


/**
 * @title ITRC21
 * @dev TRC21 interface
 * See https://github.com/tomochain/trc21/blob/master/contracts/TRC21.sol#L66
 */
interface ITRC21 {

  function totalSupply() external view returns (uint256);

  function balanceOf(address who) external view returns (uint256);

  function issuer() external view returns (address);

  function estimateFee(uint256 value) external view returns (uint256);

  function allowance(address owner, address spender) external view returns (uint256);

  function transfer(address to, uint256 value) external returns (bool);

  function approve(address spender, uint256 value) external returns (bool);

  function transferFrom(address from, address to, uint256 value) external returns (bool);

  event Approval(address indexed owner, address indexed spender, uint256 value);

  event Transfer(address indexed from, address indexed to, uint256 value);

  event Fee(address indexed from, address indexed to, address indexed issuer, uint256 value);

}


/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract TRC21 is ITRC21 {

  using SafeMath for uint256;

  mapping (address => uint256) private _balances;
  uint256 private _feePercentage;
  address private _issuer;
  mapping (address => mapping (address => uint256)) private _allowed;
  uint256 private _totalSupply;

  /**
  * @dev Total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
  * @dev The fee percentage that will be lost when transferring.
  */
  function feePercentage() public view returns (uint256) {
    return _feePercentage;
  }

  /**
  * @dev token's foundation
  */
  function issuer() public view returns (address) {
    return _issuer;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param owner The address to query the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address owner) public view returns (uint256) {
    return _balances[owner];
  }

  /**
  * @dev Estimate transaction fee.
  * @param value amount tokens sent
  */
  function estimateFee(uint256 value) public view returns (uint256) {
    return value.mul(_feePercentage).div(10000);
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(address owner, address spender) public view returns (uint256){
    return _allowed[owner][spender];
  }

  /**
  * @dev Transfer token for a specified address
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function transfer(address to, uint256 value) public returns (bool) {
    require(to != address(0));

    uint256 _transferFee = estimateFee(value);
    require((value + _transferFee) <= _balances[msg.sender]);

    _transfer(msg.sender, to, value);
    if (_transferFee > 0) {
      _transfer(msg.sender, _issuer, _transferFee);
      emit Fee(msg.sender, to, _issuer, _transferFee);
    }

    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  function approve(address spender, uint value) public returns (bool) {
    require(spender != address(0));

    uint256 _transferFee = estimateFee(value);
    require(_transferFee <= _balances[msg.sender]);

    _allowed[msg.sender][spender] = value;
    _transfer(msg.sender, _issuer, _transferFee);
    emit Fee(msg.sender, address(0), _issuer, _transferFee);
    emit Approval(msg.sender, spender, value);

    return true;
  }

  /**
   * @dev Transfer tokens from one address to another
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param value uint the amount of tokens to be transferred
   */
  function transferFrom(address from, address to, uint256 value) public returns (bool) {
    require(to != address(0));
    require(value <= _allowed[from][msg.sender]);

    uint256 _transferFee = estimateFee(value);
    require((value + _transferFee) <= _balances[from]);

    _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
    _transfer(from, to, value);
    _transfer(from, _issuer, _transferFee);
    emit Fee(from, to, _issuer, _transferFee);

    return true;
  }

  /**
   * @dev Transfer token for a specified addresses
   * @param from The address to transfer from.
   * @param to The address to transfer to.
   * @param value The amount to be transferred.
   */
  function _transfer(address from, address to, uint256 value) internal {
    require(to != address(0));
    require(value <= _balances[from]);

    _balances[from] = _balances[from].sub(value);
    _balances[to] = _balances[to].add(value);
    emit Transfer(from, to, value);
  }

  /**
  * @dev Transfers token's foundation to new issuer
  * @param newIssuer The address to transfer ownership to.
  */
  function _changeIssuer(address newIssuer) internal {
    require(newIssuer != address(0));
    _issuer = newIssuer;
  }

  /**
  * @dev Change feePercentage
  * @param value feePercentage
  */
  function _changeFeePercentage(uint256 value) internal {
    require(value <= 10000);
    _feePercentage = value;
  }

  /**
  * @dev set totalSupply when create contract
  * @param value totalSupply
  */
  function _setTotalSupply(uint256 value) internal {
    _totalSupply = _totalSupply.add(value);
  }

  /**
  * @dev set Allocation when create contract
  * @param value allocation
  */
  function _setAllocation(address account, uint256 value) internal {
    _balances[account] = _balances[account].add(value);
    emit Transfer(address(0), account, value);
  }
}


contract ERC677Receiver {

  function onTokenTransfer(address from, uint256 amount, bytes memory data) public returns (bool success);

}

contract TOKEN is TRC21 {
  string private _name;
  string private _symbol;
  uint8  private _decimals;

  event Released(address indexed receiver, uint256 amount);
  event Refund(address indexed patronWallet, uint256 tokenRemainingToken);
  event ReceiverCall(address indexed to, uint256 value, bytes data);

  // Team and Founder vesting: 50m TOKEN = 45m team members + 5m founder
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
  uint256    private _maxFounderTranches = 25; // release founder tokens 25 tranches every 30 days period = 2 years
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

  /**
   * @return the name of the token.
   */
  function name() public view returns (string memory) {
    return _name;
  }

  /**
   * @return the symbol of the token.
   */
  function symbol() public view returns (string memory) {
    return _symbol;
  }

  /**
   * @return the number of decimals of the token.
   */
  function decimals() public view returns (uint8) {
    return _decimals;
  }

  /**
   * @return tokens of team allocation.
   */
  function teamAllocation() public view returns (uint256) {
    return _teamAllocation;
  }

  /**
   * @return tokens of founder allocation.
   */
  function founderAllocation() public view returns (uint256) {
    return _founderAllocation;
  }

  /**
  * @dev Change feePercentage
  * @param value feePercentage
  */
  function changeFeePercentage(uint256 value) onlyOwner public {
    _changeFeePercentage(value);
  }

  /**
  * @dev ERC677 transfer token to a contract address with additional data if the recipient is a contact.
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  * @param data The extra data to be passed to the receiving contract.
  */
  function transferAndCall(address to, uint256 value, bytes memory data) public returns (bool) {
    transfer(to, value);

    if (_isContract(to)) {
      emit ReceiverCall(to, value, data);

      ERC677Receiver receiver = ERC677Receiver(to);
      return receiver.onTokenTransfer(msg.sender, value, data);
    }

    return true;
  }

  function _isContract(address addr) internal view returns (bool hasCode) {
    uint length;
    assembly { length := extcodesize(addr) }
    return length > 0;
  }

  /**
   * @return tranche of founder allocation.
   */
  function calTranche(uint256 startAt, uint256 releasePeriod) public view returns (uint256) {
    require(startAt <= now);
    require(0 < releasePeriod);

    return now.sub(startAt).div(releasePeriod);
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
    @dev Release TOKEN Token to Founder based on 25 tranches release every 30 days
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
