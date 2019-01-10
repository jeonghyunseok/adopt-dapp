var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "army sport purity kite tree skill address midnight close school alter priority";

module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 8545,
               network_id: "*" // Match any network id
          },
          ropsten: {
              provider: function() {
                  return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/316f404928e54d78a2095032b3b03643')
              },
              network_id: '3',
              gas: 4500000,
              gasPrice: 10000000000,
          }
     }
};
