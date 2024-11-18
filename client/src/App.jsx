import { useState } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchResults = (results, query) => {
    setSearchedQuery(query);
    // Wait at least 1 second before showing results
    setTimeout(() => {
      setResults(results);
      setLoading(false);
    }, 500);
  };

  const handleSearchStart = () => {
    setLoading(true);
    setResults([]); // Optionally clear previous results
  };

  return (
    <>
      <Header />
      <SearchBar onSearch={handleSearchResults} onSearchStart={handleSearchStart} />
      <Wrapper results={results} query={searchedQuery} loading={loading} />
    </>
  );
}

export default App;
