const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'));

// MongoDB Schemas
const emailSchema = new mongoose.Schema({
    emailId: { type: String, required: true, unique: true },
    recipient: String,
    sentTime: { type: Date, default: Date.now },
    opens: [{ timestamp: Date, ip: String }],
    linkClicks: [{ link: String, timestamp: Date, ip: String }],
    downloads: [{ fileName: String, timestamp: Date, ip: String }],
});
const Email = mongoose.model('Email', emailSchema);

// Serve 1x1 transparent pixel for email open tracking
app.get('/track', async (req, res) => {
    const { emailId } = req.query;
    if (!emailId) return res.status(400).send('Missing emailId');

    try {
        await Email.updateOne(
            { emailId },
            { $push: { opens: { timestamp: new Date(), ip: req.ip } } },
            { upsert: true }
        );
        res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64')); // 1x1 pixel
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Handle link click tracking
app.get('/link', async (req, res) => {
    const { emailId, url } = req.query;
    if (!emailId || !url) return res.status(400).send('Missing parameters');

    try {
        await Email.updateOne(
            { emailId },
            { $push: { linkClicks: { link: url, timestamp: new Date(), ip: req.ip } } }
        );
        res.redirect(url);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Handle attachment download tracking
app.get('/download', async (req, res) => {
    const { emailId, fileUrl, fileName } = req.query;
    if (!emailId || !fileUrl || !fileName) return res.status(400).send('Missing parameters');

    try {
        await Email.updateOne(
            { emailId },
            { $push: { downloads: { fileName, timestamp: new Date(), ip: req.ip } } }
        );
        res.redirect(fileUrl);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Get tracking status for an email
app.get('/status', async (req, res) => {
    const { emailId } = req.query;
    if (!emailId) return res.status(400).send('Missing emailId');

    try {
        const email = await Email.findOne({ emailId });
        res.json(email || { opens: [], linkClicks: [], downloads: [] });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.listen(6060, () => console.log('Server running on port 3000'));