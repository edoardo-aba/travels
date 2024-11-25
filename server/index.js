const express = require('express');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const SolrNode = require('solr-node'); // Solr client
const cron = require('node-cron');
const axios = require('axios');
const { TokenizerEn, StopwordsEn } = require('@nlpjs/lang-en-min'); // for nlp tools (relevance when fetching )

const solrUrl = 'http://localhost:8983/solr/websites/update';

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Middleware to log every request and its parameters
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    console.log('Query Parameters:', req.query);
    console.log('Body:', req.body);
    next();
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/window')
    .then(async () => {
        console.log('Connected to MongoDB successfully!');

        // Start the scraper and sync processes
        console.log('Starting initial scraping process...');
        await scrapeWebsites();

        console.log('Syncing MongoDB data with Solr...');
        await syncMongoWithSolr();
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Mongoose Schema and Model
const websiteSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    source: String,
    relevance: { type: Number, default: 100 }, // Added relevance field
});
const Website = mongoose.model('Website', websiteSchema);

// Solr client setup
const solrClient = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'websites',
    protocol: 'http',
});

// Array of websites to scrape
const websites = [
    { url: 'https://www.getyourguide.it/alba-l1166/tour-a-piedi-della-citta-storica-di-alba-t450835', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/alba-l1166/esperienza-di-caccia-al-tartufo-delle-langhe-t453401', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/alba-l1166/degustazione-di-vini-e-abbinamenti-gastronomici-nelle-langhe-e-vicino-ad-alba-t853997', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/alba-l1166/tour-di-caccia-al-tartufo-al-tramonto-t450016', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/barolo-l2679/degustazione-della-cantina-del-barolo-citta-di-alba-e-castello-dell-unesco-t588243', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/alba-l1166/tour-a-piedi-e-degustazione-di-alba-cibo-e-storia-t445000', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/barolo-l2679/tour-di-degustazione-di-barolo-e-barbaresco-t451748', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/alba-l1166/alba-tour-in-bici-elettrica-con-picnic-e-degustazione-di-vini-t437858', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/piemonte-l598/tour-gastronomico-del-piemonte-t153951', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/bra-italia-l3427/dogliani-degustazione-di-7-vini-nel-cuore-delle-langhe-t624703', scraper: scrape1 },
    { url: 'https://www.getyourguide.it/neive-l146393/langhe-degustazione-di-6-bicchieri-di-barolo-e-barbaresco-t442705', scraper: scrape1 },
    { url: 'https://www.tripadvisor.com/Attraction_Review-g194664-d8820143-Reviews-Alba_International_White_Truffle_Fair-Alba_Province_of_Cuneo_Piedmont.html', scraper: scrape2 },
    { url: 'https://www.viator.com/tours/Turin/Torino-to-the-Langhe-a-Private-Barolo-and-Barbaresco-Wine-Tour/d802-223357P2', scraper: scrape3 }
];

// Puppeteer-based scraper for Website 1
async function scrape1(url) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const title = await page.$eval('h1.activity__title', el => el.textContent.trim());
        const description = await page.$eval('[data-test-id=" -full-description-text"]', el => el.textContent.trim());
        const image = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));

        await browser.close();
        console.log('Scraped:', { title, description, image, source: url });
        return { title, description, image, source: url };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

// Puppeteer-based scraper for Website 2
async function scrape2(url) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const title = await page.$eval('h1', el => el.textContent.trim());
        const description = await page.$eval('span.JguWG', el => el.textContent.trim());
        const image = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));

        await browser.close();
        console.log('Scraped:', { title, description, image, source: url });
        return { title, description, image, source: url };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

// Puppeteer-based scraper for Website 3
async function scrape3(url) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const title = await page.$eval('h1', el => el.textContent.trim());
        const description = await page.$eval('div.sectionWrapper__LLkD', el => el.textContent.trim());
        const image = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));

        await browser.close();
        console.log('Scraped:', { title, description, image, source: url });
        return { title, description, image, source: url };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

// Function to scrape all websites and store in MongoDB
async function scrapeWebsites() {
    const results = [];

    for (const { url, scraper } of websites) {
        try {
            console.log(`Scraping: ${url}`);
            const scrapedData = await scraper(url);
            if (scrapedData) {
                results.push(scrapedData);
            }
        } catch (error) {
            console.error(`Error scraping ${url}:`, error.message);
        }
    }

    try {
        await Website.deleteMany({});
        await Website.insertMany(results);
        console.log('Scraping completed and data saved to MongoDB.');
    } catch (error) {
        console.error('Error saving to MongoDB:', error.message);
    }
}

