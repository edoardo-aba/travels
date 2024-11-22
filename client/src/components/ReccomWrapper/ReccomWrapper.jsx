import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchRecommendations, fetchSearchResults } from '../../api'; // Import the API function
import { TokenizerEn, StopwordsEn } from '@nlpjs/lang-en-min'; // Import NLP tools
import './ReccomWrapper.css'; // Add necessary styles

const ReccomWrapper = ({ onSearch, onSearchStart, setQuery }) => {
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

  // Function to extract and calculate important words from title and description
  const getImportantWords = (title, description) => {
    if (!title && !description) return 'No Keywords';

    // Combine title and description
    const combinedText = `${title || ''} ${description || ''}`.toLowerCase();

    // Initialize tokenizer and stopword remover
    const tokenizer = new TokenizerEn(); // English tokenizer
    const stopwords = new StopwordsEn(); // English stopword list

    // Tokenize the combined text into words
    const tokens = tokenizer.tokenize(combinedText);

    // Remove stopwords and short words
    const filteredWords = tokens.filter(
      (word) =>
        word.length > 2 && // Keep words with length > 2
        !stopwords.isStopword(word) // Remove stopwords
    );

    // Count word frequencies
    const wordFrequency = filteredWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Sort words by frequency and pick the top 1-3
    const sortedWords = Object.entries(wordFrequency)
      .sort(([, freqA], [, freqB]) => freqB - freqA) // Sort by frequency
      .slice(0, 3) // Limit to top 3 words
      .map(([word]) => word);

    return sortedWords.join(' '); // Combine top words
  };

  // Function to handle image click
  const handleImageClick = async (word) => {
    if (!word) return;

    setQuery(word); // Update the SearchBar's input with the word
    onSearchStart(); // Trigger loading state
    try {
      const results = await fetchSearchResults(word); // Fetch results for the word
      onSearch(results, word); // Pass results and word back to App
    } catch (error) {
      console.error('Error fetching search results:', error);
      onSearch([], word); // Handle failure by passing empty results
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div> {/* Add a spinner */}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return <div>No recommendations available</div>;
  }

  return (
    <div className="reccom-wrapper-container">
      <h2 className="reccom-header">Recommended Topics:</h2>
      <div className="reccom-wrapper">
        {recommendations.map((item) => {
          const importantWords = getImportantWords(item.title, item.description);
          return (
            <div key={item.id} className="reccom-card">
              <img
                src={item.image || 'default-image.png'} // Fallback image
                alt={item.title}
                className="reccom-card-image"
                onClick={() => handleImageClick(importantWords)} // Pass the word to handleImageClick
              />
              <p className="reccom-card-title">{importantWords}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ReccomWrapper.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSearchStart: PropTypes.func.isRequired,
  setQuery: PropTypes.func.isRequired,
};

export default ReccomWrapper;
