const { assert } = require("chai");

const BigNumber = web3.utils.BN;
require("chai")
  .use(require("chai-shallow-deep-equal"))
  .use(require("chai-bignumber")(BigNumber))
  .use(require("chai-as-promised"))
  .should();

// Load compiled artifacts
const GEM = artifacts.require("GEM");

const CAP = new BigNumber(
  web3.utils.toWei("20000000", "ether") //20,000,000
);

const NAME = "NFTmall GEM Token";

const SYMBOL = "GEM";

const TOKEN_AMOUNT = new BigNumber(
  web3.utils.toWei("1000", "ether") //1,000
);

const TRANSFER_AMOUNT = new BigNumber(
  web3.utils.toWei("300", "ether") //300
);

const APPROVE_AMOUNT = new BigNumber(
  web3.utils.toWei("300", "ether") //300
);

const BURN_AMOUNT = new BigNumber(
  web3.utils.toWei("100", "ether") //100
);

let gem;

function weiToEther(w) {
  return web3.utils.fromWei(w.toString(), "ether");
}

// Start test block
contract("GEM", (accounts) => {
  beforeEach(async () => {
    // Deploy a new token contract contract for each test
    gem = await GEM.new(NAME, SYMBOL, CAP);
  });

  // Test case
  it("displays the token name, symbol, and decimal", async () => {
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    const token_name = await gem.name();
    console.log("Token Name:", token_name.toString());
    const token_symbol = await gem.symbol();
    console.log("Token symbol:", token_symbol.toString());
    const token_decimal = await gem.decimals();
    console.log("Token decimal:", token_decimal.toString());

    assert.equal(token_name.toString(), NAME);
    assert.equal(token_symbol.toString(), SYMBOL);
    assert.equal(token_decimal.toString(), "18");
  });

  it("the maximum token supply is 20,000,000", async () => {
    let cap = await gem.cap();
    console.log("Maximum token supply:", weiToEther(cap));
    assert.equal(Number(weiToEther(cap)), 20000000);
  });

  it("the token contract is in normal (unpaused) state", async () => {
    let paused = await gem.paused();
    assert.isFalse(paused);
  });

  it("only the owner can mint tokens", async () => {
    await gem.mint(accounts[2], TOKEN_AMOUNT, { from: accounts[1] }).should.be
      .rejected;
  });

  it("the owner can mint tokens", async () => {
    await gem.mint(accounts[0], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.mint(accounts[2], TOKEN_AMOUNT).should.be.fulfilled;
    let tokenMinted0 = await gem.balanceOf(accounts[0]);
    let tokenMinted2 = await gem.balanceOf(accounts[2]);
    assert.equal(weiToEther(tokenMinted0), "1000");
    assert.equal(weiToEther(tokenMinted2), "1000");
  });

  it("cannot mint tokens more than the cap allowed", async () => {
    // cap is 20,000,0000
    await gem.mint(accounts[0], web3.utils.toWei("20000001", "ether")).should.be
      .rejected;
  });

  it("can tranfer tokens", async () => {
    await gem.mint(accounts[1], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.transfer(accounts[4], TRANSFER_AMOUNT, { from: accounts[1] })
      .should.be.fulfilled;
  });

  it("can approve tokens", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.approve(accounts[6], APPROVE_AMOUNT, { from: accounts[5] }).should
      .be.fulfilled;
    let approved = await gem.allowance(accounts[5], accounts[6]);
    assert.equal(weiToEther(approved), "300");
  });

  it("can increase or decrease allowance", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.approve(accounts[6], APPROVE_AMOUNT, { from: accounts[5] }).should
      .be.fulfilled;
    let approved = await gem.allowance(accounts[5], accounts[6]);
    assert.equal(weiToEther(approved), "300");

    await gem.increaseAllowance(accounts[6], APPROVE_AMOUNT, {
      from: accounts[5],
    }).should.be.fulfilled;
    approved = await gem.allowance(accounts[5], accounts[6]);
    assert.equal(weiToEther(approved), "600");

    await gem.decreaseAllowance(accounts[6], APPROVE_AMOUNT, {
      from: accounts[5],
    }).should.be.fulfilled;
    approved = await gem.allowance(accounts[5], accounts[6]);
    assert.equal(weiToEther(approved), "300");
  });

  it("a spender cannot transferFrom more than her allowance", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.approve(accounts[6], APPROVE_AMOUNT, { from: accounts[5] }).should
      .be.fulfilled;
    await gem.transferFrom(accounts[5], accounts[7], TOKEN_AMOUNT, {
      from: accounts[6],
    }).should.be.rejected;
  });

  it("a spender can transferFrom within her allowance", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.approve(accounts[6], APPROVE_AMOUNT, { from: accounts[5] }).should
      .be.fulfilled;
    await gem.transferFrom(accounts[5], accounts[7], APPROVE_AMOUNT, {
      from: accounts[6],
    }).should.be.fulfilled;
  });

  it("can burn tokens", async () => {
    await gem.mint(accounts[0], TOKEN_AMOUNT).should.be.fulfilled;
    let bal_before = await gem.balanceOf(accounts[0]);
    await gem.burn(BURN_AMOUNT).should.be.fulfilled;
    let bal_after = await gem.balanceOf(accounts[0]);
    let dif = Number(weiToEther(bal_before)) - Number(weiToEther(bal_after));
    assert.equal(dif, 100);
  });

  it("a token holder cannot burn tokens more than what she owns", async () => {
    await gem.mint(accounts[5], BURN_AMOUNT).should.be.fulfilled;
    await gem.burn(TOKEN_AMOUNT, { from: accounts[5] }).should.be.rejected;
    await gem.burn(BURN_AMOUNT, { from: accounts[5] }).should.be.fulfilled;
  });

  it("only the owner of the token contract can pause the token contract", async () => {
    await gem.pause({ from: accounts[1] }).should.be.rejected;
  });

  it("the owner of the token contract can pause the token contract", async () => {
    await gem.pause().should.be.fulfilled;
    let paused = await gem.paused();
    assert.isTrue(paused);
  });

  it("When token contract is paused, no tokens can be minted", async () => {
    await gem.pause().should.be.fulfilled;
    await gem.mint(accounts[0], TOKEN_AMOUNT).should.be.rejected;
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.rejected;
  });

  it("When token contract is paused, no tokens can be transferred", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.pause().should.be.fulfilled;
    await gem.transfer(accounts[1], TOKEN_AMOUNT, { from: accounts[5] }).should
      .be.rejected;
  });

  it("When token contract is paused, no tokens can be burnt", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.pause().should.be.fulfilled;
    await gem.burn(BURN_AMOUNT, { from: accounts[5] }).should.be.rejected;
  });

  it("When token contract is paused, no tokens can be transferFrom", async () => {
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.approve(accounts[6], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.pause().should.be.fulfilled;
    await gem.transferFrom(accounts[5], accounts[7], TOKEN_AMOUNT, {
      from: accounts[5],
    }).should.be.rejected;
  });

  it("only the owner of the token contract can unpause the paused token contract", async () => {
    await gem.pause().should.be.fulfilled;
    await gem.unpause({ from: accounts[5] }).should.be.rejected;
  });

  it("the token contract cannot be paused if it is already paused", async () => {
    await gem.pause().should.be.fulfilled;
    await gem.pause().should.be.rejected;
  });

  it("the token contract cannot be unpaused if it is already unpaused", async () => {
    await gem.unpause().should.be.rejected;
  });

  it("the owner of the token contract can unpause the paused token contract", async () => {
    await gem.pause().should.be.fulfilled;
    await gem.unpause().should.be.fulfilled;
  });

  it("normal activities resume after the paused token contract is unpaused by the owner", async () => {
    await gem.pause().should.be.fulfilled;
    await gem.unpause().should.be.fulfilled;
    await gem.mint(accounts[5], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.transfer(accounts[2], TRANSFER_AMOUNT, { from: accounts[5] })
      .should.be.fulfilled;
    await gem.approve(accounts[6], APPROVE_AMOUNT, { from: accounts[5] }).should
      .be.fulfilled;
    await gem.transferFrom(accounts[5], accounts[7], APPROVE_AMOUNT, {
      from: accounts[6],
    }).should.be.fulfilled;
    await gem.burn(BURN_AMOUNT, { from: accounts[5] }).should.be.fulfilled;
  });

  it("one who is not the owner of GEM contract cannot take a snapshot", async () => {
    await gem.snapshot({ from: accounts[1] }).should.be.rejected;
  });

  it("the owner can take a snapshot", async () => {
    // take a snapshot
    await gem.snapshot().should.be.fulfilled;

    // take another snapshot
    await gem.snapshot().should.be.fulfilled;


    let newSnapshotEvents = await gem.getPastEvents("Snapshot", {
      fromBlock: 0,
      toBlock: "latest",
    });
    newSnapshotEvents.map(async (e) => {
      console.log("\n===== New Snapshots====");
      console.log("current snapshot Id:", e.returnValues.id);
      console.log("========================\n");
    });
  });

  it("retrieves the total supply at the time `snapshotId` was created", async () => {
    await gem.mint(accounts[2], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.snapshot().should.be.fulfilled;
    let totalSupplyAtSnapshot1 = await gem.totalSupplyAt(1);
    console.log(
      "Total Supply at Snapshot 1:",
      weiToEther(totalSupplyAtSnapshot1)
    );
    assert.equal(Number(weiToEther(totalSupplyAtSnapshot1)), 1000);

    // take another snapshot
    await gem.mint(accounts[2], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.snapshot().should.be.fulfilled;
    let totalSupplyAtSnapshot2 = await gem.totalSupplyAt(2);
    console.log(
      "Total Supply at Snapshot 2:",
      weiToEther(totalSupplyAtSnapshot2)
    );
    assert.equal(Number(weiToEther(totalSupplyAtSnapshot2)), 2000);
  });

  it("Retrieves the balance of `account` at the time `snapshotId` was created", async () => {
    await gem.mint(accounts[3], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.snapshot().should.be.fulfilled;
    let balanceAtSnapshot1 = await gem.balanceOfAt(accounts[3], 1);
    console.log(
      "Balance of accounts[3] at Snapshot 1:",
      weiToEther(balanceAtSnapshot1)
    );
    assert.equal(Number(weiToEther(balanceAtSnapshot1)), 1000);

    // take another snapshot
    await gem.mint(accounts[3], TOKEN_AMOUNT).should.be.fulfilled;
    await gem.snapshot().should.be.fulfilled;
    let balanceAtSnapshot2 = await gem.balanceOfAt(accounts[3], 2);
    console.log(
      "Balance of accounts[3] at Snapshot 2:",
      weiToEther(balanceAtSnapshot2)
    );
    assert.equal(Number(weiToEther(balanceAtSnapshot2)), 2000);
  });

});
