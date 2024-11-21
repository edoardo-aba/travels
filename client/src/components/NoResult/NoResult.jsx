import './NoResult.css';

const NoResult = () => {
  return (
    <div className="no-result">
      <h2>Sorry, no results found!</h2>
      <img
        src="https://cdn.dribbble.com/users/550484/screenshots/2128340/404-gif.gif" // Replace with your sad image or GIF URL
        alt="No Results Found"
        className="no-result-image"
      />
    </div>
  );
};

export default NoResult;
