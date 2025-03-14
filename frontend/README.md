# Frontend for Decentralized Medical Records System

This is the React frontend for the Decentralized Medical Records System dApp. It allows users to connect their wallet, upload medical record IPFS hashes, and interact with the smart contract.

## Prerequisites

1. Node.js and npm installed
2. MetaMask browser extension
3. Access to Sepolia testnet ETH
4. Smart contract deployed to Sepolia network

## Environment Setup

The frontend requires the following configuration:

1. Contract address from your deployed MedicalRecords smart contract
2. Pinata API keys for IPFS integration

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Features

- Connect MetaMask wallet
- Upload medical records to IPFS
- View stored medical records
- Interact with the smart contract on Sepolia testnet

## Troubleshooting

1. **MetaMask Connection Issues**
   - Ensure you're connected to Sepolia testnet
   - Make sure you have sufficient Sepolia ETH

2. **Contract Interaction Errors**
   - Verify the contract address is correct
   - Check if the contract is deployed to Sepolia
   - Ensure your MetaMask account has enough ETH for gas fees

3. **IPFS Upload Issues**
   - Verify Pinata API keys are correct
   - Check file size limits
   - Ensure proper file format

## Development

The frontend is built with:
- React 18
- ethers.js 6
- axios for API calls
- react-router-dom for routing

## Contributing

Feel free to submit issues and enhancement requests.
