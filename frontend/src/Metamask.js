import { useState, useEffect } from "react";
import { ethers } from "ethers";
import moonT from "./MoonToken.json";
import moonTS from "./MoonTokenSale.json";

export default function App() {
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [error, setError] = useState();
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

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount),
          },
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
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

  // const getMyBalance = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   await provider.send("eth_requestAccounts", []);
  //   const erc20 = new ethers.Contract(contractInfo.address, moonT, provider);
  //   const signer = await provider.getSigner();

  //   const signerAddress = await signer.getAddress();
  //   let balance = await erc20.balanceOf(signerAddress);

  //   setBalanceInfo({
  //     address: signerAddress,
  //     balance: String(balance / 10 ** 18),
  //   });
  // };
  /* global BigInt */
  const handleTransfer = async (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    let amount = BigInt(data.get("amount"));
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
    console.log(Number(await contract.getETHPrice()));
    const ethPrice = await contract.getETHPrice();
    const ethPriceN = ethPrice.toNumber();
    const ftETH = (50 / ethPriceN).toFixed(2);

    console.log(ethPriceN);
    const big = BigInt(data.get("amount") * 10 ** 18);
    await contract.buyToken(big, {
      from: signer.getAddress(),
      // to: signer.getAddress(),
      value: BigInt(data.get("amount") * ftETH * 10 ** 18),
      gasLimit: 500000,
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

  return (
    <div className="grid">
      <div>
        <form className="m-4" onSubmit={handleSubmit}>
          <div className=" lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Read from smart contract
              </h1>
              {/* <div className="">
                <div className="my-3">
                  <input
                    type="text"
                    name="addr"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="ERC20 contract address"
                  />
                </div>
              </div> */}
            </main>
            <footer className="p-4">
              <button type="submit" className="btn">
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
            {/* <div className="p-4">
              <button onClick={getMyBalance} type="submit" className="btn ">
                Pre-Sale Token Details
              </button>
            </div> */}
            {/* <div className="px-4">
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
                      <th>0xE30FC6a9EAd25e0281fCf4615bDBb6970900Ca27</th>
                      <td>{balanceInfo.balance} moons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
        </form>
        <div className="m-4 credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Buy Tokens
            </h1>

            <form onSubmit={handleTransfer}>
              <div className="my-3">
                <input
                  type="text"
                  name="recipient"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient address"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to transfer"
                />
              </div>
              <footer className="p-4">
                <button type="submit" className="btn ">
                  Buy Token
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
      {/* <div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Recent transactions
            </h1>
            <p>
              <TxList txs={txs} />
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
