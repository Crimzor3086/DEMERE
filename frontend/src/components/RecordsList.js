import React from "react";

const RecordsList = ({ records }) => {
  return (
    <div>
      <h3>Stored Medical Records</h3>
      <ul>
        {records.map((record, index) => (
          <li key={index}>
            <strong>{record.description}</strong> - 
            <a href={`https://ipfs.io/ipfs/${record.ipfsHash}`} target="_blank" rel="noopener noreferrer"> View File</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordsList;
