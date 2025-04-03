/**
 * Utility functions for storing and retrieving data in localStorage
 * to persist application state between page refreshes
 */

// Set an item with a specific key
export const setLocalStorageItem = (key, value) => {
  try {
    // If value is an object, convert it to JSON string
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
    return false;
  }
};

// Get an item by key
export const getLocalStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    
    // Try to parse as JSON, if it fails, return the raw value
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return defaultValue;
  }
};

// Remove an item by key
export const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
    return false;
  }
};

// Clear all items in localStorage
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Store data with an expiration time (in minutes)
export const setWithExpiry = (key, value, expiryMinutes) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expiryMinutes * 60 * 1000,
  };
  return setLocalStorageItem(key, item);
};

// Get data with expiry check (returns null if expired)
export const getWithExpiry = (key, defaultValue = null) => {
  const item = getLocalStorageItem(key);
  if (!item) return defaultValue;
  
  const now = new Date();
  if (now.getTime() > item.expiry) {
    removeLocalStorageItem(key);
    return defaultValue;
  }
  return item.value;
}; 