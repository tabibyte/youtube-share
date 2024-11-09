const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/fetch-video-data', async (req, res) => {
    const videoUrl = req.body.url;
    const videoId = videoUrl.split('v=')[1];
    const apiKey = process.env.YOUTUBE_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,statistics`;

    try {
        const response = await axios.get(apiUrl);
        const videoData = response.data.items[0];
        const videoInfo = {
            thumbnail: videoData.snippet.thumbnails.high.url,
            title: videoData.snippet.title,
            accountName: videoData.snippet.channelTitle,
            views: videoData.statistics.viewCount,
            date: videoData.snippet.publishedAt,
        };
        res.json(videoInfo);
    } catch (error) {
        console.error('Error fetching video data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch video data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});