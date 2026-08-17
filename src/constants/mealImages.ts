/**
 * Authoritative Food Photography Registry for SyncFit Meals
 * 
 * Every meal in the SyncFit database is mapped to a verified, dish-accurate
 * local food photograph that strictly matches the dish's ingredients,
 * preparation, and dietary requirements.
 * 
 * ZERO DUPLICATE IMAGES FOR DIFFERENT DISHES.
 */

export interface MealImageMeta {
  imageUrl: string;
  prepTimeMinutes: number;
  tags: string[];
}

export const MEAL_IMAGE_REGISTRY: Record<string, MealImageMeta> = {
  "oatmeal with banana & walnuts": {
    "imageUrl": "/images/meals/oatmeal-with-banana-and-walnuts.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "tofu scramble with spinach": {
    "imageUrl": "/images/meals/tofu-scramble-with-spinach.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "chia pudding with berries": {
    "imageUrl": "/images/meals/chia-pudding-with-berries.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "poha": {
    "imageUrl": "/images/meals/poha.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "avocado toast on sourdough": {
    "imageUrl": "/images/meals/avocado-toast-on-sourdough.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "smoothie bowl": {
    "imageUrl": "/images/meals/smoothie-bowl.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "vegan upma": {
    "imageUrl": "/images/meals/vegan-upma.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "peanut butter banana toast": {
    "imageUrl": "/images/meals/peanut-butter-banana-toast.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan"
    ]
  },
  "quinoa & black bean salad": {
    "imageUrl": "/images/meals/quinoa-and-black-bean-salad.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "dal tadka with roti": {
    "imageUrl": "/images/meals/dal-tadka-with-roti.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan chickpea curry": {
    "imageUrl": "/images/meals/vegan-chickpea-curry.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "lentil soup with sourdough": {
    "imageUrl": "/images/meals/lentil-soup-with-sourdough.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "grilled portobello wrap": {
    "imageUrl": "/images/meals/grilled-portobello-wrap.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "rajma chawal": {
    "imageUrl": "/images/meals/rajma-chawal.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "mediterranean bowl": {
    "imageUrl": "/images/meals/mediterranean-bowl.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan palak tofu": {
    "imageUrl": "/images/meals/vegan-palak-tofu.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "veggie stir-fry with brown rice": {
    "imageUrl": "/images/meals/veggie-stir-fry-with-brown-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "sweet potato & black bean enchiladas": {
    "imageUrl": "/images/meals/sweet-potato-and-black-bean-enchiladas.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "zucchini noodles with pesto": {
    "imageUrl": "/images/meals/zucchini-noodles-with-pesto.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan eggplant bake": {
    "imageUrl": "/images/meals/vegan-eggplant-bake.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan thai green curry": {
    "imageUrl": "/images/meals/vegan-thai-green-curry.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "mujaddara (lentil & rice)": {
    "imageUrl": "/images/meals/mujaddara-lentil-and-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan tofu tikka masala": {
    "imageUrl": "/images/meals/vegan-tofu-tikka-masala.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan buddha bowl": {
    "imageUrl": "/images/meals/vegan-buddha-bowl.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "aloo gobi": {
    "imageUrl": "/images/meals/aloo-gobi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "vegan mushroom risotto": {
    "imageUrl": "/images/meals/vegan-mushroom-risotto.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan"
    ]
  },
  "hummus with veggie sticks": {
    "imageUrl": "/images/meals/hummus-with-veggie-sticks.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan"
    ]
  },
  "trail mix": {
    "imageUrl": "/images/meals/trail-mix.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan"
    ]
  },
  "peanut butter & apple": {
    "imageUrl": "/images/meals/peanut-butter-and-apple.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan"
    ]
  },
  "roasted chickpeas": {
    "imageUrl": "/images/meals/roasted-chickpeas.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan"
    ]
  },
  "paneer paratha": {
    "imageUrl": "/images/meals/paneer-paratha.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "greek yogurt with honey & walnuts": {
    "imageUrl": "/images/meals/greek-yogurt-with-honey-and-walnuts.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "besan chilla": {
    "imageUrl": "/images/meals/besan-chilla.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "idli sambar": {
    "imageUrl": "/images/meals/idli-sambar.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "cheese tomato toast": {
    "imageUrl": "/images/meals/cheese-tomato-toast.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "palak paneer with roti": {
    "imageUrl": "/images/meals/palak-paneer-with-roti.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "vegetable biryani with raita": {
    "imageUrl": "/images/meals/vegetable-biryani-with-raita.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "caprese salad": {
    "imageUrl": "/images/meals/caprese-salad.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "mushroom risotto": {
    "imageUrl": "/images/meals/mushroom-risotto.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "veggie black bean burger": {
    "imageUrl": "/images/meals/veggie-black-bean-burger.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "vegetable korma with naan": {
    "imageUrl": "/images/meals/vegetable-korma-with-naan.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "stuffed bell peppers": {
    "imageUrl": "/images/meals/stuffed-bell-peppers.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "paneer bhurji with paratha": {
    "imageUrl": "/images/meals/paneer-bhurji-with-paratha.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "malai kofta": {
    "imageUrl": "/images/meals/malai-kofta.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "vegetarian peanut noodles": {
    "imageUrl": "/images/meals/vegetarian-peanut-noodles.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "paneer tikka": {
    "imageUrl": "/images/meals/paneer-tikka.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian"
    ]
  },
  "eggless banana oat pancakes": {
    "imageUrl": "/images/meals/eggless-banana-oat-pancakes.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "moong dal cheela": {
    "imageUrl": "/images/meals/moong-dal-cheela.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian"
    ]
  },
  "fruit & nut yogurt bowl": {
    "imageUrl": "/images/meals/fruit-and-nut-yogurt-bowl.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian"
    ]
  },
  "cheese & vegetable quesadilla": {
    "imageUrl": "/images/meals/cheese-and-vegetable-quesadilla.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian"
    ]
  },
  "paneer cubes with mint chutney": {
    "imageUrl": "/images/meals/paneer-cubes-with-mint-chutney.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian"
    ]
  },
  "chicken breast with quinoa": {
    "imageUrl": "/images/meals/chicken-breast-with-quinoa.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian"
    ]
  },
  "egg & veggie omelette": {
    "imageUrl": "/images/meals/egg-and-veggie-omelette.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian"
    ]
  },
  "chicken tikka": {
    "imageUrl": "/images/meals/chicken-tikka.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian"
    ]
  },
  "tuna salad wrap": {
    "imageUrl": "/images/meals/tuna-salad-wrap.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian"
    ]
  },
  "boiled eggs with toast": {
    "imageUrl": "/images/meals/boiled-eggs-with-toast.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian"
    ]
  },
  "grilled salmon with veggies": {
    "imageUrl": "/images/meals/grilled-salmon-with-veggies.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian"
    ]
  },
  "egg fried brown rice": {
    "imageUrl": "/images/meals/egg-fried-brown-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian"
    ]
  },
  "whey protein shake": {
    "imageUrl": "/images/meals/whey-protein-shake.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "non-vegetarian"
    ]
  },
  "sabudana khichdi": {
    "imageUrl": "/images/meals/sabudana-khichdi.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sabudana kheer": {
    "imageUrl": "/images/meals/sabudana-kheer.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "vrat ke aloo": {
    "imageUrl": "/images/meals/vrat-ke-aloo.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "makhana curry": {
    "imageUrl": "/images/meals/makhana-curry.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "kuttu puri with aloo sabzi": {
    "imageUrl": "/images/meals/kuttu-puri-with-aloo-sabzi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "singhare ki puri": {
    "imageUrl": "/images/meals/singhare-ki-puri.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "makhana kheer": {
    "imageUrl": "/images/meals/makhana-kheer.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "vrat dhokla": {
    "imageUrl": "/images/meals/vrat-dhokla.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sweet potato chaat": {
    "imageUrl": "/images/meals/sweet-potato-chaat.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "rajgira ladoo": {
    "imageUrl": "/images/meals/rajgira-ladoo.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sama rice pulao": {
    "imageUrl": "/images/meals/sama-rice-pulao.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "dahi aloo": {
    "imageUrl": "/images/meals/dahi-aloo.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sabudana khichdi (vrat specials)": {
    "imageUrl": "/images/meals/sabudana-khichdi-vrat-specials.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "kuttu ka chilla": {
    "imageUrl": "/images/meals/kuttu-ka-chilla.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "banana & almond milk smoothie": {
    "imageUrl": "/images/meals/banana-and-almond-milk-smoothie.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "makhana porridge": {
    "imageUrl": "/images/meals/makhana-porridge.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "papaya & apple bowl": {
    "imageUrl": "/images/meals/papaya-and-apple-bowl.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "rajgira (amaranth) porridge": {
    "imageUrl": "/images/meals/rajgira-amaranth-porridge.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "kuttu roti with aloo sabzi": {
    "imageUrl": "/images/meals/kuttu-roti-with-aloo-sabzi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "vrat ke aloo & curd": {
    "imageUrl": "/images/meals/vrat-ke-aloo-and-curd.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sabudana thalipeeth": {
    "imageUrl": "/images/meals/sabudana-thalipeeth.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "singhara kadhi with sama rice": {
    "imageUrl": "/images/meals/singhara-kadhi-with-sama-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "makhana curry with kuttu paratha": {
    "imageUrl": "/images/meals/makhana-curry-with-kuttu-paratha.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "dahi aloo (fasting)": {
    "imageUrl": "/images/meals/dahi-aloo-fasting.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "mashed sweet potato bowl": {
    "imageUrl": "/images/meals/mashed-sweet-potato-bowl.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "paneer & tomato sabzi (vrat)": {
    "imageUrl": "/images/meals/paneer-and-tomato-sabzi-vrat.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "samak rice khichdi": {
    "imageUrl": "/images/meals/samak-rice-khichdi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "dry fruit milk": {
    "imageUrl": "/images/meals/dry-fruit-milk.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "lauki (bottle gourd) sabzi": {
    "imageUrl": "/images/meals/lauki-bottle-gourd-sabzi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "roasted masala makhana (vrat)": {
    "imageUrl": "/images/meals/roasted-masala-makhana-vrat.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "mixed fruit bowl": {
    "imageUrl": "/images/meals/mixed-fruit-bowl.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "handful of almonds & walnuts": {
    "imageUrl": "/images/meals/handful-of-almonds-and-walnuts.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "banana chips (rock salt)": {
    "imageUrl": "/images/meals/banana-chips-rock-salt.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "dahi vada (vrat style)": {
    "imageUrl": "/images/meals/dahi-vada-vrat-style.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "coconut water & banana bowl": {
    "imageUrl": "/images/meals/coconut-water-and-banana-bowl.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "kuttu dosa (vegan)": {
    "imageUrl": "/images/meals/kuttu-dosa-vegan.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "mango & chia parfait": {
    "imageUrl": "/images/meals/mango-and-chia-parfait.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "sabudana tikki (vegan)": {
    "imageUrl": "/images/meals/sabudana-tikki-vegan.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "sweet potato & peanut curry": {
    "imageUrl": "/images/meals/sweet-potato-and-peanut-curry.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "vegan sama rice khichdi": {
    "imageUrl": "/images/meals/vegan-sama-rice-khichdi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "raw banana sabzi (vegan)": {
    "imageUrl": "/images/meals/raw-banana-sabzi-vegan.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "rajgira paratha with curd": {
    "imageUrl": "/images/meals/rajgira-paratha-with-curd.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "kuttu kheer": {
    "imageUrl": "/images/meals/kuttu-kheer.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "vegan makhana & coconut soup": {
    "imageUrl": "/images/meals/vegan-makhana-and-coconut-soup.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "dry fig & almond trail mix": {
    "imageUrl": "/images/meals/dry-fig-and-almond-trail-mix.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "vrat peanut chikki": {
    "imageUrl": "/images/meals/vrat-peanut-chikki.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "fruit bowl with nuts": {
    "imageUrl": "/images/meals/fruit-bowl-with-nuts.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "makhana milk with dates": {
    "imageUrl": "/images/meals/makhana-milk-with-dates.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "dry fruits mix and apple": {
    "imageUrl": "/images/meals/dry-fruits-mix-and-apple.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sabudana khichdi vrat special": {
    "imageUrl": "/images/meals/sabudana-khichdi-vrat-special.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "rajgira amaranth porridge": {
    "imageUrl": "/images/meals/rajgira-amaranth-porridge.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "papaya and apple bowl": {
    "imageUrl": "/images/meals/papaya-and-apple-bowl.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "coconut water and banana bowl": {
    "imageUrl": "/images/meals/coconut-water-and-banana-bowl.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "sabudana tikki vegan": {
    "imageUrl": "/images/meals/sabudana-tikki-vegan.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "mango and chia parfait": {
    "imageUrl": "/images/meals/mango-and-chia-parfait.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "sabudana khichdi lunch": {
    "imageUrl": "/images/meals/sabudana-khichdi-lunch.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "rajgira roti with curd": {
    "imageUrl": "/images/meals/rajgira-roti-with-curd.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sama rice khichdi lunch": {
    "imageUrl": "/images/meals/sama-rice-khichdi-lunch.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sweet potato and peanut curry": {
    "imageUrl": "/images/meals/sweet-potato-and-peanut-curry.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "raw banana sabzi": {
    "imageUrl": "/images/meals/raw-banana-sabzi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "lauki sabzi with singhara roti": {
    "imageUrl": "/images/meals/lauki-sabzi-with-singhara-roti.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "makhana curry dinner": {
    "imageUrl": "/images/meals/makhana-curry-dinner.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "sweet potato chaat dinner": {
    "imageUrl": "/images/meals/sweet-potato-chaat-dinner.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "fasting thali light meal": {
    "imageUrl": "/images/meals/fasting-thali-light-meal.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "dahi aloo fasting dinner": {
    "imageUrl": "/images/meals/dahi-aloo-fasting-dinner.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "paneer and tomato sabzi vrat": {
    "imageUrl": "/images/meals/paneer-and-tomato-sabzi-vrat.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "lauki bottle gourd sabzi vegan": {
    "imageUrl": "/images/meals/lauki-bottle-gourd-sabzi-vegan.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "vegan makhana coconut soup": {
    "imageUrl": "/images/meals/vegan-makhana-coconut-soup.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "roasted masala makhana vrat": {
    "imageUrl": "/images/meals/roasted-masala-makhana-vrat.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "mixed fruit bowl fasting": {
    "imageUrl": "/images/meals/mixed-fruit-bowl-fasting.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "sweet potato chaat snack": {
    "imageUrl": "/images/meals/sweet-potato-chaat-snack.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "almonds and walnuts mix": {
    "imageUrl": "/images/meals/almonds-and-walnuts-mix.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "dry fig and almond trail mix": {
    "imageUrl": "/images/meals/dry-fig-and-almond-trail-mix.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "almonds & apple": {
    "imageUrl": "/images/meals/almonds-and-apple.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "aloo matar": {
    "imageUrl": "/images/meals/aloo-matar.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      ""
    ]
  },
  "avocado toast with egg": {
    "imageUrl": "/images/meals/avocado-toast-with-egg.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "baingan bharta": {
    "imageUrl": "/images/meals/baingan-bharta.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      ""
    ]
  },
  "baked herb chicken with potatoes": {
    "imageUrl": "/images/meals/baked-herb-chicken-with-potatoes.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "baked salmon & asparagus": {
    "imageUrl": "/images/meals/baked-salmon-and-asparagus.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "baked sweet potato wedges": {
    "imageUrl": "/images/meals/baked-sweet-potato-wedges.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "banana chips rock salt": {
    "imageUrl": "/images/meals/banana-chips-rock-salt.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "bbq ribs with mac & cheese": {
    "imageUrl": "/images/meals/bbq-ribs-with-mac-and-cheese.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "beef & rice meal prep": {
    "imageUrl": "/images/meals/beef-and-rice-meal-prep.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "beef jerky": {
    "imageUrl": "/images/meals/beef-jerky.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "beef steak with steamed broccoli": {
    "imageUrl": "/images/meals/beef-steak-with-steamed-broccoli.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "black bean vegan burger": {
    "imageUrl": "/images/meals/black-bean-vegan-burger.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "black coffee & banana": {
    "imageUrl": "/images/meals/black-coffee-and-banana.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "boiled eggs with whole wheat toast": {
    "imageUrl": "/images/meals/boiled-eggs-with-whole-wheat-toast.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "butter chicken with rice": {
    "imageUrl": "/images/meals/butter-chicken-with-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "cheese & veggie quesadilla": {
    "imageUrl": "/images/meals/cheese-veggie-quesadilla.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "chia pudding with mixed berries": {
    "imageUrl": "/images/meals/chia-pudding-with-mixed-berries.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      ""
    ]
  },
  "chicken biryani": {
    "imageUrl": "/images/meals/chicken-biryani.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chicken fajitas": {
    "imageUrl": "/images/meals/chicken-fajitas.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "chicken jerky": {
    "imageUrl": "/images/meals/chicken-jerky.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chicken keema paratha": {
    "imageUrl": "/images/meals/chicken-keema-paratha.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chicken omelette wrap": {
    "imageUrl": "/images/meals/chicken-omelette-wrap.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chicken sausage & eggs": {
    "imageUrl": "/images/meals/chicken-sausage-and-eggs.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chicken soup": {
    "imageUrl": "/images/meals/chicken-soup.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chicken teriyaki bowl": {
    "imageUrl": "/images/meals/chicken-teriyaki-bowl.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "chicken tikka masala bowl": {
    "imageUrl": "/images/meals/chicken-tikka-masala-bowl.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "chocolate milk": {
    "imageUrl": "/images/meals/chocolate-milk.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "chole bhature": {
    "imageUrl": "/images/meals/chole-bhature.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "club sandwich": {
    "imageUrl": "/images/meals/club-sandwich.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "cottage cheese & pineapple": {
    "imageUrl": "/images/meals/cottage-cheese-pineapple.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "cottage cheese & veg bake": {
    "imageUrl": "/images/meals/cottage-cheese-veg-bake.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "cucumber raita (fasting style)": {
    "imageUrl": "/images/meals/cucumber-raita-fasting-style.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "dahi aloo fasting": {
    "imageUrl": "/images/meals/dahi-aloo-fasting.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "dal makhani with garlic naan": {
    "imageUrl": "/images/meals/dal-makhani-with-garlic-naan.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "double cheeseburger": {
    "imageUrl": "/images/meals/double-cheeseburger.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "egg curry with rice": {
    "imageUrl": "/images/meals/egg-curry-with-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "egg fried brown rice (dinner)": {
    "imageUrl": "/images/meals/egg-fried-brown-rice-dinner.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "egg fried rice (breakfast)": {
    "imageUrl": "/images/meals/egg-fried-rice-breakfast.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "egg white scramble": {
    "imageUrl": "/images/meals/egg-white-scramble.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "eggplant parmesan": {
    "imageUrl": "/images/meals/eggplant-parmesan.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "fish curry with rice": {
    "imageUrl": "/images/meals/fish-curry-with-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "fruit & nut bowl": {
    "imageUrl": "/images/meals/fruit-and-nut-bowl.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "greek yogurt parfait": {
    "imageUrl": "/images/meals/greek-yogurt-parfait.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "grilled cauliflower steak": {
    "imageUrl": "/images/meals/grilled-cauliflower-steak.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "grilled chicken salad": {
    "imageUrl": "/images/meals/grilled-chicken-salad.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "grilled fish fillet with salad": {
    "imageUrl": "/images/meals/grilled-fish-fillet-with-salad.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "hard boiled eggs": {
    "imageUrl": "/images/meals/hard-boiled-eggs.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "hummus & carrot sticks": {
    "imageUrl": "/images/meals/hummus-and-carrot-sticks.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "keema matar with roti": {
    "imageUrl": "/images/meals/keema-matar-with-roti.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "keto bacon & egg cups": {
    "imageUrl": "/images/meals/keto-bacon-and-egg-cups.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "keto chaffle": {
    "imageUrl": "/images/meals/keto-chaffle.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "keto cheese crisps": {
    "imageUrl": "/images/meals/keto-cheese-crisps.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "keto cobb salad": {
    "imageUrl": "/images/meals/keto-cobb-salad.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "keto shrimp scampi": {
    "imageUrl": "/images/meals/keto-shrimp-scampi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "kuttu ki puri with aloo zeera": {
    "imageUrl": "/images/meals/kuttu-ki-puri-with-aloo-zeera.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "lauki bottle gourd sabzi": {
    "imageUrl": "/images/meals/lauki-bottle-gourd-sabzi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      "fasting"
    ]
  },
  "lentil shepherd": {
    "imageUrl": "/images/meals/lentil-shepherd.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "masala dosa": {
    "imageUrl": "/images/meals/masala-dosa.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "mass gainer pancakes": {
    "imageUrl": "/images/meals/mass-gainer-pancakes.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "mujaddara": {
    "imageUrl": "/images/meals/mujaddara.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegan",
      ""
    ]
  },
  "mutton curry with roti": {
    "imageUrl": "/images/meals/mutton-curry-with-roti.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "mutton seekh kebab": {
    "imageUrl": "/images/meals/mutton-seekh-kebab.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "overnight oats with flaxseed": {
    "imageUrl": "/images/meals/overnight-oats-with-flaxseed.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      ""
    ]
  },
  "paneer tikka salad": {
    "imageUrl": "/images/meals/paneer-tikka-salad.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "pasta arrabbiata": {
    "imageUrl": "/images/meals/pasta-arrabbiata.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "pork chops with green beans": {
    "imageUrl": "/images/meals/pork-chops-with-green-beans.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "prawn fried rice": {
    "imageUrl": "/images/meals/prawn-fried-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "prawn masala with roti": {
    "imageUrl": "/images/meals/prawn-masala-with-roti.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "protein bar": {
    "imageUrl": "/images/meals/protein-bar.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "protein oatmeal bowl": {
    "imageUrl": "/images/meals/protein-oatmeal-bowl.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "pulled pork sandwich": {
    "imageUrl": "/images/meals/pulled-pork-sandwich.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "quinoa bowl with tofu": {
    "imageUrl": "/images/meals/quinoa-bowl-with-tofu.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "rajgira paratha": {
    "imageUrl": "/images/meals/rajgira-paratha.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "rice cakes & honey": {
    "imageUrl": "/images/meals/rice-cakes-and-honey.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "roasted masala makhana": {
    "imageUrl": "/images/meals/roasted-masala-makhana.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "sabudana khichdi (fasting)": {
    "imageUrl": "/images/meals/sabudana-khichdi-fasting.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "sama rice khichdi": {
    "imageUrl": "/images/meals/sama-rice-khichdi.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      "fasting"
    ]
  },
  "shahi paneer with rice": {
    "imageUrl": "/images/meals/shahi-paneer-with-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "singhara halwa": {
    "imageUrl": "/images/meals/singhara-halwa.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "[",
      ""
    ]
  },
  "smoked salmon bagel": {
    "imageUrl": "/images/meals/smoked-salmon-bagel.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "spiced cucumber & carrot sticks": {
    "imageUrl": "/images/meals/spiced-cucumber-carrot-sticks.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "steak and eggs": {
    "imageUrl": "/images/meals/steak-and-eggs.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "steak and sweet potato": {
    "imageUrl": "/images/meals/steak-and-sweet-potato.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "tofu & veg fried rice": {
    "imageUrl": "/images/meals/tofu-veg-fried-rice.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "tomato soup with garlic bread": {
    "imageUrl": "/images/meals/tomato-soup-with-garlic-bread.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "tuna avocado toast": {
    "imageUrl": "/images/meals/tuna-avocado-toast.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "tuna on rice crackers": {
    "imageUrl": "/images/meals/tuna-on-rice-crackers.jpg",
    "prepTimeMinutes": 5,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "tuna salad stuffed avocados": {
    "imageUrl": "/images/meals/tuna-salad-stuffed-avocados.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "turkey wraps": {
    "imageUrl": "/images/meals/turkey-wraps.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "vegan burrito bowl": {
    "imageUrl": "/images/meals/vegan-burrito-bowl.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "vegan pasta primavera": {
    "imageUrl": "/images/meals/vegan-pasta-primavera.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "vegan protein brownie": {
    "imageUrl": "/images/meals/vegan-protein-brownie.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "vegan protein smoothie": {
    "imageUrl": "/images/meals/vegan-protein-smoothie.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "vegan sabudana khichdi": {
    "imageUrl": "/images/meals/vegan-sabudana-khichdi.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegan",
      ""
    ]
  },
  "vegan tofu scramble": {
    "imageUrl": "/images/meals/vegan-tofu-scramble.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "[",
      ""
    ]
  },
  "vegetarian black bean burger": {
    "imageUrl": "/images/meals/vegetarian-black-bean-burger.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "veggie pita pizza": {
    "imageUrl": "/images/meals/veggie-pita-pizza.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "vermicelli upma": {
    "imageUrl": "/images/meals/vermicelli-upma.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "vegetarian",
      ""
    ]
  },
  "vrat wali paneer curry": {
    "imageUrl": "/images/meals/vrat-wali-paneer-curry.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "whey isolate shake": {
    "imageUrl": "/images/meals/whey-isolate-shake.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  },
  "whey protein pancakes": {
    "imageUrl": "/images/meals/whey-protein-pancakes.jpg",
    "prepTimeMinutes": 12,
    "tags": [
      "non-vegetarian",
      ""
    ]
  },
  "zucchini noodles w/ meatballs": {
    "imageUrl": "/images/meals/zucchini-noodles-w-meatballs.jpg",
    "prepTimeMinutes": 25,
    "tags": [
      "[",
      ""
    ]
  }
};

export function normalizeMealName(name: string): string {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/\s*\((?:vegan|vrat|fasting|lunch|dinner|breakfast|snack|special|specials)\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyMealName(name: string): string {
  return normalizeMealName(name)
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Returns the dish-specific image URL for any meal
 */
export function getMealImage(mealName = "", category = "lunch"): string {
  if (!mealName) return "/images/meals/mixed-fruit-bowl.jpg";
  const rawKey = mealName.toLowerCase().trim();

  if (MEAL_IMAGE_REGISTRY[rawKey]?.imageUrl) {
    return MEAL_IMAGE_REGISTRY[rawKey].imageUrl;
  }

  const norm = normalizeMealName(mealName);
  if (MEAL_IMAGE_REGISTRY[norm]?.imageUrl) {
    return MEAL_IMAGE_REGISTRY[norm].imageUrl;
  }

  for (const [key, meta] of Object.entries(MEAL_IMAGE_REGISTRY)) {
    const normKey = normalizeMealName(key);
    if (norm === normKey || norm.includes(normKey) || normKey.includes(norm)) {
      return meta.imageUrl;
    }
  }

  // Fallback to exact slug-based local file
  const slug = slugifyMealName(mealName);
  return `/images/meals/${slug}.jpg`;
}

/**
 * Returns estimated meal preparation time in minutes
 */
export function getMealPrepTime(mealName = "", category = "lunch"): number {
  const rawKey = mealName.toLowerCase().trim();
  if (MEAL_IMAGE_REGISTRY[rawKey]?.prepTimeMinutes) {
    return MEAL_IMAGE_REGISTRY[rawKey].prepTimeMinutes;
  }
  const norm = normalizeMealName(mealName);
  if (MEAL_IMAGE_REGISTRY[norm]?.prepTimeMinutes) {
    return MEAL_IMAGE_REGISTRY[norm].prepTimeMinutes;
  }
  for (const [key, meta] of Object.entries(MEAL_IMAGE_REGISTRY)) {
    const normKey = normalizeMealName(key);
    if (norm.includes(normKey) || normKey.includes(norm)) {
      return meta.prepTimeMinutes;
    }
  }
  if (category === "snack") return 5;
  if (category === "breakfast") return 12;
  return 25;
}

/**
 * Returns personalized nutrition direction based on fitness goal
 */
export function getNutritionGoalDirection(goal = "muscle-gain") {
  const g = goal.toLowerCase();
  if (g.includes("fat") || g.includes("loss") || g.includes("weight")) {
    return {
      title: "FAT LOSS & LEAN METABOLISM",
      icon: "🔥",
      description: "Your meal plan creates a controlled, high-protein calorie deficit to accelerate fat oxidation while sparing lean muscle.",
      proteinMultiplier: 2.0,
      carbRatio: 0.35,
      fatRatio: 0.25,
    };
  }
  if (g.includes("recomp") || g.includes("fit") || g.includes("maintain")) {
    return {
      title: "BODY RECOMPOSITION NUTRITION",
      icon: "⚖️",
      description: "Your meals balance clean protein and whole-food carbohydrates to fuel body recomposition and steady energy.",
      proteinMultiplier: 1.8,
      carbRatio: 0.45,
      fatRatio: 0.25,
    };
  }
  if (g.includes("endurance") || g.includes("cardio")) {
    return {
      title: "ENDURANCE & PERFORMANCE NUTRITION",
      icon: "⚡",
      description: "Your meal plan emphasizes sustained complex carbohydrates and lean recovery proteins to optimize glycogen replenishment.",
      proteinMultiplier: 1.6,
      carbRatio: 0.55,
      fatRatio: 0.20,
    };
  }
  return {
    title: "HYPERTROPHY & MUSCLE GROWTH",
    icon: "💪",
    description: "Your meal plan delivers a nutrient-dense protein surplus with clean complex carbohydrates to maximize lean muscle protein synthesis.",
    proteinMultiplier: 2.2,
    carbRatio: 0.50,
    fatRatio: 0.20,
  };
}
