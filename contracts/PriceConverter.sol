// PriceConversion is gonna be a library that we are going to attach to a uint256
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface s_priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int256 price, , , ) = s_priceFeed.latestRoundData();
        // THe price it returns are ETH in terms of USD and in the format xxxx.xxxxxxxx
        // solidity doesnt support decimals
        return uint256(price * 10000000000); // 1x10 = 10000000000
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface s_priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(s_priceFeed);
        uint256 ethAmountinUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountinUsd;
    }
}
