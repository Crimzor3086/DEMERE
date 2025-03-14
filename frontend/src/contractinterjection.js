import { ethers } from "ethers";
import contractABI from "./MedicalRecordsABI.json"; // Import ABI file

const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Replace with deployed contract address

export const addRecordToBlockchain = async (description, ipfsHash) => {
  if (!window.ethereum) {
    alert("MetaMask is required to interact with the blockchain.");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  try {
    const tx = await contract.storeMedicalRecord(description, ipfsHash);
    await tx.wait();
    alert("Record successfully stored on the blockchain!");
  } catch (error) {
    console.error("Error storing record:", error);
  }
};

export const fetchRecordsFromBlockchain = async () => {
  if (!window.ethereum) return [];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  try {
    const records = await contract.getAllMedicalRecords();
    return records.map((record) => ({
      description: record.description,
      ipfsHash: record.ipfsHash,
    }));
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};
    