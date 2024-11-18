import PropTypes from 'prop-types';
import Card from '../Card/Card';

const Wrapper = ({ results }) => {
  return (
    <div className="wrapper">
      <h2>Search Results:</h2>
      <div className="card-container">
        {results && results.length > 0 ? (
          results.map((result) => (
            <Card
              key={result.id}
              title={result.title}
              description={result.description}
              image={result.image}
              source={result.source}
            />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
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
      source: PropTypes.string,
    })
  ).isRequired,
};

export default Wrapper;
