var StorageSol = artifacts.require('./DataRead.sol')

module.exports = function (deployer) {
  deployer.deploy(StorageSol)
}
