import os
import re
from PIL import Image

master_path = r"C:\Users\Akshat\.gemini\antigravity-ide\brain\26bcbdf7-6b2d-4a76-8b6b-e6bd2f32e5b2\.user_uploaded\media_1786877866769.jpg"
out_dir = r"C:\Users\Akshat\Sync-Fit\public\images\meals"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(master_path)
w_total, h_total = img.size
print(f"Loaded master image: {w_total}x{h_total}")

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def save_crop(box, name, extra_slugs=None):
    # box is (left, top, right, bottom)
    crop = img.crop(box)
    
    # Upscale 4x with Lanczos for crystal clear display on cards
    upscaled = crop.resize((crop.width * 4, crop.height * 4), Image.Resampling.LANCZOS)
    
    primary_slug = slugify(name)
    primary_path = os.path.join(out_dir, f"{primary_slug}.jpg")
    upscaled.save(primary_path, "JPEG", quality=95)
    print(f"Saved [{name}] -> {primary_slug}.jpg ({upscaled.size})")

    if extra_slugs:
        for es in extra_slugs:
            ep = os.path.join(out_dir, f"{es}.jpg")
            upscaled.save(ep, "JPEG", quality=95)
            print(f"   alias: {es}.jpg")

# ═══════════════════════════════════════════════════════════════════════════
# 1. NON-VEG BREAKFAST (5 cols x 3 rows)
# ═══════════════════════════════════════════════════════════════════════════
nv_b_cols = [(9, 75), (79, 145), (149, 215), (219, 285), (289, 355)]

# Row 1 (y: 28 to 78)
save_crop((nv_b_cols[0][0], 28, nv_b_cols[0][1], 78), "Egg & Veggie Omelette", ["egg-veggie-omelette"])
save_crop((nv_b_cols[1][0], 28, nv_b_cols[1][1], 78), "Egg Omelette", ["egg-omelette"])
save_crop((nv_b_cols[2][0], 28, nv_b_cols[2][1], 78), "Boiled Eggs with Toast", ["boiled-eggs-with-toast", "boiled-eggs-toast"])
save_crop((nv_b_cols[3][0], 28, nv_b_cols[3][1], 78), "Boiled Eggs with Whole Wheat Toast", ["boiled-eggs-with-whole-wheat-toast"])
save_crop((nv_b_cols[4][0], 28, nv_b_cols[4][1], 78), "Boiled Eggs with Sourdough Spinach", ["boiled-eggs-with-sourdough-spinach"])

# Row 2 (y: 101 to 151)
save_crop((nv_b_cols[0][0], 101, nv_b_cols[0][1], 151), "Tuna Avocado Toast", ["tuna-avocado-toast"])
save_crop((nv_b_cols[1][0], 101, nv_b_cols[1][1], 151), "Chicken Omelette Wrap", ["chicken-omelette-wrap"])
save_crop((nv_b_cols[2][0], 101, nv_b_cols[2][1], 151), "Chicken Keema Paratha", ["chicken-keema-paratha"])
save_crop((nv_b_cols[3][0], 101, nv_b_cols[3][1], 151), "Egg Fried Rice (Breakfast)", ["egg-fried-rice-breakfast"])
save_crop((nv_b_cols[4][0], 101, nv_b_cols[4][1], 151), "Smoked Salmon Bagel", ["smoked-salmon-bagel"])

# Row 3 (y: 174 to 224)
save_crop((nv_b_cols[0][0], 174, nv_b_cols[0][1], 224), "Whey Protein Pancakes", ["whey-protein-pancakes"])
save_crop((nv_b_cols[1][0], 174, nv_b_cols[1][1], 224), "Egg White Scramble", ["egg-white-scramble"])
save_crop((nv_b_cols[2][0], 174, nv_b_cols[2][1], 224), "Chicken Sausage & Eggs", ["chicken-sausage-eggs", "chicken-sausage-and-eggs"])

# ═══════════════════════════════════════════════════════════════════════════
# 2. VEGAN BREAKFAST (5 cols x 3 rows)
# ═══════════════════════════════════════════════════════════════════════════
v_b_cols = [(9, 75), (79, 145), (149, 215), (219, 285), (289, 355)]

