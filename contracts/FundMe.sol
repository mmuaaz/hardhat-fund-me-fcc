// SPDX-License-Identifier: MIT
/* =======Fomratted with Solidity Style Guide **/

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    // uint256 public constant MINIMUM_USD = 50 * 1e18; //constant variable are conventionally typed in CAPS\
    // constant and immutable are variable that we set 1 time, helps in gas optimization

    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        // it is a function gets immediately called in the same transaction in which contract is created
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_owner = msg.sender;
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()

    //==========want to be able to set a minimum fund amount in USD============

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        ); //1e18 = 1x10 ^18
        //=1000000000000000000
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        //  emit Funded(msg.sender, msg.value);
    }

    modifier onlyOwner() {
        //require(msg.sender ==i_owner, "Sender is not owner"); // == check if the two variables are equal
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _; // this _ is telling the code to read the rest of your part after you read the above modifier,
        // if "_" was placed above require function, it would mean to read your code first then read whats in the modifier
    }

    //WITHDRAW FUNCTION
    //----------RESET THE ARRAY----------

    //for loop is a loop to loop through some
    // index object/some range of numbers/task
    // a certain amount of times repeating
    function withdraw() public payable onlyOwner {
        /*starting index, ending index, step amount */
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            // for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex = funderIndex + 1 ){   || Also works the same
            //the last piece funderIndex mean that funderIndex itself and +1
            //0,10,1 => then range is 0,1,2,3...10 // 0,10,2 then range is 0,2,4,6,8,10
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
            //console.log("Current balance is zero");
        }

        //WITHDRAW

        s_funders = new address[](0);
        //withdrawing can be done by three different ways:
        // 1. transfer,  payable(msg.sender).transfer(address(this).balance);// capped at 2300 gas, returns an error if failed

        // 2. send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // also capped at 2300, doesnt revert when failed unless you
        // add bool and require method
        // 3. call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success); //Need to learn what this code does
    }

    // view/pure functions

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    // Concepts we didn't cover yet (will cover in later sections)
    // 1. Enum
    // 2. Events
    // 3. Try / Catch
    // 4. Function Selector
    // 5. abi.encode / decode
    // 6. Hash with keccak256
    //  7. Yul / Assembly
}
