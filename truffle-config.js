const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config()

const mnemonicPhrase = process.env.MNEMONICS;

module.exports = {
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`
        }),
      network_id: '1',
    },
    development: {
      host: "127.0.0.1",
      port: 8544,
      network_id: 999 // Match any network id
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonicPhrase, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonicPhrase, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`
        }),
      network_id: '3',
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`
        }),
      network_id: '4',
    },
    kovan: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`
        }),
      network_id: '42',
    },
    live: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 1 // Ethereum public network
      // optional config values:
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
    },
  },
  mocha: {
    enableTimeouts: false,
    useColors: true
  }
};
