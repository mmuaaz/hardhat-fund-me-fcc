// We are actually gonna use "hardhat deploy" to automatically set up our tests as if both of the deploy functions have been
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai") // "chai" being overwritten with "waffle" therefore we can import "expect"
//const { expect } = require("@nomiclabs/hardhat-waffle")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

!developmentChains.includes(network.name)
    ? describe.skip // code saying: if network.name doesnt include developmentChains, then skip the whole
    : //"describe" code
      describe("FundMe", /*async*/ function () {
          // "describe" shouldnt have 'async' functions
          let fundMe
          let mockV3Aggregator
          let deployer // initialized a variable, the value of it is coming from where we are "awaiting" to extract from "getNamedAccounts"
          // and whatever in getNamedAccounts is spitting out "deployer" account only and putting in the variable here
          const sendValue = ethers.utils.parseEther("1") //"1000000000000000000" = 1ETH
          beforeEach(async function () {
              // const accounts = await ethers.getSigners()
              // const accountZero = account0
              deployer = (await getNamedAccounts()).deployer // grabbing "deployer" from "getNamedAccounts" and assigning it
              //to "deployer" keyword or variable so that it can be used on other places as well
              await deployments.fixture(
                  /*fixture is a default function on "deployment"**/ ["all"]
              )
              fundMe = await ethers.getContract(
                  /*"hardhat deploy" wraps ethers with a function "getContract"**/
                  "FundMe",
                  deployer /* Connecting deployer with FundMe**/ // now when we call the function on "fundme" it will be
                  //automatically executed from "deployer"
              )
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              //fixture is a default function on "deployment" object which allows us to run every script in our "deploy" folder with as many tags as we need
          }) //deploy using "hardhat fundme "
          ;/========Testing constructor function on FundMe.sol===========*/
          describe("constructor", /*async*/ function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              }) // we want to run this on hardhat network so we need to import MockV3Aggregator
          })
          ;/========Testing "fund" function on FundMe.sol ===========*/
          describe("fund", /*async*/ function () {
              // we will test "fund" function in FundMe.sol
              it("It fails if you dont send Enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  ) // The error message after ".to.be.revertedWith("")" needs to be the same as the error message given in fund function at FundMe.sol
              }) // testing whether the fund which was sent is equal or more than 50 USD
              ;/========Testing If "getAddresstoAmountFunded is updating correctly on FundMe.sol===========*/
              it("Updates to the amountFunded data structure", async function () {
                  await fundMe.fund({ value: sendValue }) // funding our "fund" function with 1ETH

                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              ;/========Testing If "funder array is updating correctly on FundMe.sol===========*/
              it("Adds funder to array of getFunder", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })
          ;/========Testing "withdraw" function on FundMe.sol===========*/
          describe("withdraw", function () {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue }) // Funding the contract before testing
              })
              it("withdraws ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(
                          fundMe.address //saving the current balance after runing "fund" function
                      )
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(
                          deployer // saving the deployer balance after sending the fund amount
                      )

                  // Act
                  const transactionResponse = await fundMe.withdraw() // withdrawing from account
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt // we found out about "gasUsed" and "effectiveGasPrice" variabes
                  //by running debugger
                  const gasCost = gasUsed.mul(effectiveGasPrice) // multiplying gasUsed and effectiveGasPrice, as these are bigNumbers so we
                  // we use ".mul" just like we used ".add"
                  //const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  //const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address // using the getBalance function of the provider object, provider object comes from "ethersjs"
                      //so we could have also used await ethers.provider.getBalance
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //gas Cost
                  // Assert
                  // Maybe clean up to understand the testing
                  assert.equal(endingFundMeBalance, 0) // checking if after withdrawing, balance is getting to zero or not
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  ) // The way we read this code is: adding FundMe.sol balance and Deployer balance and checking to see if they are equal to(SC balance)
                  //after withdrawing and Gas cost); as these values are returned in wei, the "toString" will make sure they are collected as simple values
              })
              ;/========Testing if multilple Funder can fund and upon withwdrawing the "getFunder" array is reset to zero=========*/

              // this test is overloaded. Ideally we'd split it into multiple tests
              // but for simplicity we left it as one
              it("it allows us to withdraw with multiple Funder", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      // getting 6 accounts apart from 0 as 0 is deployer, "for loop" will fund from each of 6 accounts
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue }) // 6 accounts are sending 1 ETH each
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw() //cheaperWithdraw
                  // Let's comapre gas costs :)
                  // const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait()
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
                  // console.log(`GasCost: ${withdrawGasCost}`)
                  // console.log(`GasUsed: ${gasUsed}`)
                  // console.log(`GasPrice: ${effectiveGasPrice}`)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(withdrawGasCost).toString()
                  )
                  // Make a getter for storage variables
                  await expect(fundMe.getFunder(0)).to.be.reverted // getgetFunder
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0 //getAddresstoAmountFunded

                          //            for (i = 1; i < 6; i++) {
                          //              assert.equal(
                          //                await fundMe.getAddressToAmountFunded(accounts[i].address),
                          //              0
                      )
                  }
                  ;/=======Testing if any other account is able to withdraw======*/

                  it("Only allows the owner to withdraw", async function () {
                      const accounts = await ethers.getSigners()
                      const attacker = accounts[1] // extracting index:1 account which is obviously not owner
                      const attackerConnectedContract = await fundMe.connect(
                          attacker
                      )
                      await expect(
                          attackerConnectedContract.withdraw()
                      ).to.be.revertedWith("FundMe__NotOwner") //making sure that the error its reverting it a specific error which we want
                  })
              })
          })
      })
