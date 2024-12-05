import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import Wrapper from './components/Wrapper/Wrapper';
import ImageWrapper from './components/ImageWrapper/ImageWrapper';
import NoResult from './components/NoResult/NoResult';
import ReccomWrapper from './components/ReccomWrapper/ReccomWrapper';
import { fetchSearchResults } from './api';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  const backgroundImages = [
    'https://cdn.tourcms.com/a/5898/346/1/large.jpg',
    'https://static.vecteezy.com/ti/foto-gratuito/p2/2169447-cattedrale-duomo-di-milano-in-piazza-piazza-duomo-mattina-a-milano-gratuito-foto.jpg',
    'https://www.spuntidiviaggio.it/wp-content/uploads/2021/03/Mole-Antonelliana-di-Torino-e-Museo-del-cinema-foto-con-le-Alpi-unsplash.jpg',
    'https://rare-gallery.com/uploads/posts/882380-Procida-Campania-region-province-Naples-Italy-Houses.jpg',
    'https://media.admiddleeast.com/photos/660c1e688ef93beb8177c926/16:9/w_2560%2Cc_limit/GettyImages-1392142113.jpg'
  ];

  // Pick a random background image only once, on initial load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const chosenImage = backgroundImages[randomIndex];
    setBackgroundImage(chosenImage);
    document.body.classList.add('image-background');
    document.body.style.backgroundImage = `url(${chosenImage})`;
  }, []); // Runs only once on mount

  useEffect(() => {
    if (searchPerformed) {
      // When search is performed, switch to white background
      document.body.classList.remove('image-background');
      document.body.classList.add('white-background');
      document.body.style.backgroundImage = 'none';
    } else {
      // If no search performed yet, restore the initial random background
      document.body.classList.remove('white-background');
      document.body.classList.add('image-background');
      document.body.style.backgroundImage = `url(${backgroundImage})`;
    }
  }, [searchPerformed, backgroundImage]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const results = await fetchSearchResults(query);
      setResults(results);
      setActiveSearchQuery(query);
      setSearchPerformed(true); // Set only after results come in
    } catch (error) {
      console.error('Failed to fetch results.', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results, query) => {
    setSearchedQuery(query);
    setResults(results);
    setActiveSearchQuery(query);
    setSearchPerformed(true); // Set it here after successful search results
    setLoading(false);
  };

  // Note: Do not set searchPerformed = true when user just types.
  // Only set it after actual search results are fetched.

  const handleSearchStart = () => {
    // User started a search - we can show loading, but don't necessarily set searchPerformed here
    setLoading(true);
  };

  const reFetchResults = () => {
    if (activeSearchQuery) {
      performSearch(activeSearchQuery);
    }
  };

  const shouldRenderResults = searchPerformed && !loading;

  return (
    <>
      <Header />
      <SearchBar
        onSearch={handleSearchResults}
        onSearchStart={handleSearchStart}
        query={searchedQuery}
        setQuery={setSearchedQuery}
      />
      {shouldRenderResults ? (
        results.length > 0 ? (
          <div className="main-container">
            <Wrapper
              results={results}
              query={activeSearchQuery}
              loading={loading}
              reFetchResults={reFetchResults}
            />
            <ImageWrapper results={results} />
          </div>
        ) : (
          <NoResult />
        )
      ) : loading ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : (
        <ReccomWrapper
          onSearch={handleSearchResults}
          onSearchStart={handleSearchStart}
          setQuery={setSearchedQuery}
        />
      )}
    </>
  );
}

export default App;
