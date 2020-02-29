pragma solidity >=0.4.25 <0.7.0;

contract TestingTokenReceiver {
  event Receive(address indexed from, uint256 value, bytes data);

  function onTokenTransfer(address from, uint value, bytes memory data) public returns (bool success) {
    require(keccak256(data) != keccak256("invalid"), "invalid");

    emit Receive(from, value, data);

    return true;
  }
}
