// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./openzeppelin-contracts/access/Ownable.sol";
import "./openzeppelin-contracts/security/Pausable.sol";
import "./openzeppelin-contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "./openzeppelin-contracts/token/ERC20/extensions/ERC20Snapshot.sol";

// mock class using ERC20
contract GEM is Ownable, Pausable, ERC20Snapshot {

    uint256 private _cap;

    constructor (
        string memory name,
        string memory symbol,
        uint256 cap_
    ) ERC20(name, symbol) {
        _cap = cap_;
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
     * @dev Mint `amount` tokens to `account`.
     * @dev This function can only be called by the owner of the contract.
     */
    function mint(address account, uint256 amount) public onlyOwner returns (bool) {
        require(totalSupply() + amount <= cap(), "INFormation: cap exceeded");
        _mint(account, amount);
        return true;
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     */

    function burn(uint256 amount) public returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }
   
    function cap() public view returns (uint256) {
        return _cap;
    }

    /**
     * @dev See {ERC20-_ and ERC20Snapshot-_ beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
    }

}
