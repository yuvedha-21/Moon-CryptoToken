
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("MOON", "moon") {
        _mint(msg.sender, 10000000*10**18);
    }
}
// 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
//Error: Error: [number-to-bn] while converting number 3.2e+21 to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "3.2e+21"