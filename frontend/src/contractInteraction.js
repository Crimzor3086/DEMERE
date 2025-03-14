import { ethers } from 'ethers';

// TODO: Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Temporary zero address
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "addRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRecords",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct MedicalRecords.Record[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Define the network we want to use (e.g., Sepolia testnet)
const REQUIRED_NETWORK = {
    chainId: "0xaa36a7", // 11155111 in hex (Sepolia)
    chainName: "Sepolia",
    nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "SEP",
        decimals: 18
    },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
};

let provider;
let signer;
let contract;

const switchNetwork = async () => {
    try {
        // Try to switch to the required network
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: REQUIRED_NETWORK.chainId }],
        });
        return true;
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [REQUIRED_NETWORK],
                });
                return true;
            } catch (addError) {
                console.error('Error adding network:', addError);
                return false;
            }
        }
        console.error('Error switching network:', switchError);
        return false;
    }
};

export const initializeContract = async () => {
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            throw new Error("Please install MetaMask to use this application");
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Check and switch network if needed
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== REQUIRED_NETWORK.chainId) {
            const switched = await switchNetwork();
            if (!switched) {
                throw new Error(`Please switch to ${REQUIRED_NETWORK.chainName} network in MetaMask`);
            }
        }

        // Create a provider
        provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get the signer
        signer = await provider.getSigner();

        // Create contract instance
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        return true;
    } catch (error) {
        console.error("Error initializing contract:", error);
        alert(error.message || "Error connecting to MetaMask");
        return false;
    }
};

export const addRecordToBlockchain = async (description, ipfsHash) => {
    try {
        if (!contract) {
            const initialized = await initializeContract();
            if (!initialized) {
                throw new Error("Failed to initialize contract");
            }
        }
        
        const tx = await contract.addRecord(description, ipfsHash);
        await tx.wait();
        
        return true;
    } catch (error) {
        console.error("Error adding record to blockchain:", error);
        alert(error.message || "Error adding record to blockchain");
        return false;
    }
};

export const fetchRecordsFromBlockchain = async () => {
    try {
        if (!contract) {
            const initialized = await initializeContract();
            if (!initialized) {
                throw new Error("Failed to initialize contract");
            }
        }
        
        const records = await contract.getRecords();
        return records;
    } catch (error) {
        console.error("Error fetching records from blockchain:", error);
        alert(error.message || "Error fetching records from blockchain");
        return [];
    }
}; 