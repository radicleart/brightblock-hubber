var OwnershipRecord = artifacts.require("OwnershipRecord");

module.exports = function(deployer) {
  deployer.deploy(OwnershipRecord);
};
