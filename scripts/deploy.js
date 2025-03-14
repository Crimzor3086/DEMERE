const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    console.log("Deploying MedicalRecords...");
    const medicalRecords = await MedicalRecords.deploy();
    await medicalRecords.deployed();
    console.log("MedicalRecords deployed to:", medicalRecords.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
