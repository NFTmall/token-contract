// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./openzeppelin-contracts/access/Ownable.sol";
import "./openzeppelin-contracts/token/BEP20/extensions/BEP20Pausable.sol";

// openzeppeli/contracts Version 4.0.0

contract GEM is Ownable, BEP20Pausable {

    uint256 private _cap;
    address public _daoMultiSig;

    constructor (
        string memory name,
        string memory symbol,
        address daoMultiSig_,
        uint256 cap_
    ) BEP20(name, symbol) {
        _mint(daoMultiSig_, cap_);
        transferOwnership(daoMultiSig_);
        _cap = cap_;
        _daoMultiSig = daoMultiSig_;
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

    /**
     * @dev Returns the cap of the token.
     */
    function cap() public view returns (uint256) {
        return _cap;
    }

}
