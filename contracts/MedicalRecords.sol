// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    struct Record {
        string description;
        string ipfsHash;
    }

    Record[] private records;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function addRecord(string memory description, string memory ipfsHash) public {
        records.push(Record(description, ipfsHash));
    }

    function getRecords() public view returns (Record[] memory) {
        return records;
    }
}
