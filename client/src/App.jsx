import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';
import ImageWrapper from './components/ImageWrapper/ImageWrapper';
import NoResult from './components/NoResult/NoResult'; // Import the NoResult component
import { fetchSearchResults } from './api';
import './App.css'; // Add necessary styles here.

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if a search has been made

  useEffect(() => {
    // Update the body's class based on the searchPerformed state
    if (searchPerformed) {
      document.body.classList.remove('image-background');
      document.body.classList.add('white-background');
    } else {
      document.body.classList.remove('white-background');
      document.body.classList.add('image-background');
    }
  }, [searchPerformed]);

  const performSearch = async (query) => {
    setLoading(true);
    setSearchPerformed(true); // Mark that a search is now being performed
    try {
      const results = await fetchSearchResults(query);
      setResults(results);
    } catch (error) {
      console.error('Failed to fetch results.', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results, query) => {
    setSearchedQuery(query);
    setResults(results);
    setSearchPerformed(true); // Mark that a search was completed
    setLoading(false);
  };

  const handleSearchStart = () => {
    setLoading(true);
    setSearchPerformed(true); // Mark that a search has started
  };

  const reFetchResults = () => {
    if (searchedQuery) {
      performSearch(searchedQuery);
    }
  };

  return (
    <>
      <Header />
      <SearchBar onSearch={handleSearchResults} onSearchStart={handleSearchStart} />
      {searchPerformed ? (
        results.length > 0 ? (
          <div className="main-container">
            <Wrapper
              results={results}
              query={searchedQuery}
              loading={loading}
              reFetchResults={reFetchResults}
            />
            <ImageWrapper results={results} />
          </div>
        ) : (
          <NoResult />
        )
      ) : null}
    </>
  );
}

export default App;
