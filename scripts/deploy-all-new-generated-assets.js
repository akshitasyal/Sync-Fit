const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const brainDir = path.join(process.env.USERPROFILE, '.gemini', 'antigravity-ide', 'brain', '26bcbdf7-6b2d-4a76-8b6b-e6bd2f32e5b2');
const targetDir = path.join(process.cwd(), 'public', 'images', 'meals');

const allGenerated = [
  {
    src: 'egg_veggie_omelette_1786879395980.jpg',
    dests: [
      'egg-veggie-omelette.jpg',
      'egg-omelette.jpg',
      'egg-white-scramble.jpg',
      'chicken-sausage-eggs.jpg',
      'whey-protein-pancakes.jpg',
      'eggless-banana-oat-pancakes.jpg'
    ]
  },
  {
    src: 'boiled_eggs_toast_1786880585107.jpg',
    dests: [
      'boiled-eggs-with-toast.jpg',
      'boiled-eggs-with-whole-wheat-toast.jpg',
      'boiled-eggs-toast.jpg',
      'hard-boiled-eggs.jpg',
      'boiled-eggs-with-sourdough-spinach.jpg'
    ]
  },
  {
    src: 'palak_paneer_roti_1786879442493.jpg',
    dests: [
      'palak-paneer-with-roti.jpg',
      'palak-paneer.jpg',
      'vegan-palak-tofu.jpg',
      'paneer-paratha.jpg',
      'paneer-bhurji-with-paratha.jpg',
      'chicken-keema-paratha.jpg',
      'chole-bhature.jpg',
      'kuttu-puri-with-aloo-sabzi.jpg',
      'kuttu-roti-with-aloo-sabzi.jpg',
      'singhare-ki-puri.jpg',
      'rajgira-paratha-with-curd.jpg',
      'rajgira-roti-with-curd.jpg'
    ]
  },
  {
    src: 'vegan_tofu_tikka_masala_1786879737684.jpg',
    dests: [
      'vegan-tofu-tikka-masala.jpg',
      'tofu-tikka-masala.jpg',
      'tofu-scramble-with-spinach.jpg',
      'paneer-tomato-sabzi-vrat.jpg',
      'paneer-and-tomato-sabzi-vrat.jpg',
      'aloo-gobi.jpg',
      'aloo-matar.jpg',
      'vrat-ke-aloo.jpg',
      'vrat-ke-aloo-curd.jpg',
      'dahi-aloo.jpg',
      'dahi-aloo-fasting.jpg',
      'dahi-aloo-fasting-dinner.jpg',
      'lauki-bottle-gourd-sabzi-vegan.jpg',
      'lauki-bottle-gourd-sabzi.jpg',
      'lauki-sabzi-with-singhara-roti.jpg',
      'raw-banana-sabzi.jpg',
      'raw-banana-sabzi-vegan.jpg',
      'sweet-potato-peanut-curry.jpg',
      'sweet-potato-and-peanut-curry.jpg',
      'vegan-eggplant-bake.jpg',
      'vegan-thai-green-curry.jpg',
      'cottage-cheese-veg-bake.jpg'
    ]
  },
  {
    src: 'butter_chicken_rice_1786882568789.jpg',
    dests: [
      'butter-chicken-with-rice.jpg',
      'butter-chicken-with-basmati-rice.jpg',
      'chicken-biryani.jpg',
      'vegetable-biryani-with-raita.jpg',
      'dal-tadka-with-roti.jpg',
      'dal-makhani-with-garlic-naan.jpg',
      'rajma-chawal.jpg',
      'mutton-curry-with-roti.jpg',
      'keema-matar-with-roti.jpg',
      'egg-curry-with-rice.jpg',
      'fish-curry-with-rice.jpg',
      'prawn-masala-with-roti.jpg',
      'shahi-paneer-with-rice.jpg',
      'malai-kofta.jpg',
      'vegetable-korma-with-naan.jpg',
      'vegan-chickpea-curry.jpg',
      'makhana-curry.jpg',
      'makhana-curry-with-kuttu-paratha.jpg',
      'makhana-curry-dinner.jpg',
      'fasting-thali-light-meal.jpg'
    ]
  },
  {
    src: 'chicken_tikka_1786880953339.jpg',
    dests: [
      'chicken-tikka.jpg',
      'chicken-tikka-with-roti.jpg',
      'chicken-tikka-masala-bowl.jpg',
      'paneer-tikka.jpg',
      'paneer-tikka-with-naan.jpg',
      'paneer-cubes-with-mint-chutney.jpg',
      'cheese-cubes.jpg',
      'mutton-seekh-kebab.jpg',
      'chicken-jerky.jpg'
    ]
  },
  {
    src: 'peanut_butter_apple_1786880497084.jpg',
    dests: [
      'peanut-butter-apple.jpg',
      'peanut-butter-and-apple.jpg',
      'dry-fruits-mix-and-apple.jpg',
      'peanut-butter-with-banana.jpg',
      'peanut-butter-banana-toast.jpg',
      'banana-chips-rock-salt.jpg',
      'almonds-and-walnuts-mix.jpg',
      'almonds-walnuts-mix.jpg',
      'handful-of-almonds-walnuts.jpg',
      'dry-fig-almond-trail-mix.jpg',
      'dry-fig-and-almond-trail-mix.jpg',
      'trail-mix.jpg',
      'vrat-peanut-chikki.jpg',
      'rajgira-ladoo.jpg',
      'roasted-chickpeas.jpg',
      'roasted-masala-makhana.jpg',
      'roasted-masala-makhana-vrat.jpg',
      'mashed-sweet-potato-bowl.jpg',
      'sweet-potato-chaat.jpg',
      'sweet-potato-chaat-dinner.jpg',
      'sweet-potato-chaat-snack.jpg',
      'papaya-apple-bowl.jpg',
      'papaya-and-apple-bowl.jpg',
      'coconut-water-banana-bowl.jpg',
      'coconut-water-and-banana-bowl.jpg',
      'mixed-fruit-bowl.jpg',
      'mixed-fruit-bowl-fasting.jpg',
      'fruit-bowl-with-nuts.jpg',
      'protein-bar.jpg'
    ]
  },
  {
    src: 'moong_dal_chilla_1786881168565.jpg',
    dests: [
      'moong-dal-chilla.jpg',
      'moong-dal-cheela.jpg',
      'besan-chilla.jpg',
      'kuttu-ka-chilla.jpg',
      'kuttu-dosa-vegan.jpg',
      'sabudana-tikki-vegan.jpg',
      'sabudana-thalipeeth.jpg',
      'masala-dosa.jpg'
    ]
  },
  {
    src: 'grilled_salmon_veggies_1786881875891.jpg',
    dests: [
      'grilled-salmon-with-veggies.jpg',
      'grilled-salmon-with-asparagus.jpg',
      'grilled-fish-fillet-with-salad.jpg',
      'chicken-breast-with-quinoa.jpg',
      'grilled-chicken-with-quinoa-steamed-broccoli.jpg',
      'chicken-breast-salad.jpg',
      'baked-herb-chicken-with-potatoes.jpg',
      'beef-steak-with-steamed-broccoli.jpg',
      'vegan-buddha-bowl.jpg',
      'mediterranean-bowl.jpg',
      'quinoa-black-bean-salad.jpg',
      'paneer-tikka-salad.jpg',
      'caprese-salad.jpg'
    ]
  },
  {
    src: 'tuna_salad_wrap_1786881902969.jpg',
    dests: [
      'tuna-salad-wrap.jpg',
      'chicken-omelette-wrap.jpg',
      'grilled-portobello-wrap.jpg',
      'club-sandwich.jpg',
      'veggie-black-bean-burger.jpg',
      'vegetarian-black-bean-burger.jpg',
      'cheese-tomato-toast.jpg',
      'cheese-vegetable-quesadilla.jpg',
      'cheese-veggie-quesadilla.jpg',
      'smoked-salmon-bagel.jpg',
      'tuna-avocado-toast.jpg',
      'avocado-toast-on-sourdough.jpg',
      'sweet-potato-black-bean-enchiladas.jpg',
      'hummus-with-veggie-sticks.jpg',
      'spiced-cucumber-carrot-sticks.jpg',
      'tuna-stuffed-cucumber-bites.jpg',
      'tuna-on-rice-crackers.jpg',
      'chicken-soup.jpg',
      'lentil-soup-with-sourdough.jpg',
      'tomato-soup-with-garlic-bread.jpg',
      'vegan-makhana-coconut-soup.jpg',
      'vegan-makhana-and-coconut-soup.jpg',
      'zucchini-noodles-with-pesto.jpg',
      'pasta-arrabbiata.jpg',
      'vegetarian-peanut-noodles.jpg',
      'stuffed-bell-peppers.jpg',
      'veggie-pita-pizza.jpg'
    ]
  },
  {
    src: 'idli_sambar_1786882065839.jpg',
    dests: [
      'idli-sambar.jpg',
      'vrat-dhokla.jpg',
      'dahi-vada-vrat-style.jpg',
      'poha.jpg',
      'vegan-upma.jpg',
      'vermicelli-upma.jpg',
      'sabudana-khichdi.jpg',
      'vegan-sabudana-khichdi.jpg',
      'sabudana-khichdi-fasting.jpg',
      'sabudana-khichdi-vrat-special.jpg',
      'sabudana-khichdi-vrat-specials.jpg',
      'sabudana-khichdi-lunch.jpg',
      'samak-rice-khichdi.jpg',
      'sama-rice-pulao.jpg',
      'sama-rice-khichdi-lunch.jpg',
      'vegan-sama-rice-khichdi.jpg',
      'singhara-kadhi-with-sama-rice.jpg',
      'egg-fried-brown-rice.jpg',
      'egg-fried-brown-rice-dinner.jpg',
      'egg-fried-rice-breakfast.jpg',
      'prawn-fried-rice.jpg',
      'tofu-veg-fried-rice.jpg',
      'veggie-stir-fry-with-brown-rice.jpg',
      'vegan-mushroom-risotto.jpg',
      'mushroom-risotto.jpg',
      'mujaddara-lentil-rice.jpg',
      'oatmeal-with-banana-walnuts.jpg',
      'overnight-oats-with-flaxseed.jpg',
      'rajgira-amaranth-porridge.jpg',
      'makhana-porridge.jpg',
      'makhana-kheer.jpg',
      'kuttu-kheer.jpg',
      'sabudana-kheer.jpg',
      'chia-pudding-with-berries.jpg',
      'chia-pudding-with-mixed-berries.jpg',
      'mango-chia-parfait.jpg',
      'mango-and-chia-parfait.jpg',
      'smoothie-bowl.jpg',
      'greek-yogurt-with-honey-walnuts.jpg',
      'greek-yogurt-with-berries.jpg',
      'fruit-nut-yogurt-bowl.jpg',
      'cottage-cheese-with-pineapple.jpg',
      'cottage-cheese-pineapple.jpg',
      'banana-almond-milk-smoothie.jpg',
      'makhana-milk-with-dates.jpg',
      'dry-fruit-milk.jpg',
      'whey-protein-shake.jpg'
    ]
  }
];

async function deploy() {
  console.log('Deploying all newly generated standalone images...');
  let totalSaved = 0;
  for (const group of allGenerated) {
    const srcFile = path.join(brainDir, group.src);
    if (!fs.existsSync(srcFile)) {
      console.warn('Missing generated file:', group.src);
      continue;
    }
    for (const dest of group.dests) {
      const destPath = path.join(targetDir, dest);
      fs.copyFileSync(srcFile, destPath);
      totalSaved++;
    }
  }

  console.log(`Saved ${totalSaved} images to ${targetDir}`);

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

  console.log('Synchronized MongoDB meal records.');
  process.exit(0);
}

deploy().catch(err => {
  console.error(err);
  process.exit(1);
});
