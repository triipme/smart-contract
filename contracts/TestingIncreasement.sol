pragma solidity >=0.4.25 <0.7.0;

contract TestingIncreasement {
  // mapping (address => uint256) private _balances;
  // uint256 private _minFee;
  address private _issuer;
  uint256 private _seq;

  constructor(){
    _seq = 1;
    _issuer = msg.sender;
  }

  function issuer() public view returns (address) {
    return _issuer;
  }

  function seq() public view returns (uint256) {
    return _seq;
  }

  function incr() public returns (bool) {
    _seq = _seq + 1;
    return true;
  }
}
