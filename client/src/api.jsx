import axios from 'axios';

export const fetchSearchResults = async (text) => {
    try {
      const response = await axios.get('/api/search', {
        params: { text },
      });
      return response.data; // Assuming the server returns data in the `data` property
    } catch (error) {
      console.error('Error fetching search results:', error);
      throw error;
    }
  };