# Row 1 (y: 271 to 321)
save_crop((v_b_cols[0][0], 271, v_b_cols[0][1], 321), "Tofu Scramble with Spinach", ["tofu-scramble-with-spinach"])
save_crop((v_b_cols[1][0], 271, v_b_cols[1][1], 321), "Oatmeal with Banana & Walnuts", ["oatmeal-with-banana-walnuts", "oatmeal-with-banana-and-walnuts"])
save_crop((v_b_cols[2][0], 271, v_b_cols[2][1], 321), "Chia Pudding with Mixed Berries", ["chia-pudding-with-mixed-berries", "chia-pudding-with-berries"])
save_crop((v_b_cols[3][0], 271, v_b_cols[3][1], 321), "Poha", ["poha"])
save_crop((v_b_cols[4][0], 271, v_b_cols[4][1], 321), "Avocado Toast on Sourdough", ["avocado-toast-on-sourdough", "avocado-toast"])

# Row 2 (y: 344 to 394)
save_crop((v_b_cols[0][0], 344, v_b_cols[0][1], 394), "Smoothie Bowl", ["smoothie-bowl"])
save_crop((v_b_cols[1][0], 344, v_b_cols[1][1], 394), "Vegan Upma", ["vegan-upma", "upma"])
save_crop((v_b_cols[2][0], 344, v_b_cols[2][1], 394), "Peanut Butter Banana Toast", ["peanut-butter-banana-toast"])
save_crop((v_b_cols[3][0], 344, v_b_cols[3][1], 394), "Vegan Sabudana Khichdi", ["vegan-sabudana-khichdi"])
save_crop((v_b_cols[4][0], 344, v_b_cols[4][1], 394), "Overnight Oats with Flaxseed", ["overnight-oats-with-flaxseed"])

# Row 3 (y: 417 to 467)
save_crop((v_b_cols[0][0], 417, v_b_cols[0][1], 467), "Coconut Water Banana Bowl", ["coconut-water-banana-bowl", "coconut-water-and-banana-bowl"])
save_crop((v_b_cols[1][0], 417, v_b_cols[1][1], 467), "Kuttu Dosa (Vegan)", ["kuttu-dosa-vegan"])
save_crop((v_b_cols[2][0], 417, v_b_cols[2][1], 467), "Mango Chia Parfait", ["mango-chia-parfait", "mango-and-chia-parfait"])
save_crop((v_b_cols[3][0], 417, v_b_cols[3][1], 467), "Papaya Apple Bowl", ["papaya-apple-bowl", "papaya-and-apple-bowl"])
save_crop((v_b_cols[4][0], 417, v_b_cols[4][1], 467), "Sabudana Tikki (Vegan)", ["sabudana-tikki-vegan"])

# ═══════════════════════════════════════════════════════════════════════════
# 3. VEGAN LUNCH (5 cols x 3 rows)
# ═══════════════════════════════════════════════════════════════════════════
v_l_cols = [(9, 75), (79, 145), (149, 215), (219, 285), (289, 355)]

# Row 1 (y: 508 to 558)
save_crop((v_l_cols[0][0], 508, v_l_cols[0][1], 558), "Quinoa Black Bean Salad", ["quinoa-black-bean-salad"])
save_crop((v_l_cols[1][0], 508, v_l_cols[1][1], 558), "Dal Tadka with Roti", ["dal-tadka-with-roti"])
save_crop((v_l_cols[2][0], 508, v_l_cols[2][1], 558), "Vegan Chickpea Curry", ["vegan-chickpea-curry"])
save_crop((v_l_cols[3][0], 508, v_l_cols[3][1], 558), "Lentil Soup with Sourdough", ["lentil-soup-with-sourdough"])
save_crop((v_l_cols[4][0], 508, v_l_cols[4][1], 558), "Grilled Portobello Wrap", ["grilled-portobello-wrap"])

# Row 2 (y: 571 to 621)
save_crop((v_l_cols[0][0], 571, v_l_cols[0][1], 621), "Rajma Chawal", ["rajma-chawal"])
save_crop((v_l_cols[1][0], 571, v_l_cols[1][1], 621), "Mediterranean Bowl", ["mediterranean-bowl"])
save_crop((v_l_cols[2][0], 571, v_l_cols[2][1], 621), "Vegan Palak Tofu", ["vegan-palak-tofu"])
save_crop((v_l_cols[3][0], 571, v_l_cols[3][1], 621), "Veggie Stir Fry with Brown Rice", ["veggie-stir-fry-with-brown-rice"])
save_crop((v_l_cols[4][0], 571, v_l_cols[4][1], 621), "Aloo Matar", ["aloo-matar"])

# Row 3 (y: 634 to 678)
save_crop((v_l_cols[0][0], 634, v_l_cols[0][1], 678), "Raw Banana Sabzi", ["raw-banana-sabzi", "raw-banana-sabzi-vegan"])
save_crop((v_l_cols[1][0], 634, v_l_cols[1][1], 678), "Sweet Potato Peanut Curry", ["sweet-potato-peanut-curry", "sweet-potato-and-peanut-curry"])
save_crop((v_l_cols[2][0], 634, v_l_cols[2][1], 678), "Vegan Sama Rice Khichdi", ["vegan-sama-rice-khichdi"])

