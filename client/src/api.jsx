// fetchSearchResults.js
import axios from 'axios';

export const fetchSearchResults = async (text) => {
  try {
    const response = await axios.get('/api/search', {
      params: { text },
    });

    // Extract `results` and map the required fields, including `relevance`
    const results = response.data.results.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      source: item.source,
      relevance: item.relevance, // Include relevance
    }));

    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};
