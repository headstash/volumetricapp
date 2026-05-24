// fetch https://dl.nwjs.io/v0.97.0/nwjs-sdk-v0.97.0-win-x64.zip and unzip to dist using vanilla js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');

const version = 'v0.97.0';
const platform = 'win-x64';
const url = `https://dl.nwjs.io/${version}/nwjs-sdk-${version}-${platform}.zip`;
const distDir = path.join(process.cwd(), 'dist', 'package.nw');
const zipPath = path.join(distDir, `nwjs-sdk-${version}-${platform}.zip`);

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Download file using https (memory efficient)
const downloadFile = () => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(zipPath, () => {}); // Clean up on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(zipPath, () => {}); // Clean up on error
      reject(err);
    });
  });
};

// Extract using pnpx and unzip
const extractZip = () => {
  return new Promise((resolve, reject) => {
    exec(`unzip ${zipPath} ${distDir}`, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

// Main function
async function main() {
  try {
    console.log(`Downloading nwjs-sdk from ${url}...`);
    await downloadFile();
    console.log('Download complete. Extracting...');
    await extractZip();
    console.log('Extraction complete.');
  } catch (error) {
    console.error('Error during postinstall:', error);
    process.exit(1);
  }
}

main();