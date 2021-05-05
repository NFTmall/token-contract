const GEM = artifacts.require("GEM");

module.exports = async (deployer, network, accounts) => {
  const GOVERNANCE = accounts[1]; // In local test, just for testing purpose, use accounts[1] as _governance address
  await deployer.deploy(GEM, GOVERNANCE);

  let gem = await GEM.deployed();
  console.log("💎GEM token:", gem.address);
};
