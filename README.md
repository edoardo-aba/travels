HOW TO RUN

prerequisites:
- have solr installed
- have mongodb installed(window.websites) => db:window, collection:websites


- server folder:
 1. npm install
 2. npm start

- client folder steps to perform:
  1. npm install
  2. create .env file and put inside:
    REACT_APP_BASE_URL_REQUEST=http://localhost:3000
    VITE_WEATHER_API_KEY=your_api_key
  3. npm start
