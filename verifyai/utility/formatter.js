const toCamelCase = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

/**
 * Recursively converts all keys in an object or an array of objects
 * from snake_case to camelCase.
 * @param {object | Array<object>} data - The data structure to convert.
 * @returns {object | Array<object>} - The converted data structure.
 */
const keysToCamelCase = (data) => {
    if (Array.isArray(data)) {
        // If it's an array, map over it and recursively call keysToCamelCase
        return data.map((item) => keysToCamelCase(item));
    }

    if (typeof data !== 'object' || data === null) {
        // If it's not an object (or is null), return it as is
        return data;
    }

    // Convert object keys
    return Object.keys(data).reduce((acc, key) => {
        const camelCaseKey = toCamelCase(key);
        // Recursively apply conversion to the value
        acc[camelCaseKey] = keysToCamelCase(data[key]); 
        return acc;
    }, {});
};

// Export the primary utility function
module.exports = {
    keysToCamelCase,
    // Exporting toCamelCase might be helpful too, but keysToCamelCase is the main one
    toCamelCase
};
