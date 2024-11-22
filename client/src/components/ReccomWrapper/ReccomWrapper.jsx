import { useState, useEffect } from 'react';
import { fetchRecommendations, fetchSearchResults } from '../../api'; // Import the necessary API functions
import './ReccomWrapper.css'; // Add necessary styles

const ReccomWrapper = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecommendations();
        // Sort by relevance (desc) and pick top 5
        const sortedData = (data || [])
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 5);
        setRecommendations(sortedData);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to calculate the most important word from the first half of the title
  const getImportantWord = (title) => {
    if (!title) return 'Untitled';
    
    const stopWords = [
      'the', 'of', 'and', 'a', 'to', 'in', 'is', 'it', 'for', 'on', 'with', 'as', 'at', 'an', 'by'
    ];
    
    // Split the title into words and focus on the first half
    const words = title.split(/\s+/); // Split the title into an array of words
    const firstHalf = words.slice(0, Math.ceil(words.length / 2)); // Take the first half of the title
  
    // Filter the first half to remove stop words and short words
    const filteredWords = firstHalf.filter(
      (word) => word.length > 2 && !stopWords.includes(word.toLowerCase())
    );
  
    if (filteredWords.length === 0) return 'No Keywords';
  
    // Sanitize words by removing punctuation
    const sanitizedWords = filteredWords.map((word) => word.replace(/[^\w\s]/g, ''));
  
    // Return the longest sanitized word or any custom logic
    return sanitizedWords.reduce((a, b) => (a.length > b.length ? a : b));
  };

  // Function to handle image click
  const handleImageClick = async (word) => {
    try {
      const searchResults = await fetchSearchResults(word); // Make the API call with the word
      console.log('Search Results:', searchResults);
      // Optionally, you can set these results into state or navigate to a search results page
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (!recommendations || recommendations.length === 0) {
    return <div>No recommendations available</div>;
  }

  return (
    <div className="reccom-wrapper">
      {recommendations.map((item) => {
        const importantWord = getImportantWord(item.title);
        return (
          <div key={item.id} className="reccom-card">
            <img
              src={item.image || 'default-image.png'} // Fallback image
              alt={item.title}
              className="reccom-card-image"
              onClick={() => handleImageClick(importantWord)} // Attach click event
            />
            <p className="reccom-card-title">{importantWord}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReccomWrapper;
