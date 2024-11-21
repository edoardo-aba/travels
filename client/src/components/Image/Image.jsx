import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Image.css';

const Image = ({ src, alt }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`image-item ${isFullScreen ? 'full-screen' : ''}`}
        onClick={toggleFullScreen}
      />
      {isFullScreen && (
        <div className="overlay" onClick={toggleFullScreen}>
          <img src={src} alt={alt} className="full-image" />
        </div>
      )}
    </>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default Image;
