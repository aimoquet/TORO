const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\alish\\.gemini\\antigravity-ide\\brain\\464f8b8c-38ac-4274-8b50-4242b3b4db43';
const destDir = path.join(__dirname, 'frontend', 'assets');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach(f => {
    if (f.startsWith('luxury_deluxe_suite') && f.endsWith('.jpg')) {
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'deluxe_suite.jpg'));
    }
    if (f.startsWith('luxury_penthouse_suite') && f.endsWith('.jpg')) {
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'penthouse_suite.jpg'));
    }
    if (f.startsWith('luxury_hotel_exterior') && f.endsWith('.jpg')) {
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'hotel_exterior.jpg'));
    }
    if (f.startsWith('room_360_panorama') && f.endsWith('.jpg')) {
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'deluxe_360.jpg'));
    }
    if (f.startsWith('penthouse_360_panorama') && f.endsWith('.jpg')) {
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'penthouse_360.jpg'));
    }
    if (f.startsWith('executive_suite_photo') && f.endsWith('.jpg')) {
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'executive_suite.jpg'));
    }
});

console.log('Successfully copied room photos and 360 panorama assets to frontend/assets!');
