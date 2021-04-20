const BigNumber = web3.utils.BN;

//ARTIFACTS
const GEM = artifacts.require("GEM");

const CAP = new BigNumber(
  web3.utils.toWei("20000000", "ether") //20,000,000
);

const NAME = "NFTmall GEM Token";

const SYMBOL = "GEM";

//const DAO_MULTI_SIG_WALLET = '';

// For local test, use accounts[1] as _daoMultiSig address

module.exports = (deployer, network, accounts) => {
  deployer.deploy(GEM, NAME, SYMBOL, accounts[1], CAP).then(async () => {
    console.log("\nGetting contract instances...");

    // TOKENS
    gem = await GEM.deployed();
    console.log("GEM token:", gem.address);
  });
};
