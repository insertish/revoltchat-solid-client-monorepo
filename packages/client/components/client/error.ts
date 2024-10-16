/**
 * Turn any error into a i18n key.
 * @param error Error object
 */
export function mapAnyError(error: any) {
  console.error('Encountered an error:', error);

  // Check if Axios error
  if (error.response) {
    // Check if body contains error type
    const type = error.response.data?.type;
    if (type) {
      return type;
    }

    // Otherwise infer from status
    switch (error.response.status) {
      case 429:
        return 'TooManyRequests';
      case 401:
      case 403:
        return 'Unauthorized';
      default:
        return 'UnknownError';
    }
    // Check if network issue
  } else if (error.request) {
    return 'NetworkError';
  }

  return typeof error === 'string' ? error : 'UnknownError';
}

/**
 * Turn any error into a thrown i18n key.
 * @param error Error object
 */
export const mapAndRethrowError = (error: any) => {
  throw mapAnyError(error);
};