# ═══════════════════════════════════════════════════════════════════════════
# 4. NON-VEG LUNCH & DINNER (6 cols x 5 rows)
# ═══════════════════════════════════════════════════════════════════════════
nv_ld_cols = [(370, 436), (442, 508), (514, 580), (586, 652), (658, 724), (730, 796)]

# Row 1 (y: 28 to 78)
save_crop((nv_ld_cols[0][0], 28, nv_ld_cols[0][1], 78), "Chicken Breast with Quinoa", ["chicken-breast-with-quinoa"])
save_crop((nv_ld_cols[1][0], 28, nv_ld_cols[1][1], 78), "Grilled Chicken with Quinoa & Broccoli", ["grilled-chicken-with-quinoa-steamed-broccoli", "grilled-chicken-with-quinoa-and-broccoli"])
save_crop((nv_ld_cols[2][0], 28, nv_ld_cols[2][1], 78), "Chicken Breast Salad", ["chicken-breast-salad"])
save_crop((nv_ld_cols[3][0], 28, nv_ld_cols[3][1], 78), "Tuna Salad Wrap", ["tuna-salad-wrap"])
save_crop((nv_ld_cols[4][0], 28, nv_ld_cols[4][1], 78), "Butter Chicken with Rice", ["butter-chicken-with-rice"])
save_crop((nv_ld_cols[5][0], 28, nv_ld_cols[5][1], 78), "Butter Chicken with Basmati Rice", ["butter-chicken-with-basmati-rice"])

# Row 2 (y: 101 to 151)
save_crop((nv_ld_cols[0][0], 101, nv_ld_cols[0][1], 151), "Grilled Fish Fillet with Salad", ["grilled-fish-fillet-with-salad"])
save_crop((nv_ld_cols[1][0], 101, nv_ld_cols[1][1], 151), "Mutton Curry with Roti", ["mutton-curry-with-roti"])
save_crop((nv_ld_cols[2][0], 101, nv_ld_cols[2][1], 151), "Chicken Tikka Masala Bowl", ["chicken-tikka-masala-bowl"])
save_crop((nv_ld_cols[3][0], 101, nv_ld_cols[3][1], 151), "Prawn Fried Rice", ["prawn-fried-rice"])
save_crop((nv_ld_cols[4][0], 101, nv_ld_cols[4][1], 151), "Club Sandwich", ["club-sandwich"])
save_crop((nv_ld_cols[5][0], 101, nv_ld_cols[5][1], 151), "Keema Matar with Roti", ["keema-matar-with-roti"])

# Row 3 (y: 174 to 224)
save_crop((nv_ld_cols[0][0], 174, nv_ld_cols[0][1], 224), "Egg Curry with Rice", ["egg-curry-with-rice"])
save_crop((nv_ld_cols[1][0], 174, nv_ld_cols[1][1], 224), "Chicken Tikka", ["chicken-tikka"])
save_crop((nv_ld_cols[2][0], 174, nv_ld_cols[2][1], 224), "Chicken Tikka with Roti", ["chicken-tikka-with-roti"])
save_crop((nv_ld_cols[3][0], 174, nv_ld_cols[3][1], 224), "Grilled Salmon with Veggies", ["grilled-salmon-with-veggies"])
save_crop((nv_ld_cols[4][0], 174, nv_ld_cols[4][1], 224), "Grilled Salmon with Asparagus", ["grilled-salmon-with-asparagus"])
save_crop((nv_ld_cols[5][0], 174, nv_ld_cols[5][1], 224), "Mutton Seekh Kebab", ["mutton-seekh-kebab"])

# Row 4 (y: 247 to 297)
save_crop((nv_ld_cols[0][0], 247, nv_ld_cols[0][1], 297), "Chicken Biryani", ["chicken-biryani"])
save_crop((nv_ld_cols[1][0], 247, nv_ld_cols[1][1], 297), "Fish Curry with Rice", ["fish-curry-with-rice"])
save_crop((nv_ld_cols[2][0], 247, nv_ld_cols[2][1], 297), "Baked Herb Chicken with Potatoes", ["baked-herb-chicken-with-potatoes"])
save_crop((nv_ld_cols[3][0], 247, nv_ld_cols[3][1], 297), "Prawn Masala with Roti", ["prawn-masala-with-roti"])
save_crop((nv_ld_cols[4][0], 247, nv_ld_cols[4][1], 297), "Beef Steak with Steamed Broccoli", ["beef-steak-with-steamed-broccoli"])
save_crop((nv_ld_cols[5][0], 247, nv_ld_cols[5][1], 297), "Chicken Soup", ["chicken-soup"])

