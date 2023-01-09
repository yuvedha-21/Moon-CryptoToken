// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import './Token.sol';
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenSale {
    address payable public admin;
    address payable private ethFunds = payable(0xE1a0E1DbDC7498eacdAEcDcAF06eA423ae68721E);
    Token public token;
    uint256 public tokensSold;
    int public tokenPriceUSD;
    AggregatorV3Interface internal priceFeed;

    uint256 public transactionCount;

    event Sell(address _buyer, uint256 _amount);

    struct Transaction {
        address buyer;
        uint256 amount;
    }

    mapping(uint256 => Transaction) public transaction;

    constructor(Token _token) {
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        tokenPriceUSD = 50;
        token = _token;
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
        // Check that the buyer sends the enough ETH
        require(int(msg.value) >= facuTokenPriceETH * int(_amount));
        // Check that the sale contract provides the enough ETH to make this transaction.
        require(token.balanceOf(address(this)) >= _amount);
        // Make the transaction inside of the require
        // transfer returns a boolean value.
        require(token.transfer(msg.sender, _amount));
        // Transfer the ETH of the buyer to us
        ethFunds.transfer(msg.value);
        // Increase the amount of tokens sold
        tokensSold += _amount;
        // Increase the amount of transactions
        transaction[transactionCount] = Transaction(msg.sender, _amount);
        transactionCount++;
        // Emit the Sell event
        emit Sell(msg.sender, _amount);
    }

    function endSale() public {
        require(msg.sender == admin);
        // Return the tokens that were left inside of the sale contract
        uint256 amount = token.balanceOf(address(this));
        require(token.transfer(admin, amount));
        selfdestruct(payable(admin));
    }

}