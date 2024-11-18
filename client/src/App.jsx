import './App.css';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css'; // Import Font Awesome globally
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';

function App() {
  const [results, setResults] = useState([]);

  return (
    <>
      <Header />
      <SearchBar onResults={setResults} />
      <Wrapper results={results} />
    </>
  );
}

export default App;
