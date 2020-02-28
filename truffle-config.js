var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MNEMONIC;

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 7546,
      network_id: "*"
    },
    tomotestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://testnet.tomochain.com",
        0,
        1,
        true,
        "m/44'/889'/0'/0/",
      ),
      network_id: 89,
      gas: 4901930,
      gasPrice: 20000000000000
    },
    tomomainnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://rpc.tomochain.com",
        0,
        1,
        true,
        "m/44'/889'/0'/0/",
      ),
      network_id: 88,
      gas: 2000000,
      gasPrice: 10000000000000,
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4a669e46611b47b68eb4ba63089f3552");
      },
      network_id: 4
    }
  }
};
