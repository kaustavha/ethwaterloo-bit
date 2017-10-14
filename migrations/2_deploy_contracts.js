var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var is = artifacts.require("./IdentityStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(is);
};
