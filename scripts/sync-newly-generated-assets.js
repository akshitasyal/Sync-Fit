const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const brainDir = path.join(process.env.USERPROFILE, '.gemini', 'antigravity-ide', 'brain', '26bcbdf7-6b2d-4a76-8b6b-e6bd2f32e5b2');
const targetDir = path.join(process.cwd(), 'public', 'images', 'meals');

const generatedMappings = [
  {
    src: 'egg_veggie_omelette_1786879395980.jpg',
    dests: ['egg-veggie-omelette.jpg', 'egg-omelette.jpg', 'egg-white-scramble.jpg']
  },
  {
    src: 'palak_paneer_roti_1786879442493.jpg',
    dests: ['palak-paneer-with-roti.jpg', 'palak-paneer.jpg', 'vegan-palak-tofu.jpg']
  },
  {
    src: 'vegan_tofu_tikka_masala_1786879737684.jpg',
    dests: ['vegan-tofu-tikka-masala.jpg', 'tofu-tikka-masala.jpg', 'tofu-scramble-with-spinach.jpg', 'paneer-tomato-sabzi-vrat.jpg', 'paneer-and-tomato-sabzi-vrat.jpg']
  },
  {
    src: 'peanut_butter_apple_1786880497084.jpg',
    dests: ['peanut-butter-apple.jpg', 'peanut-butter-and-apple.jpg', 'dry-fruits-mix-and-apple.jpg', 'peanut-butter-with-banana.jpg', 'peanut-butter-banana-toast.jpg']
  },
  {
    src: 'boiled_eggs_toast_1786880585107.jpg',
    dests: ['boiled-eggs-with-toast.jpg', 'boiled-eggs-with-whole-wheat-toast.jpg', 'boiled-eggs-toast.jpg', 'hard-boiled-eggs.jpg', 'boiled-eggs-with-sourdough-spinach.jpg']
  },
  {
    src: 'chicken_tikka_1786880953339.jpg',
    dests: ['chicken-tikka.jpg', 'chicken-tikka-with-roti.jpg', 'chicken-tikka-masala-bowl.jpg', 'paneer-tikka.jpg', 'paneer-cubes-with-mint-chutney.jpg', 'mutton-seekh-kebab.jpg']
  },
  {
    src: 'moong_dal_chilla_1786881168565.jpg',
    dests: ['moong-dal-chilla.jpg', 'moong-dal-cheela.jpg', 'besan-chilla.jpg', 'kuttu-ka-chilla.jpg', 'kuttu-dosa-vegan.jpg', 'sabudana-tikki-vegan.jpg', 'sabudana-thalipeeth.jpg']
  },
  {
    src: 'grilled_salmon_veggies_1786881875891.jpg',
    dests: ['grilled-salmon-with-veggies.jpg', 'grilled-salmon-with-asparagus.jpg', 'grilled-fish-fillet-with-salad.jpg', 'chicken-breast-with-quinoa.jpg', 'grilled-chicken-with-quinoa-steamed-broccoli.jpg', 'chicken-breast-salad.jpg', 'baked-herb-chicken-with-potatoes.jpg', 'beef-steak-with-steamed-broccoli.jpg']
  },
  {
    src: 'tuna_salad_wrap_1786881902969.jpg',
    dests: ['tuna-salad-wrap.jpg', 'chicken-omelette-wrap.jpg', 'grilled-portobello-wrap.jpg', 'club-sandwich.jpg', 'veggie-black-bean-burger.jpg', 'vegetarian-black-bean-burger.jpg', 'cheese-tomato-toast.jpg', 'cheese-vegetable-quesadilla.jpg', 'cheese-veggie-quesadilla.jpg', 'smoked-salmon-bagel.jpg', 'tuna-avocado-toast.jpg', 'avocado-toast-on-sourdough.jpg']
  },
  {
    src: 'idli_sambar_1786882065839.jpg',
    dests: ['idli-sambar.jpg', 'masala-dosa.jpg', 'vrat-dhokla.jpg', 'dahi-vada-vrat-style.jpg', 'poha.jpg', 'vegan-upma.jpg', 'vermicelli-upma.jpg', 'sabudana-khichdi.jpg', 'vegan-sabudana-khichdi.jpg', 'sabudana-khichdi-fasting.jpg', 'sabudana-khichdi-vrat-special.jpg', 'sabudana-khichdi-vrat-specials.jpg', 'sabudana-khichdi-lunch.jpg']
  }
];

async function sync() {
  console.log('Copying newly generated standalone food images...');

  let copied = 0;
  for (const item of generatedMappings) {
    const srcPath = path.join(brainDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn('Missing generated source:', item.src);
      continue;
    }
    for (const dest of item.dests) {
      const destPath = path.join(targetDir, dest);
      fs.copyFileSync(srcPath, destPath);
      copied++;
    }
  }
  console.log(`Successfully deployed ${copied} newly generated high-resolution assets to ${targetDir}`);

  // Connect and sync MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  const meals = await mongoose.connection.db.collection('meals').find({}).toArray();

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  for (const m of meals) {
    const slug = slugify(m.name);
    const destFile = `${slug}.jpg`;
    await mongoose.connection.db.collection('meals').updateOne(
      { _id: m._id },
      { $set: { imageUrl: `/images/meals/${destFile}` } }
    );
  }

  console.log('Synchronized MongoDB meal image URLs.');
  process.exit(0);
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
