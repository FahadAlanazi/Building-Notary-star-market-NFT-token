var StarNotary = artifacts.require('./starNotary.sol')

module.exports = function(deployer, network, accounts) {
    deployer.deploy(StarNotary,{from: accounts[0]});
}
