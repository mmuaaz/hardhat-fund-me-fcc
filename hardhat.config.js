//require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox")
//require("solidity-coverage")
require("hardhat-deploy") // The hardhat-deploy plugin to deploy and easy testing
// You need to export an object to set up your config

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || ""
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || ""
const KOVAN_RPC_URL =
    process.env.KOVAN_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            // accounts: ["By default hardhat gives us 10 fake accounts"]
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 42,
            blockConfirmations: 6,
            gas: 6000000,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
        // polygon: {
        //     url: POLYGON_RPC_URL,
        //     accounts: [POLYGON_PRIVATE_KEY],
        //     chainId: 137,
        //     blockConfirmations: 6,
        // },
    },

    solidity: {
        compilers: [
            // may be we run some SC from somewhere like MockV3Aggregator.sol that has different compiler version, so we define them here
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
