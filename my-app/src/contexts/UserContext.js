import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            // Token expired, try to refresh the token
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              const refreshResponse = await axios.post('http://localhost:3001/auth/refresh', { token: refreshToken });
              localStorage.setItem('token', refreshResponse.data.token);
              fetchUser(); // Retry fetching the user with the new token
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              // Handle token refresh failure (redirect to login)
            }
          } else {
            console.error('Error fetching user:', error);
          }
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
