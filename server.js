const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

// تشغيل الصوت مباشرة
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
        res.header('Content-Type', 'audio/mpeg');
        ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// تحميل MP3
app.get('/download/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');
        ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// معلومات الفيديو
app.get('/info/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
        const info = await ytdl.getInfo(url);
        res.json({
            title: info.videoDetails.title,
            duration: info.videoDetails.lengthSeconds,
            thumbnail: info.videoDetails.thumbnails[0].url
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ خادم التحميل يعمل على المنفذ ${PORT}`);
});
