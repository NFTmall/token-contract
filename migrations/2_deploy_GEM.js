const BigNumber = web3.utils.BN;

//ARTIFACTS
const GEM = artifacts.require("GEM");

const cap = new BigNumber(
  web3.utils.toWei("20000000", "ether") //20,000,000
);

const name = "NFTmall GEM Token";

const symbol = "GEM";

module.exports = (deployer, network, accounts) => {
  deployer.deploy(GEM, name, symbol, cap).then(async () => {
    console.log("\nGetting contract instances...");

    // TOKENS
    gem = await GEM.deployed();
    console.log("GEM token:", gem.address);
  });
};