# Row 5 (y: 320 to 370)
save_crop((nv_ld_cols[0][0], 320, nv_ld_cols[0][1], 370), "Egg Fried Brown Rice", ["egg-fried-brown-rice"])
save_crop((nv_ld_cols[1][0], 320, nv_ld_cols[1][1], 370), "Egg Fried Brown Rice (Dinner)", ["egg-fried-brown-rice-dinner"])

# ═══════════════════════════════════════════════════════════════════════════
# 5. VEGAN DINNER & SNACKS (7 cols x 3 rows)
# ═══════════════════════════════════════════════════════════════════════════
v_d_cols = [(360, 408), (412, 460), (464, 512), (516, 564), (568, 616), (620, 668), (672, 720)]

# Row 1 (y: 435 to 485)
save_crop((v_d_cols[0][0], 435, v_d_cols[0][1], 485), "Sweet Potato Black Bean Enchiladas", ["sweet-potato-black-bean-enchiladas"])
save_crop((v_d_cols[1][0], 435, v_d_cols[1][1], 485), "Zucchini Noodles with Pesto", ["zucchini-noodles-with-pesto"])
save_crop((v_d_cols[2][0], 435, v_d_cols[2][1], 485), "Vegan Eggplant Bake", ["vegan-eggplant-bake"])
save_crop((v_d_cols[3][0], 435, v_d_cols[3][1], 485), "Vegan Thai Green Curry", ["vegan-thai-green-curry"])
save_crop((v_d_cols[4][0], 435, v_d_cols[4][1], 485), "Hummus with Veggie Sticks", ["hummus-with-veggie-sticks", "hummus-with-veggies"])
save_crop((v_d_cols[5][0], 435, v_d_cols[5][1], 485), "Trail Mix", ["trail-mix"])
save_crop((v_d_cols[6][0], 435, v_d_cols[6][1], 485), "Peanut Butter & Apple", ["peanut-butter-apple", "peanut-butter-and-apple"])

# Row 2 (y: 508 to 558)
save_crop((v_d_cols[0][0], 508, v_d_cols[0][1], 558), "Vegan Tofu Tikka Masala", ["vegan-tofu-tikka-masala", "tofu-tikka-masala"])
save_crop((v_d_cols[1][0], 508, v_d_cols[1][1], 558), "Vegan Buddha Bowl", ["vegan-buddha-bowl", "buddha-bowl"])
save_crop((v_d_cols[2][0], 508, v_d_cols[2][1], 558), "Aloo Gobi", ["aloo-gobi"])
save_crop((v_d_cols[3][0], 508, v_d_cols[3][1], 558), "Vegan Mushroom Risotto", ["vegan-mushroom-risotto", "mushroom-risotto"])
save_crop((v_d_cols[4][0], 508, v_d_cols[4][1], 558), "Almonds & Walnuts Mix", ["almonds-and-walnuts-mix", "handful-of-almonds-walnuts"])
save_crop((v_d_cols[5][0], 508, v_d_cols[5][1], 558), "Banana Chips Rock Salt", ["banana-chips-rock-salt"])
save_crop((v_d_cols[6][0], 508, v_d_cols[6][1], 558), "Mixed Fruit Bowl", ["mixed-fruit-bowl", "mixed-fruit-bowl-fasting"])

# Row 3 (y: 581 to 631)
save_crop((v_d_cols[0][0], 581, v_d_cols[0][1], 631), "Lauki (Bottle Gourd) Sabzi (Vegan)", ["lauki-bottle-gourd-sabzi-vegan", "lauki-bottle-gourd-sabzi", "lauki-sabzi-with-singhara-roti"])
save_crop((v_d_cols[1][0], 581, v_d_cols[1][1], 631), "Mashed Sweet Potato Bowl", ["mashed-sweet-potato-bowl", "sweet-potato-chaat", "sweet-potato-chaat-dinner", "sweet-potato-chaat-snack"])
save_crop((v_d_cols[2][0], 581, v_d_cols[2][1], 631), "Vegan Makhana Coconut Soup", ["vegan-makhana-coconut-soup", "vegan-makhana-and-coconut-soup"])
save_crop((v_d_cols[3][0], 581, v_d_cols[3][1], 631), "Dry Fig Almond Trail Mix", ["dry-fig-almond-trail-mix", "dry-fig-and-almond-trail-mix"])

