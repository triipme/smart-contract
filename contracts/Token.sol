pragma solidity >=0.4.25 <0.7.0;

import "./SafeMath.sol";
import "./Ownable.sol";

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
  uint256 private _minFee;
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
  * @dev The amount fee that will be lost when transferring.
  */
  function minFee() public view returns (uint256) {
    return _minFee;
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
    return value.mul(0).add(_minFee);
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
    require(value <= _balances[msg.sender]);

    uint256 _transferFee = estimateFee(value);
    uint256 _amountReceived = value.sub(_transferFee);

    _transfer(msg.sender, to, _amountReceived);

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
    require(_balances[msg.sender] >= _transferFee);

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
    uint256 _amountReceived = value.sub(_transferFee);

    _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
    _transfer(from, to, _amountReceived);
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
   * @dev Internal function that mints an amount of the token and assigns it to
   * an account. This encapsulates the modification of balances such that the
   * proper events are emitted.
   * @param account The account that will receive the created tokens.
   * @param value The amount that will be created.
   */
  function _mint(address account, uint256 value) internal {
    require(account != address(0));
    _totalSupply = _totalSupply.add(value);
    _balances[account] = _balances[account].add(value);
    emit Transfer(address(0), account, value);
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
  * @dev Change minFee
  * @param value minFee
  */
  function _changeMinFee(uint256 value) internal {
    _minFee = value;
  }
}


contract ERC677Receiver {

  function onTokenTransfer(address from, uint256 amount, bytes memory data) public returns (bool success);

}

interface IFeeScheme {

  function estimateFee(uint256 value) external view returns (uint256);

}

contract TOKEN is TRC21, Ownable {

  mapping (address => uint256) private _balances;
  uint256 private _minFee;
  address private _issuer;
  mapping (address => mapping (address => uint256)) private _allowed;
  uint256 private _totalSupply;

  event Released(address indexed receiver, uint256 amount);
  event Refund(address indexed patron_wallet, uint256 token_remaining_token);

  // Token configurations
  uint8       private constant DECIMALS = 18;
  string      private _name = "SiroSmile";
  string      private _symbol = "SIRO";
  uint8       private _decimals = DECIMALS;
  address     private _communityReserveWallet;
  address     private _crowdFundWallet;
  address     private _ecoWallet;
  address     private _companyWallet;
  address     private _teamWallet;
  address     private _founderWallet;
  IFeeScheme  private _feeScheme;

  // Units
  uint256    private constant TOKEN_UNIT = 10 ** DECIMALS;
  uint256    private constant MILLION_UNIT = 10 ** 6 * TOKEN_UNIT;

  // Allocation: 500,000,000 TOKEN
  uint256    private constant COMMUNITY_RESERVE_ALLOCATION = 125 * MILLION_UNIT;  // 125,000,000 TOKEN
  uint256    private constant CROWD_FUND_ALLOCATION = 165 * MILLION_UNIT;         // 165,000,000 TOKEN
  uint256    private constant ECO_ALLOCATION = 75 * MILLION_UNIT;                 // 75,000,000 TOKEN
  uint256    private constant COMPANY_ALLOCATION = 85 * MILLION_UNIT;             // 85,000,000 TOKEN
  uint256    private constant TEAM_ALLOCATION = 50 * MILLION_UNIT;                // 50,000,000 TOKEN

  // Team and Founder vesting: 50m TOKEN = 45m team members + 5m founder
  uint256    private _vestingStartedAt = 1554051599; // March 31, 2019 23:59:59 GMT+07:00
  uint256    private constant RELEASE_PERIOD = 30 days;

  // Team vesting
  uint256    private constant TEAM_MEMBERS_ALLOCATION = 45 * MILLION_UNIT; // allocate for team : 9% = 45,000,000 TOKEN
  uint256    private _maxTeamMembersTranches = 12;                        // release team tokens 12 tranches every 30 days period = 1 year
  uint256    private _totalTeamMembersAllocated = 0;
  uint256    private _teamMembersTranchesReleased = 0;

  // Founder vesting
  uint256    private constant FOUNDER_ALLOCATION = 5 * MILLION_UNIT; // allocate for founder : 1% = 5,000,000 TOKEN
  uint256    private _maxFounderTranches = 24;                       // release founder tokens 24 tranches every 30 days period = 2 years
  uint256    private _totalFounderAllocated = 0;
  uint256    private _founderTranchesReleased = 0;

  constructor(address communityReserveWallet,
              address crowdFundWallet,
              address ecoWallet,
              address companyWallet,
              address teamWallet,
              address founderWallet,
              address feeScheme
              ) public {

    _totalSupply = 500 * MILLION_UNIT;
    _communityReserveWallet = communityReserveWallet;
    _crowdFundWallet = crowdFundWallet;
    _ecoWallet = ecoWallet;
    _companyWallet = companyWallet;
    _teamWallet = teamWallet;
    _founderWallet = founderWallet;
    _feeScheme = IFeeScheme(feeScheme);

    _changeIssuer(msg.sender);

    _balances[_communityReserveWallet] = _balances[_communityReserveWallet].add(COMMUNITY_RESERVE_ALLOCATION);
    _balances[_crowdFundWallet] = _balances[_crowdFundWallet].add(CROWD_FUND_ALLOCATION);
    _balances[_ecoWallet] = _balances[_ecoWallet].add(ECO_ALLOCATION);
    _balances[_companyWallet] = _balances[_companyWallet].add(COMPANY_ALLOCATION);
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
   * @dev Gets estimate transaction fee base on current feeScheme.
   * @param value amount tokens sent
   */
  function estimateFee(uint256 value) public view returns (uint256) {
    return _feeScheme.estimateFee(value);
  }

  /**
   * @dev Gets estimate transaction fee base on current feeScheme.
   * @param feeScheme contract defined estimateFee func
   * @param value amount tokens sent
   */
  function estimateFeeWithScheme(address feeScheme, uint256 value) public view returns (uint256) {
    return IFeeScheme(feeScheme).estimateFee(value);
  }

  /**
   * @dev set fee scheme for contract, just for owner
   * @param feeScheme contract defined estimateFee func
   */
  function setFeeScheme(address feeScheme) onlyOwner public {
    _feeScheme = IFeeScheme(feeScheme);
  }

  /**
  * @dev ERC677 transfer token to a contract address with additional data if the recipient is a contact.
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  * @param data The extra data to be passed to the receiving contract.
  */
  function transferAndCall(address to, uint256 value, bytes memory data) public returns (bool) {

    require(to != address(0));
    require(value <= _balances[msg.sender]);

    uint256 _transferFee = estimateFee(value);
    if (_isContract(to)) {
      _transferFee = estimateFeeWithScheme(to, value);
    }
    uint256 _amountReceived = value.sub(_transferFee);

    _transfer(msg.sender, to, _amountReceived);

    if (_transferFee > 0) {
      _transfer(msg.sender, _issuer, _transferFee);
      emit Fee(msg.sender, to, _issuer, _transferFee);
    }

    if (_isContract(to)) {
      _contractFallback(to, value, data);
    }

    return true;
  }

  function _contractFallback(address to, uint256 value, bytes memory data) private {
    ERC677Receiver receiver = ERC677Receiver(to);
    receiver.onTokenTransfer(msg.sender, value, data);
  }

  function _isContract(address addr) private view returns (bool hasCode) {
    uint length;
    assembly { length := extcodesize(addr) }
    return length > 0;
  }

  /**
    @dev Release TOKEN Token to Team based on 12 tranches release every 30 days
    @return true if successful
  */
  function releaseTeamTokens() public onlyOwner returns (bool) {
    require(_teamWallet != address(0));
    require(_totalTeamMembersAllocated < TEAM_MEMBERS_ALLOCATION);
    require(_teamMembersTranchesReleased < _maxTeamMembersTranches);

    uint currentTranche = now.sub(_vestingStartedAt).div(RELEASE_PERIOD);

    if (_teamMembersTranchesReleased < _maxTeamMembersTranches && currentTranche > _teamMembersTranchesReleased) {
      uint256 amount = TEAM_MEMBERS_ALLOCATION.div(_maxTeamMembersTranches);
      _balances[_teamWallet] = _balances[_teamWallet].add(amount);
      _totalTeamMembersAllocated = _totalTeamMembersAllocated.add(amount);
      _teamMembersTranchesReleased++;
      emit Transfer(address(0), _teamWallet, amount);
      emit Released(_teamWallet, amount);
    }

    return true;
  }

  /**
    @dev Release TOKEN Token to Founder based on 24 tranches release every 30 days
    @return true if successful
  */
  function releaseFounderTokens() public onlyOwner returns (bool) {
    require(_founderWallet != address(0));
    require(_totalFounderAllocated < FOUNDER_ALLOCATION);
    require(_founderTranchesReleased < _maxFounderTranches);

    uint currentTranche = now.sub(_vestingStartedAt).div(RELEASE_PERIOD);

    if (_founderTranchesReleased < _maxFounderTranches && currentTranche > _founderTranchesReleased) {
      uint256 amount = FOUNDER_ALLOCATION.div(_maxFounderTranches);
      _balances[_founderWallet] = _balances[_founderWallet].add(amount);
      _totalFounderAllocated = _totalFounderAllocated.add(amount);
      _founderTranchesReleased++;

      emit Transfer(address(0), _founderWallet, amount);
      emit Released(_founderWallet, amount);
    }

    return true;
  }
}
