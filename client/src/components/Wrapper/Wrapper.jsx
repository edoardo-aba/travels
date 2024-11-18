// Wrapper.js
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import './Wrapper.css';

const Wrapper = ({ results, query, loading }) => {
  if (!query) {
    return null;
  }

  return (
    <div className="wrapper">
      <h2>Search Results for "{query}":</h2>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="card-container">
          {results && results.length > 0 ? (
            results.map((result) => (
              <Card
                key={result.id}
                id={result.id}
                title={result.title}
                description={result.description}
                image={result.image}
                query={query}
              />
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

Wrapper.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      relevance: PropTypes.number, // Include if needed
    })
  ).isRequired,
  query: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Wrapper;
