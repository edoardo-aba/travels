import PropTypes from 'prop-types';
import './ImageWrapper.css';
import Image from '../Image/Image';

const ImageWrapper = ({ results }) => {
  const hasSearched = results && results.length > 0;

  return (
    <div className="image-wrapper">
      {hasSearched ? (
        <>
          <h2>Images:</h2>
          <div className="image-grid">
            {results.map((result) =>
              result.image ? (
                <Image
                  key={result.id}
                  src={result.image}
                  alt={result.title || 'Search Result Image'}
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
