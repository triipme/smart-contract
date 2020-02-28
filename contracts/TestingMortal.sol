pragma solidity >=0.4.25 <0.7.0;

contract TestingOwned {
  address private _owner;

  function owner() public view returns (address) {
    return _owner;
  }

 function _setOwner(address newOwner) internal {
    // require(newOwner != address(0));
    _owner = newOwner;
  }
}

contract TestingMortal is TestingOwned {
  constructor() public {
    _setOwner(msg.sender);
  }
}
