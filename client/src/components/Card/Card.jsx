import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ title, description, image }) => {
  // Truncate description to 120 characters
  const truncatedDescription = `${description.slice(0, 120)}...`;

  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{truncatedDescription}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default Card;
