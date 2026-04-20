const https = require('https');
const fs = require('fs');

https.get('https://www.behance.net/gallery/223589195/CycleMate-Bicycle-App-UI-UX-Design', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        let urls = data.match(/https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/[a-zA-Z0-9_/%-]+\.(?:png|jpg|jpeg|webp)/g) || [];
        // Unique
        urls = [...new Set(urls)];
        console.log(urls.slice(0, 5).join('\n'));
        
        // download one
        if (urls.length > 0) {
            const dest = fs.createWriteStream('C:/FoxSay/preview.png');
            https.get(urls[0], (imgRes) => {
                imgRes.pipe(dest);
            });
        }
    });
}).on('error', console.error);
