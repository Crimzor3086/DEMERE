export class AppError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export const ErrorCodes = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  CONTRACT_INITIALIZATION_FAILED: 'CONTRACT_INITIALIZATION_FAILED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  RECORD_FETCH_FAILED: 'RECORD_FETCH_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_REJECTED: 'USER_REJECTED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const handleError = (error) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    };
  }

  // Handle MetaMask specific errors
  if (error.code === 4001) {
    return {
      message: 'Transaction was rejected by user',
      code: ErrorCodes.USER_REJECTED,
      details: error
    };
  }

  // Handle network errors
  if (error.message?.includes('network')) {
    return {
      message: 'Network error. Please check your connection and try again.',
      code: ErrorCodes.NETWORK_ERROR,
      details: error
    };
  }

  // Default error
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: ErrorCodes.UNKNOWN_ERROR,
    details: error
  };
}; 