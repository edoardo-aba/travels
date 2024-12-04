import PropTypes from 'prop-types';
import './BigCard.css'; // Import the same styles or create additional styles as needed

const BigCard = ({ title, description, image, onClose }) => {
  const handleBackgroundClick = () => {
    onClose(); // Close the BigCard when the background is clicked
  };

  const handleContentClick = (event) => {
    event.stopPropagation(); // Prevent click inside content from propagating to the background
  };

  return (
    <div className="big-card-overlay" onClick={handleBackgroundClick}>
      <div className="big-card" onClick={handleContentClick}>
        <div className="big-card-header">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="big-card-image">
          <img src={image} alt={title} />
        </div>
        <div className="big-card-content">
          <h1 className="big-card-title">{title}</h1>
          <p className="big-card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

BigCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BigCard;
