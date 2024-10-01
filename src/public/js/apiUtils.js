/**
 * API Utilities for handling common HTTP requests
 */

// Get base URL from current location
const getBaseUrl = () => {
    const url = window.location.href;
    const matches = url.match(/^(https?:\/\/[^\/]+)/i);
    return matches ? matches[1] : '';
};

/**
 * Creates the request options object for fetch
 * @param {string} method - HTTP method
 * @param {object|null} data - Data to be sent in request body
 * @param {string|null} token - JWT token for authorization
 * @returns {object} - Request options for fetch
 */
const createRequestOptions = (method, data, token) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    return options;
};

/**
 * Makes an API request and returns JSON directly
 * @param {string} route - API endpoint route
 * @param {string} method - HTTP method
 * @param {object|null} data - Data to be sent in request body
 * @param {string|null} token - JWT token for authorization
 * @returns {Promise} - Resolved with JSON response data or rejected with error object
 */
const makeRequest = async (route, method, data = null, token = null) => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${route}`;
    const options = createRequestOptions(method, data, token);

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorJson = await response.json();
        return {
            status: response.status,
            success: false,
            message: errorJson.message || 'API request failed',
            data: errorJson
        };
    }

    const json = await response.json();
    return {
        status: response.status,
        success: true,
        data: json
    };
};

/**
 * Utility functions for common HTTP methods
 * All functions return JSON directly from the API response
 */
const apiUtils = {
    get: async (route, token = null) => 
        await makeRequest(route, 'GET', null, token),
    
    post: async (route, data, token = null) => 
        await makeRequest(route, 'POST', data, token),
    
    put: async (route, data, token = null) => 
        await makeRequest(route, 'PUT', data, token),
    
    patch: async (route, data, token = null) => 
        await makeRequest(route, 'PATCH', data, token),
    
    delete: async (route, token = null) => 
        await makeRequest(route, 'DELETE', null, token),
    
    getBaseUrl
};
