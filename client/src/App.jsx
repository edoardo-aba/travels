// App.js
import { useState } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';
import { fetchSearchResults } from './api';

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to perform the search
  const performSearch = async (query) => {
    setLoading(true);
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

  // Function to handle search results
  const handleSearchResults = (results, query) => {
    setSearchedQuery(query);
    setResults(results);
    setLoading(false);
  };

  const handleSearchStart = () => {
    setLoading(true);
  };

  // Function to re-fetch results
  const reFetchResults = () => {
    if (searchedQuery) {
      performSearch(searchedQuery);
    }
  };

  return (
    <>
      <Header />
      <SearchBar onSearch={handleSearchResults} onSearchStart={handleSearchStart} />
      <Wrapper
        results={results}
        query={searchedQuery}
        loading={loading}
        reFetchResults={reFetchResults}
      />
    </>
  );
}

export default App;
