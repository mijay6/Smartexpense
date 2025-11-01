
export function getErrorMessage(error) {
    if (!error.response) {
        if (error.request) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        return error.message || 'An unexpected error occurred.';
    }

    const { status, data } = error.response;

    switch (status) {
        case 400:
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                return errorMessages.join(', ');
            }
            return data.message || 'Invalid request. Please check your input.';
        
        case 401:
            return 'Authentication failed. Please log in again.';
        
        case 403:
            return 'You do not have permission to perform this action.';
        
        case 404:
            return data.message || 'The requested resource was not found.';
        
        case 409:
            return data.message || 'This operation conflicts with existing data.';
        
        case 422:
            return data.message || 'The data provided is invalid.';
        
        case 429:
            return 'Too many requests. Please try again later.';
        
        case 500:
            return 'Internal server error. Please try again later.';
        
        case 502:
        case 503:
        case 504:
            return 'The server is temporarily unavailable. Please try again later.';
        
        default:
            return data.message || `An error occurred (${status}). Please try again.`;
    }
}

export default getErrorMessage;
