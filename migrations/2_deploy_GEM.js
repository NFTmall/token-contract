const BigNumber = web3.utils.BN;

//ARTIFACTS
const GEM = artifacts.require("GEM");

// const DAO_MULTI_SIG_WALLET = '';

// In local test, just for testing purpose, use accounts[1] as _daoMultiSig address 

module.exports = async (deployer, network, accounts) => {
    await deployer.deploy(GEM, accounts[1]);

    let gem = await GEM.deployed();
    console.log("GEM token:", gem.address);
};
