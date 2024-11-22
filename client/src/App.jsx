import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';
import ImageWrapper from './components/ImageWrapper/ImageWrapper';
import NoResult from './components/NoResult/NoResult';
import ReccomWrapper from './components/ReccomWrapper/ReccomWrapper';
import { fetchSearchResults } from './api';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState(''); // Tracks input value in SearchBar
  const [activeSearchQuery, setActiveSearchQuery] = useState(''); // Tracks active query for display
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
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
    setSearchPerformed(true);
    try {
      const results = await fetchSearchResults(query);
      setResults(results);
      setActiveSearchQuery(query); // Update the active query only when search is performed
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
    setActiveSearchQuery(query); // Update the active query only when search is completed
    setSearchPerformed(true);
    setLoading(false);
  };

  const handleSearchStart = () => {
    setLoading(true);
    setSearchPerformed(true);
  };

  const reFetchResults = () => {
    if (activeSearchQuery) {
      performSearch(activeSearchQuery);
    }
  };

  // Determine if we should render the results
  const shouldRenderResults = searchPerformed && !loading;

  return (
    <>
      <Header />
      <SearchBar
        onSearch={handleSearchResults}
        onSearchStart={handleSearchStart}
        query={searchedQuery}
        setQuery={setSearchedQuery} // Updates the input field but not the displayed results
      />
      {shouldRenderResults ? (
        results.length > 0 ? (
          <div className="main-container">
            <Wrapper
              results={results}
              query={activeSearchQuery} // Use activeSearchQuery to avoid display changes
              loading={loading}
              reFetchResults={reFetchResults}
            />
            <ImageWrapper results={results} />
          </div>
        ) : (
          <NoResult />
        )
      ) : loading ? (
        <div className="loading-container">
          <div className="loader"></div> {/* Add a custom loader */}
        </div>
      ) : (
        <ReccomWrapper
          onSearch={handleSearchResults}
          onSearchStart={handleSearchStart}
          setQuery={setSearchedQuery} // Updates search input but not the display
        />
      )}
    </>
  );
}

export default App;
