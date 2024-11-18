import { useState } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState(''); // Add this line

  // Function to handle search results and update searchedQuery
  const handleSearchResults = (results, query) => {
    setResults(results);
    setSearchedQuery(query); // Update searchedQuery when search is performed
  };

  return (
    <>
      <Header />
      {/* Pass handleSearchResults to SearchBar */}
      <SearchBar onSearch={handleSearchResults} />
      {/* Pass searchedQuery to Wrapper */}
      <Wrapper results={results} query={searchedQuery} />
    </>
  );
}

export default App;
