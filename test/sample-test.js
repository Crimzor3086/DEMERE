const { expect } = require("chai");

describe("MedicalRecords", function () {
  it("Should deploy the contract and allow a record to be uploaded", async function () {
    const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    const medicalRecords = await MedicalRecords.deploy();
    await medicalRecords.deployed();

    const [owner] = await ethers.getSigners();
    const ipfsHash = "QmTestHash";

    // Upload a record
    const tx = await medicalRecords.uploadRecord(ipfsHash);
    await tx.wait();

    // Grant access to self for testing
    await medicalRecords.grantAccess(owner.address);

    const records = await medicalRecords.viewRecords(owner.address);
    expect(records[0].ipfsHash).to.equal(ipfsHash);
  });
});
