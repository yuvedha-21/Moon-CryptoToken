import { useState, useEffect } from "react";
import { ethers } from "ethers/lib";
import moonT from "./MoonToken.json";
import moonTS from "./MoonTokenSale.json";

export default function App() {
  const [walletInfo, setwalletInfo] = useState({
    address: "",
  });
  const [transactionInfo, settransactionInfo] = useState({
    pricePerToken: "0.04 Eth",
    totalPay: "",
  });
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(contractInfo.address, moonT, provider);
    }
  }, [contractInfo.address]);

  const handleSubmit = async () => {
    // e.preventDefault();
    // const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(
      "0xfAd57a06F98dD5ddBbCFD3F6Fa88b920181C0b3a",
      moonT,
      provider
    );

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    let totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: "0xfAd57a06F98dD5ddBbCFD3F6Fa88b920181C0b3a",
      tokenName,
      tokenSymbol,
      totalSupply: totalSupply / 10 ** 18,
    });
  };

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc_20 = new ethers.Contract(contractInfo.address, moonT, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    let address = signerAddress;

    setwalletInfo({
      address,
    });
  };

  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc_20 = new ethers.Contract(contractInfo.address, moonT, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    let address = signerAddress;
    let balance = await erc_20.balanceOf(signerAddress);

    setBalanceInfo({
      address,
      balance: String(balance / 10 ** 18),
    });
  };

  /* global BigInt */

  const handleTransfer = async (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0x19A285646c234B6F5950870eeFe9201626Ab1d33",
      moonTS,
      signer
    );
    const erc20 = new ethers.Contract(
      "0xfAd57a06F98dD5ddBbCFD3F6Fa88b920181C0b3a",
      moonT,
      signer
    );
    const ethPrice = await contract.getETHPrice();
    const ethPriceN = ethPrice.toNumber();
    const ftETH = (50 / ethPriceN).toFixed(2);
    const big = BigInt(data.get("amount") * 10 ** 18);
    let totalPay = Number(data.get("amount") * ftETH);
    await contract.buyToken(big, {
      from: signer.getAddress(),
      // to: signer.getAddress(),
      value: BigInt(data.get("amount") * ftETH * 10 ** 18),
      gasLimit: 500000,
    });
    settransactionInfo({
      pricePerToken: String(ftETH),
      totalPay,
    });
    // let addr = ethers.utils.getAddress(data.get("recipient"));

    // // let rec = data.get("recipient");
    // const tx =signer.getAddress().sendTransaction({
    //   to: "0xE1a0E1DbDC7498eacdAEcDcAF06eA423ae68721E",
    //   value: ethers.utils.parseEther(ftETH),
    // });
    // console.log(signerAddress);
    // await erc20.transfer(data.get("recipient"), big);
    // console.log(contract.address(this).balance);
    // await erc20.transfer(
    //   signerAddress,
    //   BigInt(data.get("amount") * ftETH * 10 ** 18)
    // );
  };
  if (window.ethereum) {
    return (
      <div className="grid">
        <div>
          <div className=" lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <div className="m-4">
              {/* <main className="mt-4 p-4"> */}
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                <b>Get Your Moon!!</b>
              </h1>
              {/* </main> */}
              <footer className="p-4">
                <button type="submit" className="btn" onClick={handleSubmit}>
                  Get token info
                </button>
              </footer>
              <div className="px-4">
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Total supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{contractInfo.tokenName}</th>

                        <td>{contractInfo.tokenSymbol}</td>
                        <td>{String(contractInfo.totalSupply)} moons</td>
                        <td>{contractInfo.deployedAt}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-4  ">
              <button onClick={connectWallet} type="submit" className="btn ">
                Connect Wallet
              </button>
              <div>
                <br></br>
              </div>
              <h1 className="text-l font-semibold text-gray-500 ">
                Connected with {walletInfo.address}
              </h1>
            </div>
            <div>
              <div className="p-4">
                <button type="button" className="btn" onClick={getMyBalance}>
                  Get Account Balance
                </button>
              </div>
              <div className="px-4">
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Token Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{balanceInfo.address}</th>
                        <td>{balanceInfo.balance} moons</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="m-4 credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
              <div className="mt-4 p-4">
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                  Buy Tokens
                </h1>
                <br></br>
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                  1 Moon = 50 USD = {transactionInfo.pricePerToken}
                </h1>
                <form onSubmit={handleTransfer}>
                  <div className="my-3">
                    <input
                      type="text"
                      name="amount"
                      className="input input-bordered block w-full focus:ring focus:outline-none"
                      placeholder="Enter Moon count"
                    />
                  </div>
                  {/* <h1>{transactionInfo.totalPay}</h1> */}
                  <footer className="p-4">
                    {/* <h1>{transactionInfo.pricePerToken}</h1> */}
                    <button type="submit" className="btn ">
                      Buy Token
                    </button>
                  </footer>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid">
        <div className="mt-4 p-4 lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            please install metamask and setup your wallet to proceed
          </h1>
        </div>
        <div className="mt-4 p-4 lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white text-center">
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">
            <b>Click here to install Metamask</b>
          </a>
        </div>
      </div>
    );
  }
}
