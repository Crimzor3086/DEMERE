import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UploadForm from "./components/UploadForm";
import RecordsList from "./components/RecordsList";
import SystemBriefing from "./components/SystemBriefing";
import Navbar from "./components/ui/Navbar";
import Toast from "./components/ui/Toast";
import { ThemeProvider } from "./context/ThemeContext";
import { initializeContract, addRecordToBlockchain, fetchRecordsFromBlockchain } from "./contractInteraction";
import { handleError, ErrorCodes, AppError } from "./utils/errorHandler";
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const initialized = await initializeContract();
        setIsInitialized(initialized);
        if (initialized) {
          const storedRecords = await fetchRecordsFromBlockchain();
          setRecords(storedRecords);
        }
      } catch (error) {
        const handledError = handleError(error);
        showToast(handledError.message);
      }
    };
    initialize();
  }, []);

  const addRecord = async (description, ipfsHash) => {
    if (!isInitialized) {
      const error = new AppError(
        "Please connect your wallet to upload records",
        ErrorCodes.WALLET_NOT_CONNECTED
      );
      const handledError = handleError(error);
      showToast(handledError.message);
      return;
    }

    try {
      const success = await addRecordToBlockchain(description, ipfsHash);
      if (success) {
        setRecords([...records, { description, ipfsHash }]);
        showToast("Record uploaded successfully!", "success");
      }
    } catch (error) {
      const handledError = handleError(error);
      showToast(handledError.message);
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <header className="App-header">
          <h1>DeMeRe</h1>
          <p>Decentralized Medical Records Management System</p>
        </header>
        
        <main className="App-main">
          <SystemBriefing />
          <Navbar isConnected={isInitialized} onConnect={initializeContract} />
          <div className="container">
            <div className="header">
              <h1>Decentralized Medical Records</h1>
              <p className="subtitle">Secure and accessible medical records on the blockchain</p>
            </div>
            
            {!isInitialized && (
              <div className="alert">
                <p>Please connect your wallet to use this application</p>
              </div>
            )}
            
            <div className="content-grid">
              <div className="upload-section">
                <h2>Upload New Record</h2>
                <UploadForm addRecord={addRecord} />
              </div>
              
              <div className="records-section">
                <h2>Your Records</h2>
                <RecordsList records={records} />
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
