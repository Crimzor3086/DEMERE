import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import RecordsList from "./components/RecordsList";
import { initializeContract, addRecordToBlockchain, fetchRecordsFromBlockchain } from "./contractInteraction";

function App() {
  const [records, setRecords] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const initialized = await initializeContract();
      setIsInitialized(initialized);
      if (initialized) {
        const storedRecords = await fetchRecordsFromBlockchain();
        setRecords(storedRecords);
      }
    };
    initialize();
  }, []);

  const addRecord = async (description, ipfsHash) => {
    if (!isInitialized) {
      alert("Please connect to MetaMask first");
      return;
    }
    const success = await addRecordToBlockchain(description, ipfsHash);
    if (success) {
      setRecords([...records, { description, ipfsHash }]);
    }
  };

  return (
    <div>
      <h1>Decentralized Medical Records</h1>
      {!isInitialized && (
        <p style={{ color: 'red' }}>Please connect to MetaMask to use this application</p>
      )}
      <UploadForm addRecord={addRecord} />
      <RecordsList records={records} />
    </div>
  );
}

export default App;
