import { useState } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';
import ImageWrapper from './components/ImageWrapper/ImageWrapper';
import { fetchSearchResults } from './api';
import './App.css'; // Add necessary styles here.

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSearchResults = (results, query) => {
    setSearchedQuery(query);
    setResults(results);
    setLoading(false);
  };

  const handleSearchStart = () => {
    setLoading(true);
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
      <div className="main-container">
        <Wrapper
          results={results}
          query={searchedQuery}
          loading={loading}
          reFetchResults={reFetchResults}
        />
        <ImageWrapper results={results} />
      </div>
    </>
  );
}

export default App;
