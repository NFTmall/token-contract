const GEM = artifacts.require("GEM");

module.exports = async (deployer, network, accounts) => {
    const DAO_MULTI_SIG_WALLET = accounts[1]; // In local test, just for testing purpose, use accounts[1] as _daoMultiSig address
    await deployer.deploy(GEM, DAO_MULTI_SIG_WALLET);

    let gem = await GEM.deployed();
    console.log("💎GEM token:", gem.address);
};
