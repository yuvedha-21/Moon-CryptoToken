import React, { Component } from "react";

import ERC20_ABI from "./Token.json";

import { ethers } from "ethers";

class Metamask extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);
    const block = await provider.getBlockNumber();

    provider.on("block", (block) => {
      this.setState({ block });
    });

    // this.setState({
    //   selectedAddress: accounts[0],
    //   balance: balanceInEther,
    //   block,
    // });

    const daiContract = new ethers.Contract(
      "0xfEE8831E3deAfF924D6293A47fBDcB0AC719260B",
      ERC20_ABI,
      provider
    );
    const tokenName = await daiContract.name();
    const tokenBalance = await daiContract.balanceOf(accounts[0]);
    const tokenUnits = await daiContract.decimals();
    const tokenBalanceInEther = ethers.utils.formatUnits(
      tokenBalance,
      tokenUnits
    );

    this.setState({
      selectedAddress: accounts[0],
      balance: balanceInEther,
      block,
      tokenName,
      tokenBalanceInEther,
    });
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onClick={() => this.connectToMetamask()}>
          Connect to Metamask
        </button>
      );
    } else {
      return (
        <div>
          <p>Welcome {this.state.selectedAddress}</p>
          <p>Your ETH Balance is: {this.state.balance}</p>
          <p>Current ETH Block is: {this.state.block}</p>
          <p>
            Balance of {this.state.tokenName} is:{" "}
            {this.state.tokenBalanceInEther}
          </p>
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderMetamask()}</div>;
  }
}
export default Metamask;
