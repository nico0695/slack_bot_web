const AUTH_KEY = 'authData';

// Function to save user id and token in local storage
export const saveAuthData = (userId: string, token: string): void => {
  const authData = { userId, token };
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth data to local storage:', error);
  }
};

// Function to get user id and token from local storage
export const getAuthData = (): {
  userId: string | null;
  token: string | null;
} => {
  try {
    const authDataString = localStorage.getItem(AUTH_KEY);
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      return { userId: authData.userId, token: authData.token };
    }
  } catch (error) {
    console.error('Error getting auth data from local storage:', error);
  }
  return { userId: null, token: null };
};

// Function to update user id and token in local storage
export const updateAuthData = (userId: string, token: string): void => {
  const authData = { userId, token };
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error updating auth data in local storage:', error);
  }
};

// Function to remove user id and token from local storage
export const removeAuthData = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error removing auth data from local storage:', error);
  }
};
