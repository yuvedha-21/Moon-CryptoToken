
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("MOON", "moon") {
        _mint(msg.sender, 10000000*10**18);
    }
    
}
// browserify index.js -s bundle -o ./dist/bundle.js