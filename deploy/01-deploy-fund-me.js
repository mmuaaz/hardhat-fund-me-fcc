const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config") // can also be written as below
const { verify } = require("../utils/verify")
// const helperConfig = require("../helper-hardhat-config")    || importing whole file
// const networkConfig = helperConfig.networkConfig
;/--------IMPORTS---------*/
//NO main Function
//no main function calling

/*--------------- 3 ways of writing the following function for deploy script here------------- */

//1.                   function deployFunc() {}
//                     module.exports.default = deployFunc

// 2.                  module.exports = async (hre) => {
//                     const { getNamedAccounts, deployments } = hre // pulling out 2 Obejcts from hardhat runtime environment
//                     hre.getNamedAccounts, deployments

// 3.               syntactical sugar
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // pulling out 2 functions namely "deploy" and "log"
    const { deployer } = await getNamedAccounts() // grabbing deployer account from the "getNamedAccounts" object
    const chainId = network.config.chainId

    //  ;/=======creating a condition in which we can run the code based on which chainId we are on*/
    let ethUsdPriceFeedAddress
    // if (developmentChains.includes(network.name)) {
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // "get" is a "hardhat-deploy" function which when called
        //gives us the latest contract deplyments
        // since we didnt extract "get" yet, so we can extract from "deployments" by "deployments.get"
        // or we can extract it from "deployments" in line 20
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    log("=====Deploying and Waiting Confirmations=====")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
        //if (
        //  !developmentChains.includes(chainId == 31337) &&
        //process.env.ETHERSCAN_API_KEY
        //) {
        //  await verify(fundMe.address, args)
    }

    log("------------------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]

// const { getNamedAccounts, deployments, network } = require("hardhat")
// const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// const { verify } = require("../utils/verify")

// module.exports = async ({ getNamedAccounts, deployments }) => {
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const chainId = network.config.chainId

//     let ethUsdPriceFeedAddress
//     if (chainId == 31337) {
//         const ethUsdAggregator = await deployments.get("MockV3Aggregator")
//         ethUsdPriceFeedAddress = ethUsdAggregator.address
//     } else {
//         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
//     }
//     log("----------------------------------------------------")
//     log("Deploying FundMe and waiting for confirmations...")
//     const fundMe = await deploy("FundMe", {
//         from: deployer,
//         args: [ethUsdPriceFeedAddress],
//         log: true,
//         // we need to wait if on a live network so we can verify properly
//         waitConfirmations: network.config.blockConfirmations || 1,
//     })
//     log(`FundMe deployed at ${fundMe.address}`)

//     if (
//         !developmentChains.includes(network.name) &&
//         process.env.ETHERSCAN_API_KEY
//     ) {
//         await verify(fundMe.address, [ethUsdPriceFeedAddress])
//     }
// }

// module.exports.tags = ["all", "fundme"]
