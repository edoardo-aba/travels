```markdown
# How to Run the Server and Set Up the Environment

## Prerequisites

- **Node.js and npm**: Ensure you have Node.js (>=14) and npm installed.  
  You can verify by running:
  ```bash
  node -v
  npm -v
  ```
  If not installed, follow the instructions at [Node.js official website](https://nodejs.org).

- **MongoDB**: Ensure you have a running MongoDB instance.  
  For local development, you can run MongoDB on the default port `27017`.  
  Make sure it is accessible via `mongodb://localhost:27017`.

- **Solr**: A running Apache Solr instance with a core named `websites`.  
  - Download and install Solr from [the Apache Solr website](https://solr.apache.org).  
  - Start Solr:
    ```bash
    bin/solr start
    ```
  - Create a new core named `websites`:
    ```bash
    bin/solr create -c websites
    ```
  The server expects Solr to be running at `http://localhost:8983/solr/websites`.

- **Chromium/Chrome**: Puppeteer will need a Chromium/Chrome browser.  
  Puppeteer usually downloads Chromium automatically, but ensure your environment supports headless browsing.

## MongoDB Setup

1. **Database and Collection:**
   - The server code connects to the database named `window`:
     ```javascript
     mongoose.connect('mongodb://localhost:27017/window')
     ```
   - Once connected, it will automatically create and use the `websites` collection when documents are inserted.  
   
   In summary:
   - **Database Name:** `window`
   - **Collection Name:** `websites` (automatically created by Mongoose when data is inserted)

   No manual creation of the collection is strictly required. If you wish to verify, you can do so via the MongoDB shell or a tool like `mongosh`:
   ```bash
   mongosh
   use window
   db.getCollection('websites').find()
   ```

## Solr Setup

1. **Ensure Solr is Running and Create the `websites` Core:**
   ```bash
   bin/solr start
   bin/solr create -c websites
   ```
   
2. **Check the Core:**
   Access `http://localhost:8983/solr/#/websites` in your browser to ensure the `websites` core is created successfully.

3. **Schema and Fields:**
   The code expects fields like `title`, `description`, `image`, `source`, and `relevance`.  
   If using the default managed schema, these fields can be dynamically created.  
   Otherwise, ensure these fields are defined in `websites` schema as `text_general` for textual fields and `int` for numeric fields.  
   
   Example field definitions (if needed):
   ```xml
   <field name="title" type="text_general" indexed="true" stored="true"/>
   <field name="description" type="text_general" indexed="true" stored="true"/>
   <field name="image" type="string" indexed="false" stored="true"/>
   <field name="source" type="string" indexed="false" stored="true"/>
   <field name="relevance" type="int" indexed="true" stored="true"/>
   ```

## Installation and Running the Server

1. **Install Dependencies:**
   In the root directory of the project (where your `package.json` is located), run:
   ```bash
   npm install
   ```

2. **Run the Server:**
   Once all dependencies are installed, start the server with:
   ```bash
   node app.js
   ```
   or if you have a start script defined in `package.json`:
   ```bash
   npm start
   ```

   The server will start on port `3000` by default:
   ```
   Server running on http://localhost:3000
   ```

## What the Server Does

- **Scraping Websites:** On startup, it scrapes predefined URLs using Puppeteer, extracting `title`, `description`, and `image`.
- **Storing Data in MongoDB:** The scraped data is stored in the `window` database under the `websites` collection.
- **Synchronizing with Solr:** After scraping, the data is synced to the `websites` Solr core.
- **Search Endpoint:** The `/api/search` endpoint allows you to search documents stored in Solr.  
  Example query:
  ```bash
  curl "http://localhost:3000/api/search?text=barolo"
  ```
- **Feedback Endpoint:** The `/api/feedback` endpoint allows you to adjust the `relevance` of a document.  
  Example:
  ```bash
  curl -X POST "http://localhost:3000/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{"documentId": "YOUR_DOC_ID", "feedbackType": "positive"}'
  ```
- **Fetching Recommendations:** The `/api/fetchRecommendations` endpoint returns documents from Solr, sorted by relevance.

## Scheduling

- The code uses `node-cron` to schedule a scraping job every day at midnight:
  ```cron
  0 0 * * *
  ```
  This will re-scrape and re-sync data daily.

## Summary

- Make sure MongoDB and Solr are running and properly set up.
- Run `npm install` then `npm start`.
- The server will scrape websites, store data in MongoDB, sync to Solr, and provide search and feedback endpoints.
```
