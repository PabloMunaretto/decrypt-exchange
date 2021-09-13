const Token = artifacts.require("Token");

// Migrate means changing the blockchain state into a new one

module.exports = function (deployer) {
  deployer.deploy(Token);
};

// 1- truffle deploy creates abis from the contracts
// 2- truffle migrate adds the the abis to the blockchain (it also runs deploy automatically)