
import './Header.css';

const Header = () => {
 
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
      
    </header>
  );
};

export default Header;
