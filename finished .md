
# How to Run the Server and Set Up the Environment

## Prerequisites

- **Node.js and npm**:  
  Check if Node.js and npm are installed:
  ```bash
  node -v
  npm -v
  ```
  If not installed, follow instructions at [Node.js official website](https://nodejs.org).

- **MongoDB**:  
  Ensure you have a running MongoDB instance, accessible at `mongodb://localhost:27017`.
  You can start a local MongoDB server or use a hosted MongoDB instance.

- **Solr**:  
  Make sure Apache Solr is installed and running.  
  Instructions (simplified):
  ```bash
  # Start Solr (assuming you've downloaded and extracted it)
  bin/solr start

  # Create a core named 'websites'
  bin/solr create -c websites
  ```
  Solr will be accessible at `http://localhost:8983/solr/`.  
  The `websites` core should be at `http://localhost:8983/solr/websites`.

- **Chromium/Chrome**:  
  Puppeteer (used for scraping) requires Chromium. It will usually download it automatically, but ensure your system supports headless Chrome.

## MongoDB Setup

The code connects to:
```javascript
mongoose.connect('mongodb://localhost:27017/window')
```
This will use the `window` database. The `websites` collection is automatically created when data is inserted. You don’t need to manually create the collection.

If you'd like to verify, connect to MongoDB and check:
```bash
mongosh
use window
db.websites.find()
```

## Solr Setup

1. Start Solr:
   ```bash
   bin/solr start
   ```
2. Create the `websites` core:
   ```bash
   bin/solr create -c websites
   ```
3. Confirm that `websites` core is available at `http://localhost:8983/solr/#/websites`.

If you need custom schema fields (if using non-managed schema), ensure fields like `title`, `description`, `image`, `source`, and `relevance` are defined. Otherwise, Solr’s default managed schema should handle dynamic fields.

## Installation and Running the Server

1. **Install dependencies** in the project folder (where `package.json` and `index.js` are located):
   ```bash
   npm install
   ```

2. **Run the server**:
   ```bash
   npm install
   npm start or node index.js
   ```
   The server runs on `http://localhost:3000`.

   On startup, it will:
   - Scrape the predefined websites.
   - Store the scraped data in MongoDB.
   - Sync the data with the Solr `websites` core.




# How to Run the Frontend (React) and Set Up the Environment

## Prerequisites

- **Node.js and npm/yarn**:  
  Ensure you have Node.js and a package manager (npm or yarn) installed.
  ```bash
  node -v
  npm -v
  # or
  yarn -v
  ```

- **Backend Server**:  
  The frontend expects a backend running at `http://localhost:3000`.  
  Make sure the server is running before starting the frontend.  
  See the previous instructions for running the backend.

## Environment Variables

The frontend uses a `.env` file for configuration. The following variables should be set in `.env` at the root of your React project:

```env
REACT_APP_BASE_URL_REQUEST=http://localhost:3000
VITE_WEATHER_API_KEY=your_key_from_OpenWeatherMap
```


## Installation and Running the Frontend

1. **Install Dependencies**:
   In your React project directory:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   # or
   yarn start
   ```
   
   The app will typically run on `http://localhost:3000` by default for CRA of for Vite at `http://localhost:5173` by default .  
   If that clashes with your backend port, CRA might prompt you to run on a different port (e.g., `http://localhost:3001`).  
   Make sure your `REACT_APP_BASE_URL_REQUEST` in `.env` points to where the backend is running (often `http://localhost:3000` for the backend and `http://localhost:3001` for the frontend if ports overlap).

   If using Vite:
   ```bash
   npm run dev
   # or
   yarn dev
   ```





