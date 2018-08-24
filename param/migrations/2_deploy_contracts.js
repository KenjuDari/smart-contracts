var StorageSol = artifacts.require('./Storage.sol')

module.exports = function (deployer) {
  deployer.deploy(StorageSol)
}
