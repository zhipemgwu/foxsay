const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        fs.statSync(dirPath).isDirectory() ? walk(dirPath, callback) : callback(dirPath);
    });
}

function adjustContrast(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.css')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
        .replace(/#F5F5F0/gi, '#F2F3F5') // App/page background
        .replace(/#F0F0ED/gi, '#E5E7EB') // Borders, container strokes
        .replace(/#8E8E93/gi, '#6B7280') // Secondary text (gray-500)
        .replace(/#C0C0C0/gi, '#9CA3AF') // Inactive text (gray-400)
        .replace(/#E8E8E8/gi, '#D1D5DB') // Some border/inactive tracks (gray-300)
        .replace(/#F0FFD0/gi, '#E0F5A1') // Darker pastel green for badge bgs
        .replace(/#FFF0F0/gi, '#FFE4E6') // Darker pastel red
        .replace(/#F0F0FF/gi, '#E0E7FF') // Darker pastel blue
        .replace(/#1A1A2E/gi, '#111827') // Deepen text to near black gray-900 
        .replace(/shadow-sm/g, 'shadow'); // Upgrade shadow sizes if they exist

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated: ' + filePath);
    }
}

walk('C:/FoxSay/src', adjustContrast);
