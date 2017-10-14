pragma solidity ^0.4.2;

contract IdentityStorage {
  uint storedData;
  string name;
  string private email;
  address associatedAddress;

  function set(uint x, string n, string e, address addy) {
    storedData = x;
    name = n;
    email = e;
    associatedAddress = addy;
  }

  function get() constant returns (uint) {
    return storedData;
  }
}