# ═══════════════════════════════════════════════════════════════════════════
# 6. NON-VEG SNACKS (2 cols x 5 rows)
# ═══════════════════════════════════════════════════════════════════════════
nv_s_cols = [(821, 895), (905, 979)]

# Row 1 (y: 28 to 78)
save_crop((nv_s_cols[0][0], 28, nv_s_cols[0][1], 78), "Whey Protein Shake", ["whey-protein-shake"])
save_crop((nv_s_cols[1][0], 28, nv_s_cols[1][1], 78), "Hard Boiled Eggs", ["hard-boiled-eggs"])

# Row 2 (y: 101 to 151)
save_crop((nv_s_cols[0][0], 101, nv_s_cols[0][1], 151), "Chicken Jerky", ["chicken-jerky"])
save_crop((nv_s_cols[1][0], 101, nv_s_cols[1][1], 151), "Greek Yogurt with Berries", ["greek-yogurt-with-berries"])

# Row 3 (y: 174 to 224)
save_crop((nv_s_cols[0][0], 174, nv_s_cols[0][1], 224), "Cottage Cheese with Pineapple", ["cottage-cheese-with-pineapple", "cottage-cheese-pineapple"])
save_crop((nv_s_cols[1][0], 174, nv_s_cols[1][1], 224), "Tuna Stuffed Cucumber Bites", ["tuna-stuffed-cucumber-bites", "tuna-on-rice-crackers"])

# Row 4 (y: 247 to 297)
save_crop((nv_s_cols[0][0], 247, nv_s_cols[0][1], 297), "Almonds & Walnuts Mix Snack", ["almonds-walnuts-mix"])
save_crop((nv_s_cols[1][0], 247, nv_s_cols[1][1], 297), "Peanut Butter with Banana", ["peanut-butter-with-banana"])

# Row 5 (y: 320 to 370)
save_crop((nv_s_cols[0][0], 320, nv_s_cols[0][1], 370), "Cheese Cubes", ["cheese-cubes", "paneer-cubes-with-mint-chutney", "paneer-tikka"])
save_crop((nv_s_cols[1][0], 320, nv_s_cols[1][1], 370), "Protein Bar", ["protein-bar"])

# ═══════════════════════════════════════════════════════════════════════════
# 7. VEGETARIAN BREAKFAST & LUNCH (5 cols x 2 rows)
# ═══════════════════════════════════════════════════════════════════════════
v_bf_cols = [(710, 768), (772, 830), (834, 892), (896, 954), (958, 1016)]

# Row 1 (y: 435 to 485)
save_crop((v_bf_cols[0][0], 435, v_bf_cols[0][1], 485), "Paneer Paratha", ["paneer-paratha"])
save_crop((v_bf_cols[1][0], 435, v_bf_cols[1][1], 485), "Greek Yogurt with Honey & Walnuts", ["greek-yogurt-with-honey-walnuts", "greek-yogurt-with-honey-and-walnuts"])
save_crop((v_bf_cols[2][0], 435, v_bf_cols[2][1], 485), "Besan Chilla", ["besan-chilla"])
save_crop((v_bf_cols[3][0], 435, v_bf_cols[3][1], 485), "Idli Sambar", ["idli-sambar"])
save_crop((v_bf_cols[4][0], 435, v_bf_cols[4][1], 485), "Cheese Tomato Toast", ["cheese-tomato-toast"])

# Row 2 (y: 518 to 568)
save_crop((v_bf_cols[0][0], 518, v_bf_cols[0][1], 568), "Paneer Bhurji with Paratha", ["paneer-bhurji-with-paratha"])
save_crop((v_bf_cols[1][0], 518, v_bf_cols[1][1], 568), "Masala Dosa", ["masala-dosa"])
save_crop((v_bf_cols[2][0], 518, v_bf_cols[2][1], 568), "Moong Dal Chilla", ["moong-dal-chilla", "moong-dal-cheela"])
save_crop((v_bf_cols[3][0], 518, v_bf_cols[3][1], 568), "Banana Almond Milk Smoothie", ["banana-almond-milk-smoothie"])
save_crop((v_bf_cols[4][0], 518, v_bf_cols[4][1], 568), "Makhana Porridge", ["makhana-porridge", "makhana-kheer", "makhana-milk-with-dates", "sabudana-kheer"])

# Special: Palak Paneer with Roti (Exact mapping from Vegan Palak Tofu / Indian Curry representation)
# Save Palak Paneer with Roti explicitly:
save_crop((v_l_cols[2][0], 571, v_l_cols[2][1], 621), "Palak Paneer with Roti", ["palak-paneer-with-roti", "palak-paneer"])

print(f"\nSuccessfully cropped and generated all master reference dish assets into {out_dir}")
