//  HARDHAT GUIDE FOR FundMe.SOL SC
//  lesson told to create an advanced sample project; which doesnt exist in the latest hardhat version

// RUN COMM:yarn init
// RUN COMM: yarn add --dev hardhat

// SOLIDITY and JS uses "linters" which check for errors or problems in the code: Eslin for JS and Sol-hint for solidity
// you can use linter by RUN COMM: yarn solhint contracts/*.sol    \\ This check all the SC in "contracts" folder and check for problems

// First we set up files i.e., prettierrc, prettierignore, SC files FundMe.sol and PriceConverter.sol
// RUN COMM: yarn hardhat     ||  install  sample project and its dependencies
// install "dotenv" package, "waffle" etc
// RUN COMM: yarn add --dev prettier-plugin-solidity

;/ PriceConverter.sol uses a library from chainlink which hardhat doesnt know about so we need to install it using "yarn package" command*/
// RUN COMM: yarn add --dev @chainlink/contracts
;/ -------------------HARDHAT DEPLOY-------------*/
// is a plugin for replicable deployment and easy testing
// RUN COMM: yarn add --dev hardhat-deploy
// create a new folder naming "deploy"
;/ we need to install "etherjs" but this time we will install hardhat-deploy-ethers by following command*/
//RUN COMM: yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
//basically we are overriding "hardhat ethers" with "hardhat-deploy-ethers"
// Now we can write our deploy scripts in our "deploy" folder

/* importing "hardhat" using require("hardhat") in "hardhat.config" is the same as giving hardhat objects in a function like |  async function (hre) so we can use any of these */
;/------------------MODIFYING SC FundMe.sol -------------*/
// contructor is a function as well; added a parametre naming "address priceFeed" which we will give it based on which chain we are on
//once parametre "address priceFeed" is a set, we can save "AggregatorV3Interface" object as a global variable
//"getConversionRate" is now gonna be passed with "priceFeed",back at PriceConverter.sol we add "aggregatorv3interface priceFeed".
//also pass "priceFeed" in getprice function below getConversionRate and then in the "getPrice Function" you add the global variable "AggregatorV3Interface priceFeed"
;/-------Creating helper-hardhat-config.js--------*/
// taking this exmaple from "Aave"
;/------------------MOCKS-------------*/
;/ MOCKING is used in unit testing. An object under test may have dependencies on other(complex) objects. To isolate the behaior of other objects, you want to replace those objects*/
// with MOCKS that simulate the behaior of real objects for example "chain link price feed" can be replaced by MOCKS. Real objects are impractical to incorporate in to unit testing
//====     deploying Mocks is like deploying a script*/
;/=== so our "01-deploy-fund-me.js" file will have condition to check what network we are runing it on while "00-deploy-mocks.js" file will have conditions to only run if the network*/
;/"hardhat" or "localhost"*/
;/===== Utils------*/
// this folder contains scripts that we are gonna use accross different scripts that are located in "deploy" folder
;/===== Tests------*/
// 2 types of tests; Unit and Staging
// UNIT TESTS: is software testing method by which individual units of source code—sets are tested ;/ can be done on 1. Hardhat network or 2. Forked hardhat network */
// STAGING TEST: is a replica of the real world done on TEST NET. (LAST STOP)
;/========WAFFLE TESTING FRAMEWORK============*/
// This allows us use "expect" keyword
// RUN COMM:  yarn add --dev @nomiclabs/hardhat-waffle

// ethers.utils.parseUnits(value [ , unit = "ether"] ) => BigNumber   returns a BigNumber representation of value, parsed with unit digits(if it is a number)or from the unit
// specified (if a string):
parseUnits("1.0")
// { BigNumber: "1000000000000000000" }

parseUnits("1.0", "ether")
// { BigNumber: "1000000000000000000" }

parseUnits("1.0", 18)
// { BigNumber: "1000000000000000000" }

parseUnits("121.0", "gwei")
// { BigNumber: "121000000000" }

parseUnits("121.0", 9)
// { BigNumber: "121000000000" }
;/------------------BREAKPOINT AND DEBUGGING-------------*/
// to the right of lin number, you can click a "red dot", it will introduce a breakpoint, where we can stop the code and add a "debugger",
// " DEBUGGER" can be accessed from right side menu, press "JAVASCRIPT DEBUG TERMINAL"
// from there you can monitor whats been running, a "debug Terminal" allows us to find out different value like "gas price"
;/------------------console.log AND Solidity DEBUGGING-------------*/
// https://hardhat.org/tutorial/debugging-with-hardhat-network#solidity-console-log
// if you are inside of a hardhat project, you need to import:
// : import "hardhat/console.sol"; in your SC
// after this if you write "console.log" in any place in your SC, similar to JS, it will print whatever you have specified in after console.log
;/================ADVANCED GAS OPTIMIZATION==================*/
// when we create "global variable" they get stored on a solidity "storage", so the "storage" is a giant list of all those variables; this way
//these variables can be accessed all this time
// booleans gets transformed to their "hex", so when we modify our some bool version to be "true" it becomes "0x000....01" and takes a space in storage
// Variable that can change length or dynamic variables like "array" or "mapping" variables; array length gets a slot while its element are
// saved using hashing function, gets saved at a crazy new spot using a hashing algorithm, "mapping" has a blank slot so that solidity knows there is a mapping here which
//needs it slot for its hashing function to work correctly
;/constant variables are stored in the "bytecode" of the contract as solidity swaps the value of it into the variable and stores it in bytecode*/
// "function variables" are deleted once the function is run, so those variables are there during the duration of the function running
;/ "strings" are technically dynamic sized arrays, so we use "memory" keyword before it because solidity wants to know if it needs to save a slot for it*/
//or we need using memory keyword we are telling it keep it only for the duration of the function
;/-----opcodes---*/ // are what tells what parts of bytecode is doing, how much computation each part is doing and things like that
// SLOAD and SSTORE  op codes cost  "800" and "20000**" gas respectively; ** means it can change alot

// so we did some further styling to our FundMe.sol contract, changed the visibility of variables: funder, owner and priceFeed to private
// we added getter functions for each one of those private variables so that we developer can know the "s_" variables are storage variables
// private variable save gas as well
// 1 last gas optimization we could do is that we can replace all "require" with "revert" as require takes a a long string and saves it to the blockchain
;/---WRITING STAGING TESTS*/
// Staging test are written to be running on testnets
// // "?" ternary operator
//  it is a one liner "if" statement, used to "skip"
//the "?" operator is checking if the network.name includes "developmentChains" then skip the whole "describe" code
;/----Pushing to GitHub-----*/
// git and github are different from each other, "git" is version control it allows us to make changes but keep a history which tracks all the changes
// that we make
