// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

// openzeppeli/contracts Version 4.0.0

contract GEM is AccessControl, ERC20, ERC20Pausable, ERC20Burnable, ERC20Snapshot, ERC20Permit {
    string public constant NAME = "NFTmall GEM Token";
    string public constant SYMBOL = "GEM";
    uint256 public constant MAX_TOTAL_SUPPLY = 20_000_000 * 1e18;

    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");       // Whitelisted addresses can transfer token when paused

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "!admin");
        _;
    }

    constructor (address daoMultiSig) ERC20(NAME, SYMBOL) ERC20Permit(NAME) {
        _setupRole(DEFAULT_ADMIN_ROLE, daoMultiSig);   // DEFAULT_ADMIN_ROLE can grant other roles
        _mint(daoMultiSig, MAX_TOTAL_SUPPLY);
    }


    /**
     * @notice Triggers stopped state.
     * Requirements:
     * - The contract must not be paused.
     */
    function pause() external onlyAdmin {
        _pause();
    }

    /**
     * @notice Returns to normal state.
     * Requirements:
     * - The contract must be paused.
     */
    function unpause() external onlyAdmin {
        _unpause();
    }

    /**
     * @notice Creates a new snapshot and returns its snapshot id.
     */
    function snapshot() external onlyAdmin {
        _snapshot();
    }

    /**
     * @dev This function is overriden in both ERC20Pausable and ERC20Snapshot, so we need to specify execution order here.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Pausable, ERC20Snapshot) {
        ERC20Pausable._beforeTokenTransfer(from, to, amount);
        ERC20Snapshot._beforeTokenTransfer(from, to, amount);
    }
}
