# Decentralized Medical Records System

This project is a decentralized application (dApp) that allows patients to securely store their medical records on the blockchain and control access to them.

## Features

- **Smart Contract:** Written in Solidity to manage records and access control
- **IPFS Integration:** Uses Pinata for storing encrypted medical records
- **React Frontend:** User interface to interact with the smart contract
- **Deployment:** Uses Hardhat for deployment to Ethereum Sepolia testnet

## Prerequisites

1. Node.js and npm installed
2. MetaMask browser extension installed
3. Infura account for deployment
4. Pinata account for IPFS storage
5. Sepolia testnet ETH (can be obtained from a faucet)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_wallet_private_key_here
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

## Smart Contract Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
5. Save the deployed contract address for frontend configuration

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the contract address in `src/contractInteraction.js`
4. Start the development server:
   ```bash
   npm start
   ```

## MetaMask Configuration

1. Open MetaMask and log in
2. Add the Sepolia test network if not already added
3. Get some Sepolia ETH from a faucet (e.g., https://sepoliafaucet.com)
4. Connect your wallet to the dApp when prompted

## Usage

1. Connect your MetaMask wallet to the application
2. Upload medical records through the interface
3. View your stored records
4. All records are stored on IPFS with their hashes recorded on the blockchain

## Security Considerations

- Keep your private keys and API keys secure
- Never commit the `.env` file to version control
- Use environment variables for sensitive information
- Consider encrypting medical records before uploading to IPFS

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
