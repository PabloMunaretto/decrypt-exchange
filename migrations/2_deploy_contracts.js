const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

// Migrate means changing the blockchain state into a new one

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts();
  const feeAcount = accounts[0];
  const feePercent = 10;
  
  await deployer.deploy(Token);
  await deployer.deploy(Exchange, feeAcount, feePercent);
};

// 1- truffle deploy creates abis from the contracts
// 2- truffle migrate adds the abis to the blockchain (it also runs deploy automatically)