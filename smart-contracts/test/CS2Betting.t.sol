// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CS2Betting} from "../src/CS2Betting.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract CS2BettingTest is Test {
    CS2Betting public betting;
    MockERC20 public token;

    address owner = makeAddr("owner");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    uint256 constant MATCH_ID = 1;

    function setUp() public {
        token = new MockERC20();
        betting = new CS2Betting(address(token), owner);

        // On mint et approve pour alice et bob
        token.mint(alice, 1000 ether);
        token.mint(bob, 1000 ether);

        vm.prank(alice);
        token.approve(address(betting), type(uint256).max);

        vm.prank(bob);
        token.approve(address(betting), type(uint256).max);
    }

    function test_PlaceBet_UpdatesPoolAndBalance() public {
        vm.prank(alice);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 25 ether);

        (uint256 poolA, uint256 poolB, ) = betting.getMatchPools(MATCH_ID);
        assertEq(poolA, 25 ether);
        assertEq(poolB, 0);
        assertEq(token.balanceOf(address(betting)), 25 ether);
        assertEq(token.balanceOf(alice), 975 ether);
    }

    function test_WithdrawBet_ReturnsTokens() public {
        vm.startPrank(alice);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 25 ether);
        betting.withdrawBet(MATCH_ID, CS2Betting.Team.A);
        vm.stopPrank();

        assertEq(token.balanceOf(alice), 1000 ether);
        (uint256 poolA, , ) = betting.getMatchPools(MATCH_ID);
        assertEq(poolA, 0);
    }

    function test_RevertWhen_WithdrawWithoutBet() public {
        vm.prank(alice);
        vm.expectRevert(CS2Betting.NothingToWithdraw.selector);
        betting.withdrawBet(MATCH_ID, CS2Betting.Team.A);
    }

    function test_RevertWhen_BetAfterLocked() public {
        vm.prank(owner);
        betting.lockMatch(MATCH_ID);

        vm.prank(alice);
        vm.expectRevert(CS2Betting.MatchNotOpen.selector);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 10 ether);
    }

    // Le scénario exact que tu as décrit :
    // Alice mise 25 sur Navi (Team A), pool A = 100 (avec d'autres parieurs)
    // Pool B (Spirit) = 200
    // Alice doit récupérer 25 + 25% de 200 = 25 + 50 = 75
    function test_ClaimWinnings_ProportionalPayout() public {
        address carol = makeAddr("carol");
        token.mint(carol, 1000 ether);
        vm.prank(carol);
        token.approve(address(betting), type(uint256).max);

        // Pool A (Navi) = 100 total : alice 25 + carol 75
        vm.prank(alice);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 25 ether);
        vm.prank(carol);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 75 ether);

        // Pool B (Spirit) = 200 : bob
        vm.prank(bob);
        betting.placeBet(MATCH_ID, CS2Betting.Team.B, 200 ether);

        vm.startPrank(owner);
        betting.lockMatch(MATCH_ID);
        betting.resolveMatch(MATCH_ID, CS2Betting.Team.A); // Navi gagne
        vm.stopPrank();

        uint256 balanceBefore = token.balanceOf(alice);

        vm.prank(alice);
        betting.claimWinnings(MATCH_ID);

        uint256 payout = token.balanceOf(alice) - balanceBefore;
        assertEq(payout, 75 ether); // 25 + (25/100 * 200) = 75
    }

    function test_RevertWhen_ClaimTwice() public {
        vm.prank(alice);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 25 ether);
        vm.prank(bob);
        betting.placeBet(MATCH_ID, CS2Betting.Team.B, 10 ether);

        vm.startPrank(owner);
        betting.lockMatch(MATCH_ID);
        betting.resolveMatch(MATCH_ID, CS2Betting.Team.A);
        vm.stopPrank();

        vm.startPrank(alice);
        betting.claimWinnings(MATCH_ID);
        vm.expectRevert(CS2Betting.AlreadyClaimed.selector);
        betting.claimWinnings(MATCH_ID);
        vm.stopPrank();
    }

    function test_RevertWhen_LoserClaims() public {
        vm.prank(alice);
        betting.placeBet(MATCH_ID, CS2Betting.Team.A, 25 ether);
        vm.prank(bob);
        betting.placeBet(MATCH_ID, CS2Betting.Team.B, 10 ether);

        vm.startPrank(owner);
        betting.lockMatch(MATCH_ID);
        betting.resolveMatch(MATCH_ID, CS2Betting.Team.A); // A gagne, bob a parié B
        vm.stopPrank();

        vm.prank(bob);
        vm.expectRevert(CS2Betting.DidNotBetOnWinningTeam.selector);
        betting.claimWinnings(MATCH_ID);
    }

    function test_RevertWhen_NonOwnerLocks() public {
        vm.prank(alice);
        vm.expectRevert(); // OwnableUnauthorizedAccount
        betting.lockMatch(MATCH_ID);
    }
}