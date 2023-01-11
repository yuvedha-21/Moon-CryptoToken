// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './MoonToken.sol';
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MoonTokenSale {
    address payable public admin;
    address payable private ethFunds = payable(0xE1a0E1DbDC7498eacdAEcDcAF06eA423ae68721E);
    MoonToken public moonToken;
    int public tokenPriceUSD;
    AggregatorV3Interface internal priceFeed;
    event Sell(address _buyer, uint256 _amount);

    struct Transaction {
        address buyer;
        uint256 amount;
    }
    constructor(MoonToken tokenAddress) {
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        tokenPriceUSD = 50;
        moonToken = tokenAddress;
        admin = payable(msg.sender);
    }

    function getETHPrice() public view returns(int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return (price / 10**8);
    }

    function facuTokenPriceInETH() public view returns(int) {
        int ethPrice = getETHPrice();
        return tokenPriceUSD / ethPrice;
    }

    function buyToken(uint256 _amount) public payable {
        int facuTokenPriceETH = facuTokenPriceInETH();
        require(int(msg.value) >= facuTokenPriceETH * int(_amount));
        require(moonToken.balanceOf(address(this)) >= _amount);
        require(moonToken.transfer(msg.sender, _amount));
        ethFunds.transfer(msg.value);
        emit Sell(msg.sender, _amount);
    }

    // function endSale() public {
    //     require(msg.sender == admin);
    //     // Return the tokens that were left inside of the sale contract
    //     uint256 amount = moonToken.balanceOf(address(this));
    //     require(moonToken.transfer(admin, amount));
    //     selfdestruct(payable(admin));
    // }

}