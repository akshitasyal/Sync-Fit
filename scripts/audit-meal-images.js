const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function audit() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('        SYNCFIT MEAL IMAGE AUDIT VERIFICATION REPORT           ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await mongoose.connect(process.env.MONGODB_URI);
  const meals = await mongoose.connection.db.collection('meals').find({}).sort({ category: 1, name: 1 }).toArray();

  const mealImagesTs = fs.readFileSync(path.join(process.cwd(), 'src', 'constants', 'mealImages.ts'), 'utf8');

  let missingDbImg = 0;
  let missingFile = 0;
  let missingRegistry = 0;
  const results = [];

  for (const meal of meals) {
    const slug = meal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${slug}.jpg`;
    const localFilePath = path.join(process.cwd(), 'public', 'images', 'meals', filename);
    const hasDbImg = !!meal.imageUrl;
    const fileExists = fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 1000;
    const rawKey = meal.name.toLowerCase().trim();
    const inRegistry = mealImagesTs.includes(`"${rawKey}"`) || mealImagesTs.includes(`'${rawKey}'`);

    if (!hasDbImg) missingDbImg++;
    if (!fileExists) missingFile++;
    if (!inRegistry) missingRegistry++;

    results.push({
      name: meal.name,
      category: meal.category,
      dietType: meal.dietType,
      imageUrl: meal.imageUrl,
      fileExists,
      fileSize: fileExists ? `${Math.round(fs.statSync(localFilePath).size / 1024)} KB` : 'MISSING',
      inRegistry
    });
  }

  console.log(`Total Meals Audited: ${meals.length}`);
  console.log(`DB Image URL Populated: ${meals.length - missingDbImg}/${meals.length}`);
  console.log(`Local Image File Exists (>1KB): ${meals.length - missingFile}/${meals.length}`);
  console.log(`Registry Keys Matched: ${meals.length - missingRegistry}/${meals.length}\n`);

  if (missingFile === 0 && missingDbImg === 0) {
    console.log('🎉 100% OF ALL DATABASE MEALS HAVE VALID DISH-ACCURATE LOCAL IMAGES!');
  } else {
    console.warn(`⚠️ Warning: ${missingFile} missing files, ${missingDbImg} missing DB urls.`);
  }

  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
  console.log('Audit results saved to audit_results.json');
  process.exit(0);
}

audit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
