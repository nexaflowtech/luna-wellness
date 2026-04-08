const fs = require('fs');
const https = require('https');

const dataPath = 'C:/Users/REDMI/.gemini/antigravity/brain/09543317-d236-496c-b026-8db38257e599/.system_generated/steps/12/output.txt';
const outDir = './tmp_screens';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const rawData = fs.readFileSync(dataPath, 'utf8');
const firstBracket = rawData.indexOf('{');
const jsonData = JSON.parse(rawData.substring(firstBracket));

jsonData.screens.forEach(s => {
  if (s.htmlCode && s.htmlCode.downloadUrl) {
    const safeTitle = s.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const file = fs.createWriteStream(`${outDir}/${safeTitle}.html`);
    https.get(s.htmlCode.downloadUrl, function(response) {
      response.pipe(file);
    });
  }
});
console.log('Started downloading all screens to ' + outDir);
