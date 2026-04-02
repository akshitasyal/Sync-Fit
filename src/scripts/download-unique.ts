import https from "https";
import fs from "fs";
import path from "path";

const destBenefits = "C:\\Users\\Akshat\\Sync-Fit\\public\\images\\programs\\benefits";
const destFeatures = "C:\\Users\\Akshat\\Sync-Fit\\public\\images\\programs\\features";

if (!fs.existsSync(destBenefits)) fs.mkdirSync(destBenefits, { recursive: true });
if (!fs.existsSync(destFeatures)) fs.mkdirSync(destFeatures, { recursive: true });

const downloadImage = (url: string, dest: string) => {
  return new Promise<void>((resolve, reject) => {
    https.get(url, response => {
      // Handle redirects
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        let redirectUrl = response.headers.location;
        if (redirectUrl.startsWith('/')) {
            redirectUrl = 'https://loremflickr.com' + redirectUrl;
        }
        return downloadImage(redirectUrl, dest).then(resolve).catch(reject);
      }

      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  const programs = ['strength', 'weightLoss', 'cardio', 'adaptive', 'muscleGain', 'beginner'];
  let lockIndex = 1;

  for (const prog of programs) {
    for (let i = 0; i < 3; i++) {
        const dest = path.join(destBenefits, `${prog}-${i + 1}.jpg`);
        const url = `https://loremflickr.com/800/600/fitness,gym?lock=${lockIndex++}`;
        console.log(`Downloading benefit ${prog}-${i + 1}...`);
        await downloadImage(url, dest);
    }
    for (let i = 0; i < 4; i++) {
        const dest = path.join(destFeatures, `${prog}-${i + 1}.jpg`);
        const url = `https://loremflickr.com/800/600/fitness,gym?lock=${lockIndex++}`;
        console.log(`Downloading feature ${prog}-${i + 1}...`);
        await downloadImage(url, dest);
    }
  }

  console.log("All unique images downloaded successfully.");
}

main().catch(console.error);
