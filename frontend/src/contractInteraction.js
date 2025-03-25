import { ethers } from 'ethers';
import { AppError, ErrorCodes } from "./utils/errorHandler";

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
        if (!window.ethereum) {
            throw new AppError(
                "MetaMask is not installed. Please install MetaMask to use this application.",
                ErrorCodes.WALLET_NOT_CONNECTED
            );
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        return true;
    } catch (error) {
        if (error.code === 4001) {
            throw new AppError(
                "Please connect your wallet to use this application",
                ErrorCodes.WALLET_NOT_CONNECTED,
                error
            );
        }
        throw new AppError(
            "Failed to initialize contract",
            ErrorCodes.CONTRACT_INITIALIZATION_FAILED,
            error
        );
    }
};

export const addRecordToBlockchain = async (description, ipfsHash) => {
    try {
        if (!contract) {
            throw new AppError(
                "Contract not initialized. Please connect your wallet first.",
                ErrorCodes.CONTRACT_INITIALIZATION_FAILED
            );
        }

        if (!description || !ipfsHash) {
            throw new AppError(
                "Description and IPFS hash are required",
                ErrorCodes.UPLOAD_FAILED
            );
        }

        // Get the current gas price and fee data
        const feeData = await provider.getFeeData();
        
        // Calculate appropriate gas fees
        const maxFeePerGas = feeData.maxFeePerGas ? 
            feeData.maxFeePerGas * BigInt(2) : // Double the current max fee
            ethers.parseUnits("50", "gwei"); // Default to 50 gwei if not available

        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?
            feeData.maxPriorityFeePerGas * BigInt(2) : // Double the current priority fee
            ethers.parseUnits("2", "gwei"); // Default to 2 gwei if not available

        // Create transaction with appropriate gas settings
        const tx = await contract.addRecord(description, ipfsHash, {
            gasLimit: 500000, // Set a reasonable gas limit
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: maxPriorityFeePerGas
        });

        // Wait for transaction to be mined
        await tx.wait();
        return true;
    } catch (error) {
        if (error.code === 4001) {
            throw new AppError(
                "Transaction was rejected by user",
                ErrorCodes.USER_REJECTED,
                error
            );
        }
        if (error.message?.includes("network")) {
            throw new AppError(
                "Network error. Please check your connection and try again.",
                ErrorCodes.NETWORK_ERROR,
                error
            );
        }
        if (error.message?.includes("insufficient funds")) {
            throw new AppError(
                "Insufficient funds for transaction. Please ensure you have enough Sepolia ETH.",
                ErrorCodes.UPLOAD_FAILED,
                error
            );
        }
        throw new AppError(
            "Failed to upload record to blockchain",
            ErrorCodes.UPLOAD_FAILED,
            error
        );
    }
};

export const fetchRecordsFromBlockchain = async () => {
    try {
        if (!contract) {
            throw new AppError(
                "Contract not initialized. Please connect your wallet first.",
                ErrorCodes.CONTRACT_INITIALIZATION_FAILED
            );
        }

        const records = await contract.getRecords();
        return records;
    } catch (error) {
        if (error.message?.includes("network")) {
            throw new AppError(
                "Network error. Please check your connection and try again.",
                ErrorCodes.NETWORK_ERROR,
                error
            );
        }
        throw new AppError(
            "Failed to fetch records from blockchain",
            ErrorCodes.RECORD_FETCH_FAILED,
            error
        );
    }
}; 