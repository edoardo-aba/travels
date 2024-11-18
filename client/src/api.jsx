import axios from 'axios';

export const fetchSearchResults = async (text) => {
  try {
    const response = await axios.get('/api/search', {
      params: { text },
    });

    // Extract `results` and map only the required fields (e.g., `title`)
    const results = response.data.results.map((item) => ({
      id: item.id,
      title: item.title, // Use title as the primary field
      description: item.description,
      image: item.image,
      source: item.source,
    }));

    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};
