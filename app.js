const contractAddress = "0x969BF18dFdEEF29293301BECb6Cd36fcc744917f"; // Replace with your deployed contract address

const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "approveLoan", outputs: [],
    stateMutability: "payable", type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "getLoan", outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "view", type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "loans", outputs: [
      { internalType: "address payable", name: "vendor", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bool", name: "approved", type: "bool" },
      { internalType: "bool", name: "repaid", type: "bool" }
    ],
    stateMutability: "view", type: "function"
  },
  {
    inputs: [], name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view", type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "repayLoan", outputs: [],
    stateMutability: "payable", type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "requestLoan", outputs: [],
    stateMutability: "nonpayable", type: "function"
  }
];

let signer, contract;
let walletAddress = "";

// Get UI elements
const requestBtn = document.getElementById("requestBtn");
const statusMsg = document.getElementById("loanStatus");
requestBtn.disabled = true;  // Disable by default

// ✅ Connect Wallet
async function connectWallet() {
  if (!window.ethereum) return alert("🦊 Please install MetaMask.");
  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    walletAddress = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer); // ✅ must be set
    document.getElementById("walletAddress").innerText = `Connected: ${walletAddress}`;
    localStorage.setItem("walletAddress", walletAddress);
    requestBtn.disabled = false;
    await showLoanStatus();
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("❌ Failed to connect wallet.");
  }
}


// ✅ Show Loan Status
async function showLoanStatus() {
  try {
    let index = 0;
    let found = false;
    let message = "⚠️ No loan found yet.";

    while (true) {
      const loan = await contract.loans(index);
      if (loan.vendor.toLowerCase() === walletAddress.toLowerCase()) {
        if (loan.repaid) {
          message = `💸 Loan #${index} repaid.`;
        } else if (loan.approved) {
          message = `✅ Loan #${index} approved.`;
        } else {
          message = `🕒 Loan #${index} pending approval.`;
        }
        found = true;
      }
      index++;
    }
  } catch (err) {
    // break from while when out of bounds
    if (!statusMsg.innerText) {
      statusMsg.innerText = found ? message : "⚠️ No loan found yet.";
    } else {
      statusMsg.innerText = message;
    }
  }
}

// ✅ Request Loan
async function requestLoan() {
  if (!contract) {
    alert("❌ Please connect your wallet first.");
    return;
  }

  const amount = document.getElementById("loanAmount").value;
  if (!amount) return alert("Please enter loan amount");

  try {
    const tx = await contract.requestLoan(ethers.utils.parseUnits(amount, "wei")); // or use "ether" if amount is in ETH
    await tx.wait();
    alert("✅ Loan Requested!");
    await showLoanStatus();
  } catch (error) {
    console.error("Error requesting loan:", error);
    alert("❌ Failed to request loan.");
  }
}


// ✅ Repay Loan (Manual Input)
async function repayLoan() {
  const loanId = document.getElementById("repayLoanId").value;
  if (!loanId) {
    return alert("Please enter a valid Loan ID to repay.");
  }

  try {
    const loan = await contract.getLoan(loanId);
    const loanAmount = loan[1]; // Amount in wei

    const tx = await contract.repayLoan(loanId, {
      value: loanAmount,
    });

    await tx.wait();
    alert("✅ Loan repaid successfully!");
    await showLoanStatus();
  } catch (error) {
    console.error("❌ Error repaying loan:", error);
    alert("❌ Failed to repay loan.\n" + (error?.data?.message || error?.message || "Unknown error"));
  }
}

// ✅ Auto-fill repay amount
document.addEventListener("DOMContentLoaded", () => {
  const loanIdInput = document.getElementById("repayLoanId");
  const amountInput = document.getElementById("repayAmount");

  loanIdInput.addEventListener("input", async () => {
    const loanId = loanIdInput.value;
    if (!loanId) {
      amountInput.value = "";
      return;
    }

    try {
      const loan = await contract.getLoan(loanId);
      const amountInEth = ethers.utils.formatEther(loan[1]);
      amountInput.value = amountInEth;
    } catch (err) {
      amountInput.value = "";
      console.error("Error fetching loan amount:", err);
    }
  });
});








