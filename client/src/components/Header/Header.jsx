
import './Header.css';

const Header = () => {
  const handleClick = () => {
    alert('Hello');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="location">
          <span className="sun-icon"><i className="fas fa-sun"></i></span>
          <div className="location-text">
            <div className="city">Lugano</div>
            <div className="temperature">22°C</div>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button" onClick={handleClick}>
          <i className="fas fa-user icon"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
