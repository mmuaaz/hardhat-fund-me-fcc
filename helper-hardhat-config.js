const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8 // impored from "MockV3Aggregator.sol", it is a "constructor" function arguments and a function as well
const INITIAL_ANSWER = 200000000000 // the INITIAL ANSWER is starting at 2000 and 8 zeroes after that
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
