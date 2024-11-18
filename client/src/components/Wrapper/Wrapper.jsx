import PropTypes from 'prop-types';

const Wrapper = ({ results }) => {
  return (
    <div>
      <h2>Search Results:</h2>
      {results && results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
              <img src={result.image} alt={result.title} style={{ width: '150px', height: '100px' }} />
              <a href={result.source} target="_blank" rel="noopener noreferrer">View More</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

// Update PropTypes to validate the object structure
Wrapper.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      source: PropTypes.string,
    })
  ).isRequired,
};

export default Wrapper;
