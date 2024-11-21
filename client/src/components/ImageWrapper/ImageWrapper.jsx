import PropTypes from 'prop-types';
import './ImageWrapper.css';

const ImageWrapper = ({ results }) => {
  // Only show the heading and content if a search has been done
  const hasSearched = results && results.length > 0;

  return (
    <div className="image-wrapper">
      {hasSearched ? (
        <>
          <h2>Images:</h2>
          <div className="image-grid">
            {results.map((result) =>
              result.image ? (
                <img
                  key={result.id}
                  src={result.image}
                  alt={result.title || 'Search Result Image'}
                  className="image-item"
                />
              ) : null
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

ImageWrapper.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
};

export default ImageWrapper;
