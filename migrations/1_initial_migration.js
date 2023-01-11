const Token = artifacts.require("./MoonToken.sol");
const TokenSale = artifacts.require("./MoonTokenSale.sol");

// module.exports = async function (deployer) {
//   deployer.deploy(Token).then(() => {
//     deployer.deploy(TokenSale, "0xc152Cb1B1E907df8B285020DCdb8a75538965C29");
//   });
//   // If this code doesn't work, to deploy the contract token sale
//   // we have to copy the contract tokenn address and paste here
//   // deployer.deploy(FacuTokenSale, "0xBC0484Ab69982738BcD5FA45947Fc9203551bB7c");
// };

//-----------------starts---------
// module.exports = async function (deployer) {
//   deployer.deploy(Token)
//   const accounts = await web3.eth.getAccounts();
//   const owner = accounts[0];
//   deployer.deploy(TokenSale, owner);
// };
//-------------end-------------------

module.exports = function (deployer) {
  deployer.deploy(Token).then(async () => {
    await deployer.deploy(TokenSale, Token.address);
  });
  // If this code doesn't work, to deploy the contract token sale
  // we have to copy the contract tokenn address and paste here
  // deployer.deploy(FacuTokenSale, "0xBC0484Ab69982738BcD5FA45947Fc9203551bB7c");
};
