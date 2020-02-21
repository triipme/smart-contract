pragma solidity >=0.4.25 <0.7.0;

import "./SafeMath.sol";
import "./Ownable.sol";

// File: contracts/PercentageFeeScheme.sol


contract PercentageFeeScheme is Ownable {

  using SafeMath for uint256;
  uint256 private _feePercentage = 50;

  function feePercentage() public view returns (uint256) {
    return _feePercentage;
  }

  function setFeePercentage(uint256 feePercentage) public onlyOwner {
    require(feePercentage <= 10000);

    _feePercentage = feePercentage;
  }

  function estimateFee(uint256 value) public view returns (uint256) {
    return value.mul(_feePercentage).div(10000);
  }
}
