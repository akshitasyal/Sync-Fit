import os
import shutil
import json
import re

out_dir = r"C:\Users\Akshat\Sync-Fit\public\images\meals"

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

# Map fasting and secondary dishes to their exact master visual reference dish
dish_mapping = {
    # Fasting Sabudana & Khichdi -> vegan-sabudana-khichdi.jpg
    "sabudana-khichdi": "vegan-sabudana-khichdi.jpg",
    "sabudana-khichdi-fasting": "vegan-sabudana-khichdi.jpg",
    "sabudana-khichdi-vrat-special": "vegan-sabudana-khichdi.jpg",
    "sabudana-khichdi-vrat-specials": "vegan-sabudana-khichdi.jpg",
    "sabudana-khichdi-lunch": "vegan-sabudana-khichdi.jpg",
    "sabudana-thalipeeth": "sabudana-tikki-vegan.jpg",

    # Fasting Aloo -> aloo-gobi.jpg / aloo-matar.jpg
    "vrat-ke-aloo": "aloo-matar.jpg",
    "vrat-ke-aloo-curd": "aloo-matar.jpg",
    "dahi-aloo": "aloo-matar.jpg",
    "dahi-aloo-fasting": "aloo-matar.jpg",
    "dahi-aloo-fasting-dinner": "aloo-matar.jpg",

    # Fasting Sama Rice -> vegan-sama-rice-khichdi.jpg
    "samak-rice-khichdi": "vegan-sama-rice-khichdi.jpg",
    "sama-rice-pulao": "vegan-sama-rice-khichdi.jpg",
    "sama-rice-khichdi-lunch": "vegan-sama-rice-khichdi.jpg",
    "singhara-kadhi-with-sama-rice": "vegan-sama-rice-khichdi.jpg",

    # Fasting Kuttu / Singhara Puri & Roti -> paneer-paratha.jpg / kuttu-dosa-vegan.jpg
    "kuttu-puri-with-aloo-sabzi": "paneer-paratha.jpg",
    "kuttu-roti-with-aloo-sabzi": "paneer-paratha.jpg",
    "singhare-ki-puri": "paneer-paratha.jpg",
    "rajgira-paratha-with-curd": "paneer-paratha.jpg",
    "rajgira-roti-with-curd": "paneer-paratha.jpg",
    "kuttu-ka-chilla": "kuttu-dosa-vegan.jpg",

    # Fasting Makhana -> makhana-porridge.jpg / dry-fig-almond-trail-mix.jpg
    "makhana-curry": "dal-tadka-with-roti.jpg",
    "makhana-curry-with-kuttu-paratha": "dal-tadka-with-roti.jpg",
    "makhana-curry-dinner": "dal-tadka-with-roti.jpg",
    "roasted-masala-makhana": "almonds-walnuts-mix.jpg",
    "roasted-masala-makhana-vrat": "almonds-walnuts-mix.jpg",
    "dry-fruit-milk": "banana-almond-milk-smoothie.jpg",

    # Sweets & Fasting Snacks -> master reference equivalents
    "rajgira-ladoo": "trail-mix.jpg",
    "rajgira-amaranth-porridge": "oatmeal-with-banana-walnuts.jpg",
    "kuttu-kheer": "makhana-porridge.jpg",
    "vrat-dhokla": "idli-sambar.jpg",
    "vrat-peanut-chikki": "trail-mix.jpg",
    "dahi-vada-vrat-style": "idli-sambar.jpg",
    "dry-fruits-mix-and-apple": "peanut-butter-apple.jpg",
    "fruit-bowl-with-nuts": "mixed-fruit-bowl.jpg",
    "fasting-thali-light-meal": "dal-tadka-with-roti.jpg",
    "paneer-tomato-sabzi-vrat": "vegan-tofu-tikka-masala.jpg",
    "paneer-and-tomato-sabzi-vrat": "vegan-tofu-tikka-masala.jpg",

    # Vegetarian Dishes -> master reference equivalents
    "vegetable-biryani-with-raita": "chicken-biryani.jpg",
    "caprese-salad": "chicken-breast-salad.jpg",
    "vegetarian-black-bean-burger": "club-sandwich.jpg",
    "veggie-black-bean-burger": "club-sandwich.jpg",
    "chole-bhature": "paneer-paratha.jpg",
    "cheese-veggie-quesadilla": "cheese-tomato-toast.jpg",
    "cheese-vegetable-quesadilla": "cheese-tomato-toast.jpg",
    "tomato-soup-with-garlic-bread": "chicken-soup.jpg",
    "tofu-veg-fried-rice": "prawn-fried-rice.jpg",
    "paneer-tikka-salad": "chicken-breast-salad.jpg",
    "vegetable-korma-with-naan": "butter-chicken-with-rice.jpg",
    "stuffed-bell-peppers": "sweet-potato-black-bean-enchiladas.jpg",
    "veggie-pita-pizza": "cheese-tomato-toast.jpg",
    "malai-kofta": "butter-chicken-with-rice.jpg",
    "vegetarian-peanut-noodles": "zucchini-noodles-with-pesto.jpg",
    "paneer-tikka-with-naan": "chicken-tikka-with-roti.jpg",
    "shahi-paneer-with-rice": "butter-chicken-with-rice.jpg",
    "cottage-cheese-veg-bake": "vegan-eggplant-bake.jpg",
    "dal-makhani-with-garlic-naan": "dal-tadka-with-roti.jpg",
    "pasta-arrabbiata": "zucchini-noodles-with-pesto.jpg",
    "fruit-nut-yogurt-bowl": "greek-yogurt-with-berries.jpg",
    "spiced-cucumber-carrot-sticks": "hummus-with-veggie-sticks.jpg",
    "eggless-banana-oat-pancakes": "whey-protein-pancakes.jpg",
    "vermicelli-upma": "vegan-upma.jpg"
}

with open("all_db_meals.json", "r", encoding="utf-8") as f:
    meals = json.load(f)

for m in meals:
    slug = slugify(m["name"])
    target_file = os.path.join(out_dir, f"{slug}.jpg")
    if not os.path.exists(target_file):
        src_name = dish_mapping.get(slug)
        if src_name:
            src_path = os.path.join(out_dir, src_name)
            if os.path.exists(src_path):
                shutil.copyfile(src_path, target_file)
                print(f"Linked [{m['name']}] -> {slug}.jpg (from {src_name})")
            else:
                print(f"Source not found for {slug}: {src_name}")
        else:
            # Fallback to master reference default
            default_src = os.path.join(out_dir, "palak-paneer-with-roti.jpg")
            if os.path.exists(default_src):
                shutil.copyfile(default_src, target_file)
                print(f"Default linked [{m['name']}] -> {slug}.jpg")

print("\nFinished linking all database meals to master reference assets.")
