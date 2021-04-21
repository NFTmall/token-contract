// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./openzeppelin-contracts/access/Ownable.sol";
import "./openzeppelin-contracts/token/BEP20/extensions/BEP20Capped.sol";

// openzeppeli/contracts Version 4.0.0

contract GEM is Ownable, BEP20Capped {

    address public daoMultiSig;

    string constant NAME = "NFTmall GEM Token";
    string constant SYMBOL = "GEM";
    uint256 constant CAP = 20000000 * 1e18;

    constructor (address daoMultiSig_) BEP20(NAME, SYMBOL) BEP20Capped(CAP) {
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

}
