# Blockchain Voting System (POC)

A proof-of-concept decentralized voting system built with Solidity and a lightweight web frontend. Votes are recorded on Ethereum Sepolia so they are transparent and tamper-resistant.

## Architecture

Frontend (HTML + JS) → Ethers.js → MetaMask → Voting Smart Contract → Sepolia

## Features

- Connect MetaMask wallet
- Display candidate list from contract
- Cast a vote from connected account
- Prevent double voting on-chain
- Show live vote counts from blockchain state

## Project Structure

- `contracts/Voting.sol` – Solidity contract
- `frontend/index.html` – Web UI
- `frontend/app.js` – Ethers.js integration and UI logic
- `frontend/style.css` – Basic styling

## 1) Smart Contract: Deploy on Sepolia (Remix)

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create `Voting.sol` and paste `contracts/Voting.sol`
3. Compile with Solidity `^0.8.20`
4. Deploy with **Injected Provider - MetaMask** on Sepolia
5. Constructor input example:

```json
["Alice", "Bob", "Charlie"]
```

6. Save deployed contract address and ABI for frontend config.

## 2) Wallet + Test ETH

- Install MetaMask extension
- Switch to **Sepolia Testnet**
- Get test ETH from faucet (for gas)
  - https://sepoliafaucet.com
  - https://faucet.quicknode.com

## 3) Frontend Setup

This frontend is static and can run from any simple local server.

### Configure contract in frontend

Open `frontend/app.js` and update:

- `CONTRACT_ADDRESS` with your deployed address
- `CONTRACT_ABI` with Remix ABI JSON

### Run locally

From project root:

```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080/frontend/`

## 4) How Voting Works

- `vote(uint256 candidateIndex)` can be called only once per wallet
- Contract uses `hasVoted[address]` mapping to prevent duplicate votes
- Candidate vote count is incremented in contract storage
- UI reads candidates and counts via `getCandidates()`

## Security/POC Notes

- This is educational POC code, not production hardened.
- Gas and throughput constraints apply on public testnet/mainnet.
- Add audits, role controls, and attack-surface review for production.
