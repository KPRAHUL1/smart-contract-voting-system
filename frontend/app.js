const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "string[]", name: "candidateNames", type: "string[]" }],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "voter", type: "address" },
      { indexed: true, internalType: "uint256", name: "candidateIndex", type: "uint256" }
    ],
    name: "VoteCast",
    type: "event"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "candidates",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "voteCount", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCandidates",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint256", name: "voteCount", type: "uint256" }
        ],
        internalType: "struct Voting.Candidate[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "candidateIndex", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const connectButton = document.getElementById("connectButton");
const voteButton = document.getElementById("voteButton");
const walletAddress = document.getElementById("walletAddress");
const candidatesList = document.getElementById("candidatesList");
const candidateIndexInput = document.getElementById("candidateIndex");
const statusEl = document.getElementById("status");

let signer;
let contract;

const setStatus = (message) => {
  statusEl.textContent = message;
};

const renderCandidates = (candidates) => {
  candidatesList.innerHTML = "";
  candidates.forEach((c, index) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>#${index} - ${c.name}</span><strong>${c.voteCount.toString()} votes</strong>`;
    candidatesList.appendChild(row);
  });
};

const loadCandidates = async () => {
  if (!contract) return;
  const candidates = await contract.getCandidates();
  renderCandidates(candidates);
};

const connectWallet = async () => {
  if (!window.ethereum) {
    setStatus("MetaMask is not detected.");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    const address = await signer.getAddress();

    walletAddress.textContent = `Connected: ${address}`;
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    setStatus("Wallet connected.");
    await loadCandidates();
  } catch (error) {
    setStatus(error.reason || error.message || "Failed to connect wallet.");
  }
};

const castVote = async () => {
  if (!contract) {
    setStatus("Connect wallet first.");
    return;
  }

  const rawIndex = candidateIndexInput.value;
  if (rawIndex === "") {
    setStatus("Enter candidate index.");
    return;
  }

  try {
    setStatus("Submitting transaction...");
    const tx = await contract.vote(BigInt(rawIndex));
    await tx.wait();
    setStatus("Vote cast successfully.");
    await loadCandidates();
  } catch (error) {
    setStatus(error.reason || error.shortMessage || error.message || "Transaction failed.");
  }
};

connectButton.addEventListener("click", connectWallet);
voteButton.addEventListener("click", castVote);
