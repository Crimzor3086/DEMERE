import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AppError, ErrorCodes } from "../utils/errorHandler";
import "./UploadForm.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};

const UploadForm = ({ addRecord }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError(new AppError(
          "Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files.",
          ErrorCodes.INVALID_FILE_TYPE
        ));
      } else if (rejection.errors[0]?.code === 'file-too-large') {
        setError(new AppError(
          "File is too large. Maximum size is 10MB.",
          ErrorCodes.FILE_TOO_LARGE
        ));
      }
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setDescription(selectedFile.name);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError(new AppError(
        "Please select a file to upload",
        ErrorCodes.UPLOAD_FAILED
      ));
      return;
    }

    if (!description.trim()) {
      setError(new AppError(
        "Please provide a description for the record",
        ErrorCodes.UPLOAD_FAILED
      ));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // TODO: Implement actual file upload to IPFS
      const ipfsHash = "QmExample"; // Replace with actual IPFS hash

      await addRecord(description, ipfsHash);
      
      // Reset form
      setFile(null);
      setDescription("");
      setUploadProgress(0);
    } catch (error) {
      setError(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="upload-form">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${error ? "error" : ""}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="file-preview">
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {isUploading && (
              <div className="upload-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
                <span className="progress-text">{uploadProgress}%</span>
              </div>
            )}
          </div>
        ) : (
          <div className="dropzone-content">
            <svg
              className="upload-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Drag & drop a file here, or click to select</p>
            <p className="file-types">
              Supported formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <svg
            className="error-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{error.message}</span>
        </div>
      )}

      <div className="form-controls">
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter a description for this record"
          className="description-input"
          disabled={isUploading}
        />
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`upload-button ${isUploading ? "uploading" : ""}`}
        >
          {isUploading ? (
            <>
              <svg
                className="spinner"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4.75V6.25M12 17.75V19.25M4.75 12H6.25M17.75 12H19.25M7.3 17.7L8.4 16.6M15.6 7.4L16.7 6.3M7.3 6.3L8.4 7.4M15.6 16.6L16.7 17.7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Record"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
