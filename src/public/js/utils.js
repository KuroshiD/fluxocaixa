const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/;
    return regex.test(email);
}

/**
 * Saves a value in localStorage
 * @param {string} key - The key under which the value is stored
 * @param {any} value - The value to be stored (converted to JSON)
 */
const setLocalStorage = (key, value) => {
    if (typeof key === 'string') {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        console.error("Key must be a string");
    }
};

/**
 * Retrieves a value from localStorage
 * @param {string} key - The key to retrieve the value from localStorage
 * @returns {any} - The value parsed from JSON, or null if not found
 */
const getLocalStorage = (key) => {
    if (typeof key === 'string') {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
    } else {
        console.error("Key must be a string");
        return null;
    }
};

const getToken = () => {
    return getLocalStorage("token")
}

const redirectToIndex = (message) => {
    alert(message);
    window.location.href = getBaseUrl();
};

const logout = () => {
    localStorage.removeItem('token');
    window.location.href = getBaseUrl();
};

const validateAndRedirect = async () => {
    const token = getToken();
    if (!token) {
        redirectToIndex("Sessão inexistente");
        return;
    }

    const response = await apiUtils.post('/user/validateToken', null, token);
    if (!response.success) {
        localStorage.removeItem('token');
        redirectToIndex("Sessão expirada");
    }
};
