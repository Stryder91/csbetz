// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

contract CS2Betting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status {
        Open,
        Locked,
        Resolved
    }

    enum Team {
        A,
        B
    }

    struct MatchInfo {
        Status status;
        Team winner; // valide uniquement si status == Resolved
        uint256 poolA;
        uint256 poolB;
        mapping(address => uint256) betsA;
        mapping(address => uint256) betsB;
        mapping(address => bool) claimed;
    }

    IERC20 public immutable bettingToken;

    mapping(uint256 => MatchInfo) private matches;

    event BetPlaced(uint256 indexed matchId, address indexed user, Team team, uint256 amount);
    event BetWithdrawn(uint256 indexed matchId, address indexed user, Team team, uint256 amount);
    event MatchLocked(uint256 indexed matchId);
    event MatchResolved(uint256 indexed matchId, Team winner);
    event WinningsClaimed(uint256 indexed matchId, address indexed user, uint256 amount);

    error MatchNotOpen();
    error MatchNotLocked();
    error MatchNotResolved();
    error NothingToWithdraw();
    error AlreadyClaimed();
    error DidNotBetOnWinningTeam();
    error ZeroAmount();

    constructor(address _bettingToken, address _owner) Ownable(_owner) {
        bettingToken = IERC20(_bettingToken);
    }

    // ---------- Paris ----------

    function placeBet(uint256 matchId, Team team, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        MatchInfo storage m = matches[matchId];
        if (m.status != Status.Open) revert MatchNotOpen();

        // Le joueur dépose ses tokens dans le contrat
        bettingToken.safeTransferFrom(msg.sender, address(this), amount);

        if (team == Team.A) {
            m.betsA[msg.sender] += amount;
            m.poolA += amount;
        } else {
            m.betsB[msg.sender] += amount;
            m.poolB += amount;
        }

        emit BetPlaced(matchId, msg.sender, team, amount);
    }

    function withdrawBet(uint256 matchId, Team team) external nonReentrant {
        MatchInfo storage m = matches[matchId];
        if (m.status != Status.Open) revert MatchNotOpen();

        uint256 amount = team == Team.A ? m.betsA[msg.sender] : m.betsB[msg.sender];
        if (amount == 0) revert NothingToWithdraw();

        if (team == Team.A) {
            m.betsA[msg.sender] = 0;
            m.poolA -= amount;
        } else {
            m.betsB[msg.sender] = 0;
            m.poolB -= amount;
        }

        bettingToken.safeTransfer(msg.sender, amount);

        emit BetWithdrawn(matchId, msg.sender, team, amount);
    }

    // ---------- Administration (oracle off-chain = ton backend NestJS) ----------

    function lockMatch(uint256 matchId) external onlyOwner {
        MatchInfo storage m = matches[matchId];
        if (m.status != Status.Open) revert MatchNotOpen();
        m.status = Status.Locked;
        emit MatchLocked(matchId);
    }

    function resolveMatch(uint256 matchId, Team winner) external onlyOwner {
        MatchInfo storage m = matches[matchId];
        if (m.status != Status.Locked) revert MatchNotLocked();
        m.status = Status.Resolved;
        m.winner = winner;
        emit MatchResolved(matchId, winner);
    }

    // ---------- Réclamation des gains ----------

    function claimWinnings(uint256 matchId) external nonReentrant {
        MatchInfo storage m = matches[matchId];
        if (m.status != Status.Resolved) revert MatchNotResolved();
        if (m.claimed[msg.sender]) revert AlreadyClaimed();

        (uint256 userBet, uint256 winningPool, uint256 losingPool) = m.winner == Team.A
            ? (m.betsA[msg.sender], m.poolA, m.poolB)
            : (m.betsB[msg.sender], m.poolB, m.poolA);

        if (userBet == 0) revert DidNotBetOnWinningTeam();

        m.claimed[msg.sender] = true;

        // gain = mise perso + (mise perso / pool gagnant) * pool perdant
        uint256 payout = userBet;
        if (winningPool > 0 && losingPool > 0) {
            payout += Math.mulDiv(userBet, losingPool, winningPool);
        }

        bettingToken.safeTransfer(msg.sender, payout);

        emit WinningsClaimed(matchId, msg.sender, payout);
    }

    // ---------- Lecture ----------

    function getMatchPools(uint256 matchId) external view returns (uint256 poolA, uint256 poolB, Status status) {
        MatchInfo storage m = matches[matchId];
        return (m.poolA, m.poolB, m.status);
    }

    function getUserBet(uint256 matchId, address user) external view returns (uint256 betOnA, uint256 betOnB) {
        MatchInfo storage m = matches[matchId];
        return (m.betsA[user], m.betsB[user]);
    }

    function hasClaimed(uint256 matchId, address user) external view returns (bool) {
        return matches[matchId].claimed[user];
    }
}