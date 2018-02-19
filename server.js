const API_KEY = 'AIzaSyAaMqSu7xTj6KiABSd0ZLKhuTx9C5xpkSY';
const CSE_ID  = '016159285800389274867:rxer-jqxnti';

const express = require('express');
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

const GoogleImages = require('google-images');
const client = new GoogleImages(CSE_ID, API_KEY);

var latest = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/imagesearch/:name', (req, res) => {
    const offset = req.query.offset || 1;
    client.search(req.params.name, {page: offset})
        .then(images => {
            latest.push({
                term: req.params.name,
                when: new Date()
            });
            res.send(JSON.stringify(images.map(img => ({
                url: img.url,
                snippet: img.description,
                thumbnail: img.thumbnail.url,
                context: img.parentPage
            }))));
        });    
});

app.get('/api/latest/imagesearch', (req, res) => {
    res.send(JSON.stringify(latest));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
})