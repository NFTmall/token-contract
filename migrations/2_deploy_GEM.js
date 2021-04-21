const BigNumber = web3.utils.BN;

//ARTIFACTS
const GEM = artifacts.require("GEM");

// const DAO_MULTI_SIG_WALLET = '';

// In local test, just for testing purpose, use accounts[1] as _daoMultiSig address 

module.exports = (deployer, network, accounts) => {
  deployer.deploy(GEM, accounts[1]).then(async () => {
    console.log("\nGetting contract instances...");

    // TOKENS
    gem = await GEM.deployed();
    console.log("GEM token:", gem.address);
  });
};
