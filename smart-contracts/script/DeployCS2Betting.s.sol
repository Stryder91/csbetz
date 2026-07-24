// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {CS2Betting} from "../src/CS2Betting.sol";

contract DeployCS2Betting is Script {
    // USDC natif sur Base Sepolia
    address constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        vm.startBroadcast();

        CS2Betting betting = new CS2Betting(BASE_SEPOLIA_USDC, msg.sender);

        vm.stopBroadcast();

        console.log("CS2Betting deployed at:", address(betting));
    }
}