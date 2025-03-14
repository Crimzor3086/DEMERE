import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ addRecord }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);
    
    const pinataMetadata = JSON.stringify({ name: file.name });
    const pinataOptions = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataMetadata", pinataMetadata);
    formData.append("pinataOptions", pinataOptions);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "pinata_api_key": process.env.REACT_APP_PINATA_API_KEY,
          "pinata_secret_api_key": process.env.REACT_APP_PINATA_SECRET_KEY,
        },
      });

      const ipfsHash = res.data.IpfsHash;
      addRecord(description, ipfsHash);

    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
    }
  };

  return (
    <div>
      <h3>Upload Medical Record</h3>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
