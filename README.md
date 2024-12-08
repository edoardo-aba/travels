
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


