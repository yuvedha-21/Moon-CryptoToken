const Token = artifacts.require("./Token.sol");
const TokenSale = artifacts.require("./TokenSale.sol");

// module.exports = async function (deployer) {
//   deployer.deploy(Token).then(() => {
//     deployer.deploy(TokenSale, "0xc152Cb1B1E907df8B285020DCdb8a75538965C29");
//   });
//   // If this code doesn't work, to deploy the contract token sale
//   // we have to copy the contract tokenn address and paste here
//   // deployer.deploy(FacuTokenSale, "0xBC0484Ab69982738BcD5FA45947Fc9203551bB7c");
// };
module.exports = async function (deployer) {
  // deploy the first
  deployer.deploy(Token);

  // get the owner address
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];
  // deploy the second, with address parameter
  deployer.deploy(TokenSale, owner);
};