// Sync MongoDB data with Solr
async function syncMongoWithSolr() {
    try {
        console.log('Starting Solr sync process...');

        // Construct the delete command
        const deleteCommand = { delete: { query: 'title:*' } };

        // Send the delete request
        const deleteResponse = await axios.post(solrUrl, deleteCommand, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Delete Response:', deleteResponse.data);

        // Commit the changes
        const commitResponse = await axios.post(solrUrl, { commit: {} }, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Commit Response:', commitResponse.data);

        // Fetch data from MongoDB
        const websites = await Website.find();

        console.log(`Fetched ${websites.length} records from MongoDB.`);

        // Add data to Solr
        const addCommands = websites.map(doc => ({
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            image: doc.image,
            source: doc.source,
            relevance: doc.relevance, // Include relevance
        }));

        const addResponse = await axios.post(solrUrl, { add: addCommands }, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Add Response:', addResponse.data);

        // Final commit after adding documents
        const finalCommitResponse = await axios.post(solrUrl, { commit: {} }, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Final Commit Response:', finalCommitResponse.data);

        console.log('MongoDB data successfully synced with Solr.');
    } catch (error) {
        // Improved error handling with Axios
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Status Code:', error.response.status);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request Error:', error.message);
        }
    }
}

// Search API
app.get('/api/search', async (req, res) => {
    const text = req.query.text;
    console.log('Search Title:', text);

    if (!text) {
        return res.status(400).json({ error: 'Query parameter "text" is required' });
    }

    try {
        // Send the query to Solr using Axios GET request
        const query = `title:${text} OR description:${text}`;
        const response = await axios.get(`http://localhost:8983/solr/websites/select`, {
            params: {
                q: query,
                fl: 'id,title,description,image,source,relevance', // Include relevance
                start: 0,
                rows: 50, // Fetch up to 50 documents
                wt: 'json',
            },
        });

        console.log('Solr Response:', response.data);

        // Process the Solr response
        const docs = response.data.response.docs;

        // Use a tokenizer and stopword remover for additional ranking
        const tokenizer = new TokenizerEn();
        const stopwords = new StopwordsEn();

        // Tokenize the search query and remove stopwords
        const queryTokens = tokenizer
            .tokenize(text.toLowerCase())
            .filter((word) => !stopwords.isStopword(word));

        // Enhance document ranking by computing relevance to the query tokens
        const rankedDocs = docs
            .map((doc) => {
                // Combine the title and description
                const combinedText = `${doc.title || ''} ${doc.description || ''}`.toLowerCase();

                // Tokenize the document's text and remove stopwords
                const docTokens = tokenizer
                    .tokenize(combinedText)
                    .filter((word) => !stopwords.isStopword(word));

                // Calculate a match score based on query tokens
                const matchScore = queryTokens.reduce((score, token) => {
                    return score + (docTokens.includes(token) ? 1 : 0);
                }, 0);

                // Combine relevance field and match score to determine the final score
                const finalScore = doc.relevance + matchScore;

                return { ...doc, finalScore };
            })
            .sort((a, b) => b.finalScore - a.finalScore); // Sort by finalScore in descending order
            console.log('Ranked Docs:', rankedDocs);
        // Return the sorted results
        const hits = rankedDocs.map((doc) => ({
            id: doc.id,
            title: Array.isArray(doc.title) ? doc.title[0] : doc.title,
            description: Array.isArray(doc.description) ? doc.description[0] : doc.description,
            image: doc.image,
            source: doc.source,  
            relevance: doc.relevance,
        }));

        res.json({ results: hits });
    } catch (error) {
        if (error.response) {
            console.error('Solr Error Response:', error.response.data);
            console.error('Status Code:', error.response.status);
            res.status(500).json({ error: 'Search failed', details: error.response.data });
        } else if (error.request) {
            console.error('No response received from Solr:', error.request);
            res.status(500).json({ error: 'Search failed', details: 'No response received from Solr' });
        } else {
            console.error('Error searching in Solr:', error.message);
            res.status(500).json({ error: 'Search failed', details: error.message });
        }
    }
});

// Feedback API
app.post('/api/feedback', async (req, res) => {
    const { documentId, feedbackType } = req.body;

    if (!documentId || !feedbackType) {
        return res.status(400).json({ error: 'documentId and feedbackType are required' });
    }

    try {
        // Update relevance in MongoDB
        const increment = feedbackType === 'positive' ? 1 : -1;
        const updatedDocument = await Website.findByIdAndUpdate(
            documentId,
            { $inc: { relevance: increment } },
            { new: true } // Return the updated document
        );

        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Prepare document for Solr update
        const solrDoc = {
            id: documentId,
            title: updatedDocument.title,
            description: updatedDocument.description,
            image: updatedDocument.image,
            source: updatedDocument.source,
            relevance: updatedDocument.relevance,
        };

        // Update document in Solr
        const updateResponse = await axios.post(solrUrl, { add: { doc: solrDoc, overwrite: true } }, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Solr Update Response:', updateResponse.data);

        // Commit changes
        const commitResponse = await axios.post(solrUrl, { commit: {} }, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Solr Commit Response:', commitResponse.data);

        res.status(200).json({ message: 'Feedback recorded' });
    } catch (error) {
        console.error('Error handling feedback:', error.message);
        if (error.response) {
            console.error('Solr Error Response:', error.response.data);
            return res.status(500).json({ error: 'Error updating Solr', details: error.response.data });
        }
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Fetch all recommendations API
app.get('/api/fetchRecommendations', async (req, res) => {
    try {
        console.log('Fetching all recommendations from Solr...');
        
        // Query Solr for all documents
        const response = await axios.get('http://localhost:8983/solr/websites/select', {
            params: {
                q: 'title:*', // Match all documents
                fl: 'id,title,description,image,source,relevance', // Specify fields to fetch
                start: 0,
                rows: 50, // Adjust rows to fetch the desired number of recommendations
                sort: 'relevance desc', // Sort by relevance
                wt: 'json', // Response format
            },
        });

        console.log('Solr Response:', response.data);

        // Process Solr response
        const docs = response.data.response.docs;
        const recommendations = docs.map(doc => ({
            id: doc.id,
            title: Array.isArray(doc.title) ? doc.title[0] : doc.title,
            description: Array.isArray(doc.description) ? doc.description[0] : doc.description,
            image: doc.image,
            source: doc.source,
            relevance: doc.relevance,
        }));

        res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Error fetching recommendations from Solr:', error.message);
        if (error.response) {
            console.error('Solr Error Response:', error.response.data);
            return res.status(500).json({ error: 'Error fetching recommendations', details: error.response.data });
        }
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});


// Schedule scraping every hour using node-cron
cron.schedule('0 0 * * *', async () => {
    console.log('Scheduled scraping started...');
    await scrapeWebsites();
    await syncMongoWithSolr();
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});