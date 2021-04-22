import { 
    GEM 
} from "../types/truffle-contracts";

const { BN, constants, expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

const GEM = artifacts.require("GEM");

contract("GEM", ([deployer, daoMultisig, whitelistedUser, user1, user2, user3]) => {
    let token:GEM;
    
    before(async () => {
        token = await GEM.deployed();

        const WHITELISTED_ROLE = await token.WHITELISTED_ROLE();
        token.grantRole(WHITELISTED_ROLE, whitelistedUser, {from:daoMultisig});

        token.transfer(whitelistedUser, web3.utils.toWei('1000', 'ether'), {from:daoMultisig});
        token.transfer(user1, web3.utils.toWei('1000', 'ether'), {from:daoMultisig});
    });

    it("should initially be not paused", async () => {   
        let paused = await token.paused();
        expect(paused).to.be.false;
    });

    it("can be paused", async () => {   
        await token.pause({from:daoMultisig});
        let paused = await token.paused();
        expect(paused).to.be.true;
    });

    it("should not allow arbitrary transfer when paused", async () => {   
        let amount = web3.utils.toWei('10', 'ether');
        await expectRevert(
            token.transfer(user2, amount, {from:user1}),
            "transfers paused"
        );
    });
    it("should not allow arbitrary transferFrom when paused", async () => {   
        let amount = web3.utils.toWei('10', 'ether');
        await token.approve(user3, amount);
        await expectRevert(
            token.transferFrom(user1, user2, amount, {from:user3}),
            "transfers paused"
        );
    });

    it("should allow transfer for whitelisted user", async () => {   
        let amount = web3.utils.toWei('10', 'ether');
        let res = await token.transfer(user2, amount, {from:whitelistedUser});
        expectEvent(res, "Transfer");
    });

    it("should allow transferFrom for whitelisted user", async () => {   
        let amount = web3.utils.toWei('10', 'ether');
        await token.approve(whitelistedUser, amount, {from:user1});
        let res = await token.transferFrom(user1, user2, amount, {from:whitelistedUser});
        expectEvent(res, "Transfer");
    });


});