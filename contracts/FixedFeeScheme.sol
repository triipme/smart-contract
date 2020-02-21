pragma solidity >=0.4.25 <0.7.0;

import "./SafeMath.sol";
import "./Ownable.sol";

// File: contracts/FixedFeeScheme.sol

contract FixedFeeScheme is Ownable {

    using SafeMath for uint256;
    uint256 private _minFee = 10 ** 16; // default fee 0.01

    /**
    * @dev The amount fee that will be lost when transferring.
    */
    function minFee() public view returns (uint256) {
      return _minFee;
    }

    function setMinFee(uint256 minFee) public onlyOwner {
      _minFee = minFee;
    }

    function estimateFee(uint256 value) public view returns (uint256) {
      return value.mul(0).add(_minFee);
    }
}
