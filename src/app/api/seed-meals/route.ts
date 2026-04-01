import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Meal from "@/models/Meal";

// ─── 30 VEGAN MEALS ─────────────────────────────────────────────────────────
const veganMeals = [
  // Breakfast (8)
  { name: "Oatmeal with Banana & Walnuts", dietType: "vegan", category: "breakfast", calories: 360, protein: 10, carbs: 62, fat: 10, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Rolled Oats", "Almond Milk", "Banana", "Walnuts", "Maple Syrup"], preparationSteps: ["Cook oats in almond milk.", "Top with banana and walnuts.", "Drizzle with maple syrup."] },
  { name: "Tofu Scramble with Spinach", dietType: "vegan", category: "breakfast", calories: 260, protein: 22, carbs: 8, fat: 14, tags: ["High-Protein", "Low-Carb"], type: "cutting", ingredients: ["Firm Tofu", "Spinach", "Turmeric", "Onion", "Olive Oil"], preparationSteps: ["Crumble tofu.", "Sauté onion and spinach.", "Add tofu and turmeric, cook 5 mins."] },
  { name: "Chia Pudding with Berries", dietType: "vegan", category: "breakfast", calories: 200, protein: 7, carbs: 24, fat: 9, tags: ["Keto", "Low-Carb"], type: "maintenance", ingredients: ["Chia Seeds", "Coconut Milk", "Mixed Berries", "Agave"], preparationSteps: ["Mix chia seeds and coconut milk.", "Refrigerate overnight.", "Top with berries."] },
  { name: "Poha", dietType: "vegan", category: "breakfast", calories: 290, protein: 5, carbs: 56, fat: 6, tags: ["Balanced Diet"], type: "cutting", ingredients: ["Flattened Rice", "Peanuts", "Onion", "Turmeric", "Mustard Seeds", "Vegetable Oil"], preparationSteps: ["Wash and drain poha.", "Sauté mustard seeds, onion, peanuts.", "Mix in poha and turmeric."] },
  { name: "Avocado Toast on Sourdough", dietType: "vegan", category: "breakfast", calories: 380, protein: 9, carbs: 40, fat: 20, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Sourdough Bread", "Avocado", "Lemon Juice", "Chili Flakes", "Salt"], preparationSteps: ["Toast sourdough.", "Mash avocado with lemon and seasoning.", "Spread on toast."] },
  { name: "Smoothie Bowl", dietType: "vegan", category: "breakfast", calories: 320, protein: 8, carbs: 60, fat: 6, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Frozen Banana", "Mango", "Almond Milk", "Granola", "Coconut Flakes"], preparationSteps: ["Blend banana and mango with almond milk.", "Pour into bowl.", "Top with granola and coconut."] },
  { name: "Vegan Upma", dietType: "vegan", category: "breakfast", calories: 310, protein: 7, carbs: 52, fat: 8, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Semolina", "Vegetables", "Mustard Seeds", "Curry Leaves", "Coconut Oil"], preparationSteps: ["Roast semolina dry.", "Sauté seeds and veggies in oil.", "Add water and semolina, stir until cooked."] },
  { name: "Peanut Butter Banana Toast", dietType: "vegan", category: "breakfast", calories: 420, protein: 14, carbs: 52, fat: 18, tags: ["High-Protein", "Balanced Diet"], type: "bulking", ingredients: ["Whole Wheat Bread", "Peanut Butter", "Banana"], preparationSteps: ["Toast bread.", "Spread peanut butter.", "Top with sliced banana."] },

  // Lunch (9)
  { name: "Quinoa & Black Bean Salad", dietType: "vegan", category: "lunch", calories: 405, protein: 15, carbs: 58, fat: 12, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Quinoa", "Black Beans", "Corn", "Bell Pepper", "Lime Juice", "Cilantro"], preparationSteps: ["Cook quinoa.", "Mix with rinsed beans, corn, peppers.", "Dress with lime juice."] },
  { name: "Dal Tadka with Roti", dietType: "vegan", category: "lunch", calories: 455, protein: 18, carbs: 68, fat: 10, tags: ["High-Protein", "Balanced Diet"], type: "bulking", ingredients: ["Yellow Lentils", "Wheat Flour", "Tomato", "Garlic", "Coconut Oil"], preparationSteps: ["Boil lentils.", "Prepare tadka with garlic and tomato.", "Serve with roti."] },
  { name: "Vegan Chickpea Curry", dietType: "vegan", category: "lunch", calories: 385, protein: 16, carbs: 52, fat: 12, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Chickpeas", "Tomato", "Onion", "Garam Masala", "Coconut Milk"], preparationSteps: ["Sauté onions till golden.", "Add tomato and spices.", "Add chickpeas and coconut milk, simmer 15 mins."] },
  { name: "Lentil Soup with Sourdough", dietType: "vegan", category: "lunch", calories: 360, protein: 18, carbs: 55, fat: 5, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Brown Lentils", "Carrots", "Celery", "Vegetable Broth", "Sourdough"], preparationSteps: ["Simmer lentils with carrots and celery in broth.", "Serve hot with sourdough."] },
  { name: "Grilled Portobello Wrap", dietType: "vegan", category: "lunch", calories: 305, protein: 9, carbs: 42, fat: 11, tags: ["Low-Carb"], type: "cutting", ingredients: ["Portobello Mushroom", "Whole Wheat Wrap", "Hummus", "Spinach", "Tomato"], preparationSteps: ["Grill mushroom.", "Spread hummus on wrap.", "Add mushroom, spinach, tomato and roll."] },
  { name: "Rajma Chawal", dietType: "vegan", category: "lunch", calories: 510, protein: 20, carbs: 85, fat: 8, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Kidney Beans", "Basmati Rice", "Tomato", "Onion", "Spices"], preparationSteps: ["Cook kidney beans.", "Prepare tomato-onion masala.", "Serve with steamed rice."] },
  { name: "Mediterranean Bowl", dietType: "vegan", category: "lunch", calories: 420, protein: 14, carbs: 58, fat: 15, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Falafel", "Quinoa", "Hummus", "Cherry Tomatoes", "Cucumber", "Olive Oil"], preparationSteps: ["Cook quinoa.", "Arrange with falafel, hummus, and veggies.", "Drizzle with olive oil."] },
  { name: "Vegan Palak Tofu", dietType: "vegan", category: "lunch", calories: 325, protein: 22, carbs: 15, fat: 18, tags: ["High-Protein", "Keto", "Low-Carb"], type: "cutting", ingredients: ["Spinach", "Firm Tofu", "Onion", "Garlic", "Coconut Milk", "Spices"], preparationSteps: ["Blanch and purée spinach.", "Sauté garlic and onion.", "Add purée, spices, coconut milk, and tofu cubes."] },
  { name: "Veggie Stir-fry with Brown Rice", dietType: "vegan", category: "lunch", calories: 385, protein: 11, carbs: 66, fat: 8, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Broccoli", "Bell Peppers", "Soy Sauce", "Sesame Oil", "Brown Rice"], preparationSteps: ["Cook brown rice.", "Stir-fry vegetables in sesame oil with soy sauce.", "Serve over rice."] },

  // Dinner (9)
  { name: "Sweet Potato & Black Bean Enchiladas", dietType: "vegan", category: "dinner", calories: 425, protein: 14, carbs: 72, fat: 10, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Sweet Potato", "Black Beans", "Enchilada Sauce", "Corn Tortillas"], preparationSteps: ["Roast sweet potatoes.", "Mash with black beans.", "Fill tortillas, top with sauce, bake."] },
  { name: "Zucchini Noodles with Pesto", dietType: "vegan", category: "dinner", calories: 255, protein: 7, carbs: 14, fat: 20, tags: ["Low-Carb", "Keto"], type: "cutting", ingredients: ["Zucchini", "Basil", "Pine Nuts", "Olive Oil", "Nutritional Yeast"], preparationSteps: ["Spiralise zucchini.", "Blend pesto.", "Toss noodles with pesto."] },
  { name: "Vegan Eggplant Bake", dietType: "vegan", category: "dinner", calories: 350, protein: 10, carbs: 48, fat: 14, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Eggplant", "Marinara Sauce", "Almond Flour", "Vegan Parmesan"], preparationSteps: ["Slice eggplant and coat in almond flour.", "Bake until crispy.", "Layer with marinara and parmesan, bake again."] },
  { name: "Vegan Thai Green Curry", dietType: "vegan", category: "dinner", calories: 430, protein: 12, carbs: 55, fat: 18, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Coconut Milk", "Green Curry Paste", "Tofu", "Broccoli", "Jasmine Rice"], preparationSteps: ["Simmer curry paste in coconut milk.", "Add tofu and broccoli.", "Serve over jasmine rice."] },
  { name: "Mujaddara (Lentil & Rice)", dietType: "vegan", category: "dinner", calories: 400, protein: 16, carbs: 68, fat: 8, tags: ["Balanced Diet", "High-Protein"], type: "maintenance", ingredients: ["Green Lentils", "Basmati Rice", "Crispy Onions", "Cumin", "Olive Oil"], preparationSteps: ["Cook lentils and rice.", "Fry onions until crispy.", "Layer together with spices."] },
  { name: "Vegan Tofu Tikka Masala", dietType: "vegan", category: "dinner", calories: 395, protein: 20, carbs: 38, fat: 16, tags: ["High-Protein"], type: "maintenance", ingredients: ["Tofu", "Tomato Purée", "Coconut Cream", "Tikka Masala Spices", "Basmati Rice"], preparationSteps: ["Marinate and grill tofu.", "Simmer in spiced tomato-coconut sauce.", "Serve with rice."] },
  { name: "Vegan Buddha Bowl", dietType: "vegan", category: "dinner", calories: 460, protein: 18, carbs: 62, fat: 16, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Quinoa", "Roasted Chickpeas", "Avocado", "Sweet Potato", "Tahini"], preparationSteps: ["Cook quinoa and roast chickpeas and sweet potato.", "Slice avocado.", "Assemble bowl and drizzle with tahini."] },
  { name: "Aloo Gobi", dietType: "vegan", category: "dinner", calories: 280, protein: 7, carbs: 44, fat: 9, tags: ["Balanced Diet"], type: "cutting", ingredients: ["Potato", "Cauliflower", "Tomato", "Cumin", "Turmeric", "Coriander"], preparationSteps: ["Dice potatoes and cauliflower.", "Sauté with spices and tomato.", "Cook until tender."] },
  { name: "Vegan Mushroom Risotto", dietType: "vegan", category: "dinner", calories: 440, protein: 10, carbs: 70, fat: 12, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Arborio Rice", "Mushrooms", "Vegetable Broth", "Nutritional Yeast", "Olive Oil"], preparationSteps: ["Sauté mushrooms.", "Add rice and gradually add broth, stirring.", "Finish with nutritional yeast."] },

  // Snacks (4)
  { name: "Hummus with Veggie Sticks", dietType: "vegan", category: "snack", calories: 160, protein: 6, carbs: 16, fat: 8, tags: ["Low-Carb", "Balanced Diet"], type: "maintenance", ingredients: ["Hummus", "Cucumber", "Carrot", "Bell Pepper"], preparationSteps: ["Slice vegetables.", "Serve with hummus."] },
  { name: "Trail Mix", dietType: "vegan", category: "snack", calories: 220, protein: 6, carbs: 22, fat: 14, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Almonds", "Cashews", "Raisins", "Dark Chocolate Chips", "Pumpkin Seeds"], preparationSteps: ["Mix all ingredients.", "Portion into serving."] },
  { name: "Peanut Butter & Apple", dietType: "vegan", category: "snack", calories: 240, protein: 8, carbs: 28, fat: 12, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Apple", "Natural Peanut Butter"], preparationSteps: ["Slice apple.", "Dip in peanut butter."] },
  { name: "Roasted Chickpeas", dietType: "vegan", category: "snack", calories: 180, protein: 9, carbs: 24, fat: 5, tags: ["High-Protein", "Low-Carb"], type: "cutting", ingredients: ["Chickpeas", "Olive Oil", "Paprika", "Salt"], preparationSteps: ["Drain chickpeas.", "Toss with oil and spices.", "Roast at 200°C for 25 mins."] },
];

// ─── 20 VEGETARIAN MEALS ─────────────────────────────────────────────────────
const vegetarianMeals = [
  { name: "Paneer Paratha", dietType: "vegetarian", category: "breakfast", calories: 410, protein: 18, carbs: 46, fat: 16, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Wheat Flour", "Paneer", "Ghee", "Spices"], preparationSteps: ["Grate paneer and mix with spices.", "Stuff into wheat dough.", "Cook on tawa with ghee."] },
  { name: "Greek Yogurt with Honey & Walnuts", dietType: "vegetarian", category: "breakfast", calories: 285, protein: 20, carbs: 22, fat: 14, tags: ["High-Protein", "Keto"], type: "cutting", ingredients: ["Greek Yogurt", "Honey", "Walnuts"], preparationSteps: ["Serve yogurt.", "Drizzle honey.", "Top with walnuts."] },
  { name: "Vegetarian Omelette", dietType: "vegetarian", category: "breakfast", calories: 325, protein: 22, carbs: 6, fat: 22, tags: ["High-Protein", "Keto", "Low-Carb"], type: "cutting", ingredients: ["Eggs", "Cheese", "Spinach", "Tomatoes", "Butter"], preparationSteps: ["Whisk eggs.", "Cook in butter with fillings.", "Fold and serve."] },
  { name: "Idli Sambar", dietType: "vegetarian", category: "breakfast", calories: 355, protein: 12, carbs: 66, fat: 4, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Rice", "Urad Dal", "Toor Dal", "Vegetables", "Tamarind"], preparationSteps: ["Steam idli batter.", "Cook sambar.", "Serve together."] },
  { name: "Cheese Tomato Toast", dietType: "vegetarian", category: "breakfast", calories: 425, protein: 16, carbs: 46, fat: 18, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Whole Wheat Bread", "Cheddar Cheese", "Tomatoes", "Butter"], preparationSteps: ["Butter bread.", "Add cheese and tomato.", "Grill until melted."] },
  { name: "Palak Paneer with Roti", dietType: "vegetarian", category: "lunch", calories: 455, protein: 22, carbs: 46, fat: 20, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Spinach", "Paneer", "Garlic", "Spices", "Wheat Flour", "Ghee"], preparationSteps: ["Purée blanched spinach.", "Cook with spices and paneer.", "Serve with roti."] },
  { name: "Vegetable Biryani with Raita", dietType: "vegetarian", category: "lunch", calories: 555, protein: 14, carbs: 82, fat: 18, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Basmati Rice", "Mixed Vegetables", "Yogurt", "Spices", "Ghee"], preparationSteps: ["Cook rice with spices and vegetables.", "Serve with raita."] },
  { name: "Caprese Salad", dietType: "vegetarian", category: "lunch", calories: 305, protein: 18, carbs: 8, fat: 22, tags: ["Keto", "Low-Carb"], type: "cutting", ingredients: ["Mozzarella", "Tomatoes", "Basil", "Balsamic", "Olive Oil"], preparationSteps: ["Layer mozzarella and tomatoes.", "Tuck basil leaves.", "Drizzle oil and balsamic."] },
  { name: "Mushroom Risotto", dietType: "vegetarian", category: "lunch", calories: 505, protein: 14, carbs: 70, fat: 18, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Arborio Rice", "Mushrooms", "Parmesan", "Vegetable Broth", "Butter"], preparationSteps: ["Sauté mushrooms.", "Gradually add broth to rice.", "Finish with butter and parmesan."] },
  { name: "Veggie Black Bean Burger", dietType: "vegetarian", category: "lunch", calories: 485, protein: 20, carbs: 62, fat: 15, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Black Bean Patty", "Whole Wheat Bun", "Cheese", "Lettuce", "Tomato"], preparationSteps: ["Grill patty.", "Assemble with bun and toppings."] },
  { name: "Vegetable Korma with Naan", dietType: "vegetarian", category: "dinner", calories: 605, protein: 16, carbs: 86, fat: 22, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Mixed Vegetables", "Cream", "Cashews", "Naan", "Spices"], preparationSteps: ["Cook vegetables in creamy cashew gravy.", "Serve with naan."] },
  { name: "Stuffed Bell Peppers", dietType: "vegetarian", category: "dinner", calories: 355, protein: 18, carbs: 46, fat: 12, tags: ["Balanced Diet", "High-Protein"], type: "maintenance", ingredients: ["Bell Peppers", "Quinoa", "Black Beans", "Cheddar Cheese", "Tomato Sauce"], preparationSteps: ["Halve and deseed peppers.", "Stuff with quinoa mix.", "Top with cheese and bake."] },
  { name: "Cauliflower Crust Pizza", dietType: "vegetarian", category: "dinner", calories: 325, protein: 22, carbs: 16, fat: 20, tags: ["Keto", "Low-Carb"], type: "cutting", ingredients: ["Cauliflower", "Eggs", "Mozzarella", "Tomato Sauce", "Vegetables"], preparationSteps: ["Bake cauliflower crust.", "Add toppings.", "Bake until cheese melts."] },
  { name: "Malai Kofta", dietType: "vegetarian", category: "dinner", calories: 555, protein: 14, carbs: 62, fat: 28, tags: ["Balanced Diet"], type: "bulking", ingredients: ["Paneer", "Potatoes", "Cream", "Cashews", "Spices"], preparationSteps: ["Make koftas, fry.", "Simmer in creamy tomato gravy."] },
  { name: "Vegetarian Pad Thai", dietType: "vegetarian", category: "dinner", calories: 455, protein: 16, carbs: 66, fat: 14, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Rice Noodles", "Eggs", "Peanuts", "Bean Sprouts", "Tamarind Sauce"], preparationSteps: ["Stir-fry noodles with sauce.", "Scramble eggs.", "Mix in sprouts and peanuts."] },
  { name: "Paneer Tikka", dietType: "vegetarian", category: "dinner", calories: 380, protein: 28, carbs: 10, fat: 26, tags: ["High-Protein", "Keto"], type: "cutting", ingredients: ["Paneer", "Yogurt", "Spices", "Bell Peppers", "Onion"], preparationSteps: ["Marinate paneer in spiced yogurt.", "Grill on skewers with vegetables."] },
  { name: "Egg Bhurji with Paratha", dietType: "vegetarian", category: "breakfast", calories: 440, protein: 20, carbs: 44, fat: 20, tags: ["High-Protein", "Balanced Diet"], type: "bulking", ingredients: ["Eggs", "Onion", "Tomato", "Spices", "Whole Wheat Paratha", "Ghee"], preparationSteps: ["Scramble eggs with onion, tomato, spices.", "Serve with hot paratha."] },
  { name: "Fruit & Nut Yogurt Bowl", dietType: "vegetarian", category: "snack", calories: 220, protein: 12, carbs: 28, fat: 8, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Greek Yogurt", "Mixed Fruits", "Almonds", "Honey"], preparationSteps: ["Layer yogurt with fruits.", "Top with almonds.", "Drizzle honey."] },
  { name: "Cheese & Vegetable Quesadilla", dietType: "vegetarian", category: "snack", calories: 340, protein: 14, carbs: 36, fat: 16, tags: ["Balanced Diet", "High-Protein"], type: "maintenance", ingredients: ["Flour Tortilla", "Cheddar Cheese", "Bell Peppers", "Onion"], preparationSteps: ["Fill tortilla with cheese and vegetables.", "Cook on tawa until golden."] },
  { name: "Mozzarella Sticks with Salsa", dietType: "vegetarian", category: "snack", calories: 260, protein: 14, carbs: 20, fat: 14, tags: ["High-Protein"], type: "maintenance", ingredients: ["Mozzarella", "Breadcrumbs", "Egg", "Tomato Salsa"], preparationSteps: ["Coat mozzarella in egg and breadcrumbs.", "Bake until golden.", "Serve with salsa."] },
];

// ─── 8 NON-VEGETARIAN MEALS ──────────────────────────────────────────────────
const nonVegMeals = [
  { name: "Chicken Breast with Quinoa", dietType: "non-vegetarian", category: "lunch", calories: 480, protein: 45, carbs: 42, fat: 10, tags: ["High-Protein", "Balanced Diet"], type: "bulking", ingredients: ["Chicken Breast", "Quinoa", "Olive Oil", "Garlic", "Herbs"], preparationSteps: ["Season and grill chicken.", "Cook quinoa.", "Serve together."] },
  { name: "Egg & Veggie Omelette", dietType: "non-vegetarian", category: "breakfast", calories: 340, protein: 24, carbs: 6, fat: 24, tags: ["High-Protein", "Keto", "Low-Carb"], type: "cutting", ingredients: ["Eggs", "Spinach", "Mushrooms", "Tomatoes", "Olive Oil"], preparationSteps: ["Whisk eggs.", "Cook with vegetables.", "Fold and serve."] },
  { name: "Chicken Tikka", dietType: "non-vegetarian", category: "dinner", calories: 380, protein: 42, carbs: 8, fat: 18, tags: ["High-Protein", "Low-Carb"], type: "cutting", ingredients: ["Chicken", "Yogurt", "Spices", "Lemon"], preparationSteps: ["Marinate chicken.", "Grill until charred."] },
  { name: "Tuna Salad Wrap", dietType: "non-vegetarian", category: "lunch", calories: 380, protein: 32, carbs: 36, fat: 10, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Canned Tuna", "Whole Wheat Wrap", "Lettuce", "Tomato", "Mayo"], preparationSteps: ["Mix tuna with mayo.", "Wrap with vegetables."] },
  { name: "Boiled Eggs with Toast", dietType: "non-vegetarian", category: "breakfast", calories: 320, protein: 18, carbs: 32, fat: 12, tags: ["High-Protein", "Balanced Diet"], type: "maintenance", ingredients: ["Eggs", "Whole Wheat Bread", "Butter"], preparationSteps: ["Boil eggs to preference.", "Toast bread.", "Serve together."] },
  { name: "Grilled Salmon with Veggies", dietType: "non-vegetarian", category: "dinner", calories: 420, protein: 40, carbs: 16, fat: 22, tags: ["High-Protein", "Low-Carb", "Keto"], type: "cutting", ingredients: ["Salmon", "Asparagus", "Lemon", "Olive Oil", "Garlic"], preparationSteps: ["Season salmon.", "Grill with asparagus.", "Serve with lemon wedge."] },
  { name: "Egg Fried Brown Rice", dietType: "non-vegetarian", category: "dinner", calories: 455, protein: 20, carbs: 60, fat: 14, tags: ["Balanced Diet"], type: "maintenance", ingredients: ["Brown Rice", "Eggs", "Soy Sauce", "Spring Onions", "Sesame Oil"], preparationSteps: ["Cook rice.", "Scramble eggs in wok.", "Add rice and soy sauce."] },
  { name: "Whey Protein Shake", dietType: "non-vegetarian", category: "snack", calories: 200, protein: 30, carbs: 10, fat: 4, tags: ["High-Protein"], type: "bulking", ingredients: ["Whey Protein", "Almond Milk", "Banana"], preparationSteps: ["Blend all ingredients.", "Serve cold."] },
];

// ─── 12 FASTING MEALS ────────────────────────────────────────────────────────
const fastingMeals = [
  { name: "Sabudana Khichdi", dietType: "vegetarian", category: "breakfast", calories: 320, protein: 5, carbs: 64, fat: 8, tags: ["Fasting", "Gluten-Free"], type: "maintenance", ingredients: ["Sabudana", "Peanuts", "Green Chilies", "Cumin", "Ghee"], preparationSteps: ["Soak sabudana overnight.", "Sauté cumin, chilies in ghee.", "Add peanuts and sabudana, cook till translucent."] },
  { name: "Sabudana Kheer", dietType: "vegetarian", category: "breakfast", calories: 325, protein: 7, carbs: 60, fat: 8, tags: ["Fasting"], type: "maintenance", ingredients: ["Sabudana", "Milk", "Sugar", "Cardamom", "Saffron"], preparationSteps: ["Soak sabudana 2 hrs.", "Boil milk, add sabudana.", "Add sugar and cardamom, cook thick."] },
  { name: "Vrat ke Aloo", dietType: "vegetarian", category: "lunch", calories: 290, protein: 5, carbs: 50, fat: 9, tags: ["Fasting"], type: "maintenance", ingredients: ["Potatoes", "Rock Salt", "Cumin", "Coriander", "Ghee"], preparationSteps: ["Boil and dice potatoes.", "Sauté with cumin in ghee.", "Season with rock salt and coriander."] },
  { name: "Makhana Curry", dietType: "vegetarian", category: "lunch", calories: 325, protein: 9, carbs: 32, fat: 18, tags: ["Fasting"], type: "maintenance", ingredients: ["Fox Nuts (Makhana)", "Yogurt", "Rock Salt", "Spices", "Ghee"], preparationSteps: ["Roast makhana in ghee.", "Prepare yogurt gravy.", "Simmer makhana in gravy 10 mins."] },
  { name: "Kuttu Puri with Aloo Sabzi", dietType: "vegetarian", category: "dinner", calories: 525, protein: 9, carbs: 76, fat: 20, tags: ["Fasting"], type: "maintenance", ingredients: ["Buckwheat Flour", "Potatoes", "Rock Salt", "Ghee", "Cumin"], preparationSteps: ["Make dough with buckwheat flour.", "Deep-fry puris.", "Prepare potato sabzi with rock salt."] },
  { name: "Singhare ki Puri", dietType: "vegetarian", category: "breakfast", calories: 355, protein: 6, carbs: 52, fat: 14, tags: ["Fasting"], type: "maintenance", ingredients: ["Water Chestnut Flour", "Potato", "Rock Salt", "Ghee"], preparationSteps: ["Knead flour with potato and salt.", "Roll and fry in ghee."] },
  { name: "Makhana Kheer", dietType: "vegetarian", category: "dinner", calories: 310, protein: 8, carbs: 46, fat: 10, tags: ["Fasting"], type: "maintenance", ingredients: ["Fox Nuts", "Milk", "Sugar", "Cardamom", "Saffron"], preparationSteps: ["Simmer milk until thick.", "Add roasted makhana.", "Add sugar and cardamom."] },
  { name: "Vrat Dhokla", dietType: "vegetarian", category: "snack", calories: 200, protein: 6, carbs: 36, fat: 4, tags: ["Fasting", "Gluten-Free"], type: "cutting", ingredients: ["Sama Rice", "Yogurt", "Rock Salt", "Cumin Seeds"], preparationSteps: ["Soak and grind sama rice with yogurt.", "Steam in dhokla vessel.", "Temper with cumin."] },
  { name: "Sweet Potato Chaat", dietType: "vegan", category: "snack", calories: 215, protein: 4, carbs: 46, fat: 2, tags: ["Fasting", "Gluten-Free"], type: "cutting", ingredients: ["Sweet Potato", "Rock Salt", "Cumin", "Lemon Juice", "Coriander"], preparationSteps: ["Boil and dice sweet potato.", "Toss with spices and lemon."] },
  { name: "Rajgira Ladoo", dietType: "vegetarian", category: "snack", calories: 240, protein: 5, carbs: 38, fat: 9, tags: ["Fasting"], type: "maintenance", ingredients: ["Amaranth", "Jaggery", "Ghee", "Cardamom"], preparationSteps: ["Pop amaranth.", "Mix with melted jaggery and ghee.", "Shape into balls."] },
  { name: "Sama Rice Pulao", dietType: "vegetarian", category: "lunch", calories: 380, protein: 6, carbs: 70, fat: 8, tags: ["Fasting"], type: "maintenance", ingredients: ["Sama Rice", "Potatoes", "Peanuts", "Ghee", "Rock Salt", "Cumin"], preparationSteps: ["Roast sama rice.", "Add potatoes and spices.", "Cook with water."] },
  { name: "Dahi Aloo", dietType: "vegetarian", category: "dinner", calories: 310, protein: 8, carbs: 50, fat: 8, tags: ["Fasting"], type: "maintenance", ingredients: ["Potatoes", "Yogurt", "Rock Salt", "Coriander", "Ghee"], preparationSteps: ["Boil and dice potatoes.", "Mix with beaten yogurt.", "Temper with cumin in ghee."] },
];

export async function GET() {
  try {
    await connectToDatabase();

    const allMeals = [...veganMeals, ...vegetarianMeals, ...nonVegMeals, ...fastingMeals];

    // Upsert by name — safe to run multiple times without duplicates
    let inserted = 0, skipped = 0;
    for (const meal of allMeals) {
      const exists = await Meal.findOne({ name: meal.name }).lean();
      if (exists) { skipped++; continue; }
      await Meal.create(meal);
      inserted++;
    }

    const counts = {
      total: allMeals.length,
      inserted,
      skipped,
      byDiet: {
        vegan: veganMeals.length,
        vegetarian: vegetarianMeals.length,
        "non-vegetarian": nonVegMeals.length,
        fasting: fastingMeals.length,
      },
      byCategory: {
        breakfast: allMeals.filter((m) => m.category === "breakfast").length,
        lunch:     allMeals.filter((m) => m.category === "lunch").length,
        dinner:    allMeals.filter((m) => m.category === "dinner").length,
        snack:     allMeals.filter((m) => m.category === "snack").length,
      },
    };

    console.log("[seed-meals] Result:", counts);

    return NextResponse.json({
      success: true,
      message: `✅ Inserted ${inserted} new meals. Skipped ${skipped} duplicates.`,
      breakdown: counts,
    });
  } catch (err: any) {
    console.error("[seed-meals] Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
