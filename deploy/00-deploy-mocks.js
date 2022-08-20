const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
//const { developmentChains } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // pulling out 2 functions namely "deploy" and "log"
    const { deployer } = await getNamedAccounts() // grabbing deployer account from the "getNamedAccounts" object
    // const { chainId } = network.config.chainId
    if (developmentChains.includes(network.name)) {
        log("Local network Detected, Deploying Mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER], //_initialAnswer
        })
        log("Mocks Deployed!")
    }
}
module.exports.tags = ["all", "mocks"]
//module.exports.tags = ["all", "mocks"]
