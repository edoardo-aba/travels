const express = require('express');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const SolrNode = require('solr-node'); // Solr client
const cron = require('node-cron');

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
    // { url: 'https://www.getyourguide.it/alba-l1166/esperienza-di-caccia-al-tartufo-delle-langhe-t453401', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/alba-l1166/degustazione-di-vini-e-abbinamenti-gastronomici-nelle-langhe-e-vicino-ad-alba-t853997', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/alba-l1166/tour-di-caccia-al-tartufo-al-tramonto-t450016', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/barolo-l2679/degustazione-della-cantina-del-barolo-citta-di-alba-e-castello-dell-unesco-t588243', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/alba-l1166/tour-a-piedi-e-degustazione-di-alba-cibo-e-storia-t445000', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/barolo-l2679/tour-di-degustazione-di-barolo-e-barbaresco-t451748', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/alba-l1166/alba-tour-in-bici-elettrica-con-picnic-e-degustazione-di-vini-t437858', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/piemonte-l598/tour-gastronomico-del-piemonte-t153951', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/bra-italia-l3427/dogliani-degustazione-di-7-vini-nel-cuore-delle-langhe-t624703', scraper: scrape1 },
    // { url: 'https://www.getyourguide.it/neive-l146393/langhe-degustazione-di-6-bicchieri-di-barolo-e-barbaresco-t442705', scraper: scrape1 },
    // { url: 'https://www.tripadvisor.com/Attraction_Review-g194664-d8820143-Reviews-Alba_International_White_Truffle_Fair-Alba_Province_of_Cuneo_Piedmont.html', scraper: scrape2 },
    // { url: 'https://www.viator.com/tours/Turin/Torino-to-the-Langhe-a-Private-Barolo-and-Barbaresco-Wine-Tour/d802-223357P2', scraper: scrape3 }
];

// Puppeteer-based scraper for Website 1
async function scrape1(url) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const title = await page.$eval('h1.activity__title', el => el.textContent.trim());
        const description = await page.$eval('[data-test-id="activity-full-description-text"]', el => el.textContent.trim());
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

           // Construct the delete command
           const deleteCommand = {
            delete: {
                query: 'title:alba'
            }
        };

        // Send the delete request
        const deleteResponse = await fetch('http://localhost:8983/solr/websites/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deleteCommand),
        });

        const deleteResult = await deleteResponse.json();
        console.log('Delete Response:', deleteResult);

        // Commit the changes
        const commitResponse = await fetch('http://localhost:8983/solr/websites/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commit: {} }),
        });

        const commitResult = await commitResponse.json();
        console.log('Commit Response:', commitResult);


        // Fetch data from MongoDB
        const websites = await Website.find();


        // Add data to Solr
        for (const doc of websites) {
            const solrDoc = {
                id: doc._id.toString(),
                title: doc.title,
                description: doc.description,
                image: doc.image,
                source: doc.source,
            };
            await solrClient.update({ add: solrDoc });
        }

        await solrClient.update({ commit: {} });
        console.log('MongoDB data successfully synced with Solr.');
    } catch (error) {
        console.error('Error syncing with Solr:', error.message);
    }
}

// Search API
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter q is required' });
    }

    try {
        const searchQuery = solrClient.query()
            .q(query)
            .fl('id,title,description,image,source')
            .start(0)
            .rows(10);

        const result = await solrClient.search(searchQuery);

        console.log('Search Results:', result);

        // const hits = result.response.docs.map(doc => ({
        //     id: doc.id,
        //     title: doc.title,
        //     description: doc.description,
        //     image: doc.image,
        //     source: doc.source,
        // }));

        // res.json({ results: hits });
    } catch (error) {
        console.error('Error searching in Solr:', error.message);
        res.status(500).json({ error: 'Search failed', details: error.message });
    }
});

// Schedule scraping every hour using node-cron
cron.schedule('0 * * * *', async () => {
    console.log('Scheduled scraping started...');
    await scrapeWebsites();
    await syncMongoWithSolr();
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
