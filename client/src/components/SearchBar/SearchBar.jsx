import PropTypes from 'prop-types';
import './SearchBar.css';
import { fetchSearchResults } from '../../api';

const SearchBar = ({ onSearch, onSearchStart, query, setQuery }) => {
  const handleSearch = async () => {
    if (!query.trim()) return;
    onSearchStart();
    try {
      const results = await fetchSearchResults(query);
      onSearch(results, query);
    } catch (error) {
      console.error('Failed to fetch results.', error);
      onSearch([], query);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="travel-icon">
        <i className="fas fa-plane-departure"></i>
      </div>
      <input
        type="text"
        placeholder="Search for destinations"
        className="search-input"
        value={query} // Controlled input
        onChange={(e) => setQuery(e.target.value)} // Updates only the input field
        onKeyDown={handleKeyDown}
      />
      <div className="search-icon" onClick={handleSearch}>
        <i className="fas fa-search"></i>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSearchStart: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
};

export default SearchBar;
