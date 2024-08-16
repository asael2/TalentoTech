jQuery(document).ready(function () {
    console.log("JQuery cargado...");
  const contractAddress = "0xbD69A5122FeA2f18E244e050379F78dB263d2315"; // Dirección del contrato inteligente
  const abi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "buyEnergytokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newPrice",
          type: "uint256",
        },
      ],
      name: "setTokenPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "admin",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  let provider;
  let signer;
  let contract;

  // Connect to Metamask
  const connectWalletButton = document.getElementById("connect-wallet");

  connectWalletButton.addEventListener("click", async () => {
    console.log("Connecting wallet...");
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      document.getElementById(
        "wallet-address"
      ).textContent = `Wallet Address: ${walletAddress}`;
      contract = new ethers.Contract(contractAddress, abi, signer);
      await updateBalance();
      enableActions();
    } else {
      alert("Please install Metamask");
    }
  });

  // Update TEXTOKEN balance
  async function updateBalance() {
    const balance = await contract.balanceOf(await signer.getAddress());
    document.getElementById(
      "balance"
    ).textContent = `${balance.toString()} TEXTOKEN`;
  }

  // Enable actions after wallet connection
  function enableActions() {
    document.getElementById("balance-section").classList.remove("hidden");
    document.getElementById("buy-section").classList.remove("hidden");
    document.getElementById("transfer-section").classList.remove("hidden");
  }

  // Buy TEXTOKEN
  const buyButton = document.getElementById("buy-button");
  buyButton.addEventListener("click", async () => {
    const amount = document.getElementById("buy-amount").value;
    try {
      const tx = await contract.buyEnergytokens({
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      await updateBalance();
      alert("Tokens purchased successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred during purchase.");
    }
  });

  // Transfer TEXTOKEN
  const transferButton = document.getElementById("transfer-button");
  transferButton.addEventListener("click", async () => {
    const recipient = document.getElementById("transfer-recipient").value;
    const amount = document.getElementById("transfer-amount").value;
    try {
      const tx = await contract.transfer(
        recipient,
        ethers.utils.parseUnits(amount, 18)
      );
      await tx.wait();
      await updateBalance();
      alert("Tokens transferred successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred during transfer.");
    }
  });

  // Update token information
  async function updateTokenInfo() {
    console.log("Updating token info...");
    const totalSupply = await contract.totalSupply();
    console.log("Total supply:", totalSupply.toString());
    document.getElementById("total-supply").textContent = totalSupply.toString();
    document.getElementById("total-supply").textContent =
      totalSupply.toString();
    const tokenPrice = await contract.tokenPrice();
    console.log("Token price:", ethers.utils.formatEther(tokenPrice));
    document.getElementById("token-price").textContent = ethers.utils.formatEther(tokenPrice);
    document.getElementById("token-price").textContent =
      ethers.utils.formatEther(tokenPrice);
  }


  // Initial token information update
  updateTokenInfo();




});
