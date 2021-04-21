// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./openzeppelin-contracts/access/Ownable.sol";
import "./openzeppelin-contracts/token/BEP20/extensions/draft-BEP20Permit.sol";

// openzeppeli/contracts Version 4.0.0

contract GEM is Ownable, BEP20Permit {

    address public daoMultiSig;

    string constant NAME = "NFTmall GEM Token";
    string constant SYMBOL = "GEM";
    uint256 constant CAP = 20000000 * 1e18;

    constructor (address daoMultiSig_) BEP20(NAME, SYMBOL) BEP20Capped(CAP) BEP20Permit(NAME) {
        _mint(daoMultiSig_, CAP);
        transferOwnership(daoMultiSig_);
    
        daoMultiSig = daoMultiSig_;
    }

        /**
     * @dev Triggers stopped state.
     * @dev This function can only be called by the owner of the contract.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */

    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Returns to normal state.
     * @dev This function can only be called by the owner of the contract.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Creates a new snapshot and returns its snapshot id.
     *
     * Emits a {Snapshot} event that contains the same id.
     * Only the owner of this contract can create a snapshot.
     */
    function snapshot() external onlyOwner {
        _snapshot();
    }

    function getChainId() external view returns (uint256) {
        return block.chainid;
    }

}
