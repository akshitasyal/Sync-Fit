import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Meal from "@/models/Meal";

const generateMeals = () => {
  const m = [];
  
  // BREAKFAST
  m.push({ name: "Vegan Tofu Scramble", type: "cutting", dietType: ["Vegan", "Vegetarian", "High-Protein"], category: "breakfast", calories: 300, protein: 22, carbs: 15, fat: 12, ingredients: ["Tofu", "Spinach", "Turmeric", "Nutritional Yeast"], preparationSteps: ["Crumble tofu", "Sauté with spinach", "Add turmeric to color"] });
  m.push({ name: "Keto Bacon & Egg Cups", type: "maintenance", dietType: ["Keto", "High-Protein", "Non-Vegetarian", "Low-Carb"], category: "breakfast", calories: 450, protein: 28, carbs: 2, fat: 35, ingredients: ["Bacon", "Eggs", "Cheese"], preparationSteps: ["Line muffin tin with bacon", "Crack egg inside", "Bake at 375F"] });
  m.push({ name: "Protein Oatmeal Bowl", type: "bulking", dietType: ["Vegetarian", "Balanced Diet"], category: "breakfast", calories: 550, protein: 30, carbs: 70, fat: 15, ingredients: ["Oats", "Whey Protein", "Peanut Butter", "Banana"], preparationSteps: ["Boil oats", "Stir in whey and pb", "Top with banana"] });
  m.push({ name: "Greek Yogurt Parfait", type: "cutting", dietType: ["Vegetarian", "Low-Carb"], category: "breakfast", calories: 250, protein: 20, carbs: 25, fat: 5, ingredients: ["Greek Yogurt", "Berries", "Almonds"], preparationSteps: ["Layer yogurt", "Add berries", "Top with almonds"] });
  m.push({ name: "Avocado Toast with Egg", type: "maintenance", dietType: ["Vegetarian", "Balanced Diet"], category: "breakfast", calories: 400, protein: 18, carbs: 35, fat: 22, ingredients: ["Sourdough", "Avocado", "Egg"], preparationSteps: ["Toast bread", "Mash avocado", "Top with fried egg"] });
  m.push({ name: "Mass Gainer Pancakes", type: "bulking", dietType: ["Vegetarian"], category: "breakfast", calories: 800, protein: 40, carbs: 100, fat: 25, ingredients: ["Pancake Mix", "Whole Milk", "Eggs", "Syrup"], preparationSteps: ["Mix batter", "Cook on griddle", "Drown in syrup"] });
  m.push({ name: "Smoked Salmon Bagel", type: "bulking", dietType: ["Non-Vegetarian", "Balanced Diet"], category: "breakfast", calories: 600, protein: 35, carbs: 55, fat: 25, ingredients: ["Bagel", "Cream Cheese", "Smoked Salmon", "Capers"], preparationSteps: ["Toast bagel", "Spread cheese", "Add salmon"] });
  m.push({ name: "Keto Chaffle", type: "cutting", dietType: ["Keto", "Low-Carb", "Vegetarian"], category: "breakfast", calories: 350, protein: 20, carbs: 4, fat: 28, ingredients: ["Eggs", "Cheese", "Almond Flour"], preparationSteps: ["Mix ingredients", "Cook in waffle iron"] });
  m.push({ name: "Vegan Protein Smoothie", type: "maintenance", dietType: ["Vegan", "Vegetarian"], category: "breakfast", calories: 400, protein: 25, carbs: 50, fat: 10, ingredients: ["Soy Milk", "Pea Protein", "Banana", "Chia Seeds"], preparationSteps: ["Blend until smooth"] });
  m.push({ name: "Steak and Eggs", type: "bulking", dietType: ["Non-Vegetarian", "High-Protein", "Keto"], category: "breakfast", calories: 750, protein: 55, carbs: 5, fat: 55, ingredients: ["Sirloin", "Eggs", "Butter"], preparationSteps: ["Sear steak", "Fry eggs in butter"] });

  // LUNCH
  m.push({ name: "Grilled Chicken Salad", type: "cutting", dietType: ["Non-Vegetarian", "High-Protein", "Low-Carb"], category: "lunch", calories: 350, protein: 45, carbs: 10, fat: 15, ingredients: ["Chicken Breast", "Mixed Greens", "Balsamic"], preparationSteps: ["Grill chicken", "Toss salad", "Serve cold"] });
  m.push({ name: "Quinoa Bowl with Tofu", type: "maintenance", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "lunch", calories: 500, protein: 20, carbs: 65, fat: 15, ingredients: ["Quinoa", "Firm Tofu", "Broccoli", "Soy Sauce"], preparationSteps: ["Bake tofu", "Cook quinoa", "Combine with broccoli"] });
  m.push({ name: "Beef & Rice Meal Prep", type: "bulking", dietType: ["Non-Vegetarian", "High-Protein"], category: "lunch", calories: 850, protein: 55, carbs: 90, fat: 30, ingredients: ["Ground Beef", "White Rice", "Peas"], preparationSteps: ["Brown beef", "Cook rice", "Mix in peas"] });
  m.push({ name: "Keto Cobb Salad", type: "maintenance", dietType: ["Keto", "High-Protein", "Low-Carb"], category: "lunch", calories: 600, protein: 40, carbs: 8, fat: 45, ingredients: ["Lettuce", "Bacon", "Hard-boiled Egg", "Blue Cheese"], preparationSteps: ["Chop lettuce", "Add toppings", "Dress heavily"] });
  m.push({ name: "Turkey Wraps", type: "cutting", dietType: ["Non-Vegetarian", "Balanced Diet"], category: "lunch", calories: 400, protein: 35, carbs: 40, fat: 12, ingredients: ["Whole Wheat Tortilla", "Turkey Slices", "Avocado", "Spinach"], preparationSteps: ["Lay flat", "Add ingredients", "Roll tight"] });
  m.push({ name: "Vegan Chickpea Curry", type: "maintenance", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "lunch", calories: 550, protein: 18, carbs: 75, fat: 18, ingredients: ["Chickpeas", "Coconut Milk", "Curry Powder", "Rice"], preparationSteps: ["Simmer chickpeas", "Add coconut milk", "Serve over rice"] });
  m.push({ name: "Pulled Pork Sandwich", type: "bulking", dietType: ["Non-Vegetarian"], category: "lunch", calories: 900, protein: 50, carbs: 85, fat: 40, ingredients: ["Pork Shoulder", "Brioche Bun", "BBQ Sauce", "Coleslaw"], preparationSteps: ["Slow cook pork", "Shred and mix with sauce", "Serve on bun"] });
  m.push({ name: "Tuna Salad Stuffed Avocados", type: "cutting", dietType: ["Non-Vegetarian", "Keto", "Low-Carb"], category: "lunch", calories: 450, protein: 35, carbs: 8, fat: 30, ingredients: ["Tuna", "Avocado", "Mayo"], preparationSteps: ["Mix tuna with mayo", "Stuff into halved avocado"] });
  m.push({ name: "Black Bean Vegan Burger", type: "maintenance", dietType: ["Vegan", "Vegetarian"], category: "lunch", calories: 500, protein: 20, carbs: 60, fat: 20, ingredients: ["Black Bean Patty", "Whole Wheat Bun", "Lettuce", "Tomato"], preparationSteps: ["Grill patty", "Assemble burger"] });
  m.push({ name: "Chicken Teriyaki Bowl", type: "bulking", dietType: ["Non-Vegetarian", "Balanced Diet"], category: "lunch", calories: 800, protein: 50, carbs: 100, fat: 20, ingredients: ["Chicken Thighs", "Jasmine Rice", "Teriyaki Sauce"], preparationSteps: ["Grill chicken", "Glaze with sauce", "Serve over rice"] });
  m.push({ name: "Keto Shrimp Scampi", type: "maintenance", dietType: ["Non-Vegetarian", "Keto", "Low-Carb"], category: "lunch", calories: 550, protein: 35, carbs: 5, fat: 42, ingredients: ["Shrimp", "Butter", "Garlic", "Zucchini Noodles"], preparationSteps: ["Sauté shrimp in butter", "Toss with noodles"] });

  // DINNER
  m.push({ name: "Baked Salmon & Asparagus", type: "maintenance", dietType: ["Non-Vegetarian", "Low-Carb", "Keto", "High-Protein"], category: "dinner", calories: 500, protein: 42, carbs: 8, fat: 30, ingredients: ["Salmon", "Asparagus", "Lemon", "Olive Oil"], preparationSteps: ["Oil asparagus", "Place salmon", "Bake 400F for 15m"] });
  m.push({ name: "Zucchini Noodles w/ Meatballs", type: "cutting", dietType: ["Non-Vegetarian", "Low-Carb", "Keto"], category: "dinner", calories: 450, protein: 35, carbs: 12, fat: 28, ingredients: ["Zucchini", "Ground Turkey", "Marinara"], preparationSteps: ["Spiralize zucchini", "Sear meatballs", "Simmer in sauce"] });
  m.push({ name: "Lentil Shepherd's Pie", type: "maintenance", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "dinner", calories: 550, protein: 22, carbs: 80, fat: 15, ingredients: ["Lentils", "Potatoes", "Carrots"], preparationSteps: ["Mash potatoes", "Cook lentils", "Bake together"] });
  m.push({ name: "Steak and Sweet Potato", type: "bulking", dietType: ["Non-Vegetarian", "High-Protein"], category: "dinner", calories: 850, protein: 60, carbs: 65, fat: 35, ingredients: ["Sirloin Steak", "Sweet Potato", "Butter"], preparationSteps: ["Grill steak", "Bake potato", "Add butter"] });
  m.push({ name: "Chicken Fajitas", type: "maintenance", dietType: ["Non-Vegetarian", "Balanced Diet"], category: "dinner", calories: 600, protein: 45, carbs: 55, fat: 22, ingredients: ["Chicken Breast", "Bell Peppers", "Tortillas", "Salsa"], preparationSteps: ["Slice chicken & peppers", "Sauté", "Serve in tortillas"] });
  m.push({ name: "Vegan Pasta Primavera", type: "cutting", dietType: ["Vegan", "Vegetarian"], category: "dinner", calories: 450, protein: 15, carbs: 70, fat: 12, ingredients: ["Whole Wheat Pasta", "Mixed Veggies", "Olive Oil"], preparationSteps: ["Boil pasta", "Sauté veggies", "Toss together"] });
  m.push({ name: "Double Cheeseburger", type: "bulking", dietType: ["Non-Vegetarian"], category: "dinner", calories: 1100, protein: 65, carbs: 50, fat: 65, ingredients: ["Ground Beef", "Cheese", "Buns", "Mayo"], preparationSteps: ["Form patties", "Grill", "Assemble"] });
  m.push({ name: "Grilled Cauliflower Steak", type: "cutting", dietType: ["Vegan", "Vegetarian", "Low-Carb"], category: "dinner", calories: 300, protein: 10, carbs: 20, fat: 20, ingredients: ["Cauliflower", "Chimichurri", "Olive Oil"], preparationSteps: ["Slice cauliflower thick", "Grill each side", "Tope with sauce"] });
  m.push({ name: "Pork Chops with Green Beans", type: "maintenance", dietType: ["Non-Vegetarian", "Keto", "High-Protein"], category: "dinner", calories: 650, protein: 50, carbs: 10, fat: 45, ingredients: ["Pork Chops", "Green Beans", "Butter"], preparationSteps: ["Pan fry pork chops", "Blister green beans in pan"] });
  m.push({ name: "BBQ Ribs with Mac & Cheese", type: "bulking", dietType: ["Non-Vegetarian"], category: "dinner", calories: 1200, protein: 60, carbs: 95, fat: 65, ingredients: ["Pork Ribs", "Macaroni", "Cheese Sauce"], preparationSteps: ["Slow cook ribs", "Mix macaroni with hot cheese"] });
  m.push({ name: "Eggplant Parmesan", type: "maintenance", dietType: ["Vegetarian", "Balanced Diet"], category: "dinner", calories: 550, protein: 20, carbs: 60, fat: 25, ingredients: ["Eggplant", "Mozzarella", "Marinara", "Breadcrumbs"], preparationSteps: ["Bread eggplant", "Bake", "Layer with cheese and sauce"] });
  m.push({ name: "Vegan Burrito Bowl", type: "maintenance", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "dinner", calories: 600, protein: 18, carbs: 85, fat: 20, ingredients: ["Black Beans", "Rice", "Guacamole", "Corn"], preparationSteps: ["Assemble all ingredients warm"] });

  // SNACK
  m.push({ name: "Almonds & Apple", type: "cutting", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "snack", calories: 200, protein: 5, carbs: 25, fat: 14, ingredients: ["Almonds", "Apple"], preparationSteps: ["Wash apple", "Serve with almonds"] });
  m.push({ name: "Cottage Cheese & Pineapple", type: "maintenance", dietType: ["Vegetarian", "High-Protein"], category: "snack", calories: 250, protein: 25, carbs: 20, fat: 5, ingredients: ["Cottage Cheese", "Pineapple Chunks"], preparationSteps: ["Mix together"] });
  m.push({ name: "Peanut Butter Banana Toast", type: "bulking", dietType: ["Vegan", "Vegetarian"], category: "snack", calories: 450, protein: 12, carbs: 65, fat: 18, ingredients: ["Bread", "Peanut Butter", "Banana"], preparationSteps: ["Toast bread", "Spread PB", "Top with banana"] });
  m.push({ name: "Keto Cheese Crisps", type: "cutting", dietType: ["Vegetarian", "Keto", "Low-Carb"], category: "snack", calories: 150, protein: 10, carbs: 1, fat: 12, ingredients: ["Cheddar Cheese"], preparationSteps: ["Bake cheese mounds until crisp"] });
  m.push({ name: "Protein Bar", type: "maintenance", dietType: ["Vegetarian", "High-Protein"], category: "snack", calories: 220, protein: 20, carbs: 25, fat: 8, ingredients: ["Protein Bar"], preparationSteps: ["Unwrap and eat"] });
  m.push({ name: "Hummus & Carrot Sticks", type: "cutting", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "snack", calories: 180, protein: 6, carbs: 20, fat: 10, ingredients: ["Hummus", "Carrots"], preparationSteps: ["Chop carrots", "Dip in hummus"] });
  m.push({ name: "Beef Jerky", type: "maintenance", dietType: ["Non-Vegetarian", "Keto", "High-Protein"], category: "snack", calories: 200, protein: 25, carbs: 5, fat: 8, ingredients: ["Beef Jerky"], preparationSteps: ["Open bag and enjoy"] });
  m.push({ name: "Trail Mix", type: "bulking", dietType: ["Vegetarian", "Vegan"], category: "snack", calories: 500, protein: 15, carbs: 45, fat: 30, ingredients: ["Peanuts", "Raisins", "Chocolate Chips"], preparationSteps: ["Mix and grab a handful"] });
  
  // PRE/POST WORKOUT
  m.push({ name: "Rice Cakes & Honey", type: "cutting", dietType: ["Vegan", "Vegetarian"], category: "pre-workout", calories: 150, protein: 2, carbs: 35, fat: 0, ingredients: ["Rice Cakes", "Honey"], preparationSteps: ["Drizzle honey on rice cakes"] });
  m.push({ name: "Whey Isolate Shake", type: "cutting", dietType: ["Vegetarian", "High-Protein", "Low-Carb"], category: "post-workout", calories: 120, protein: 25, carbs: 3, fat: 1, ingredients: ["Whey Isolate", "Water"], preparationSteps: ["Shake in shaker bottle"] });
  m.push({ name: "Chocolate Milk", type: "bulking", dietType: ["Vegetarian", "Balanced Diet"], category: "post-workout", calories: 350, protein: 16, carbs: 45, fat: 12, ingredients: ["Whole Milk", "Chocolate Syrup"], preparationSteps: ["Stir syrup into milk"] });
  m.push({ name: "Black Coffee & Banana", type: "cutting", dietType: ["Vegan", "Vegetarian", "Balanced Diet"], category: "pre-workout", calories: 110, protein: 1, carbs: 28, fat: 0, ingredients: ["Black Coffee", "Banana"], preparationSteps: ["Brew coffee", "Eat banana"] });
  m.push({ name: "Vegan Protein Brownie", type: "bulking", dietType: ["Vegan", "Vegetarian", "High-Protein"], category: "post-workout", calories: 450, protein: 30, carbs: 45, fat: 15, ingredients: ["Vegan Protein Blend", "Oat Flour", "Cocoa"], preparationSteps: ["Bake ahead of time", "Consume post workout"] });

  return m;
};

export async function GET() {
  try {
    await connectToDatabase();
    await Meal.deleteMany({}); // Wipe DB for the Phase 3 seed upgrade
    const newMeals = generateMeals();
    await Meal.insertMany(newMeals);
    return NextResponse.json({ message: `Successfully seeded ${newMeals.length} weekly robust meals!` }, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: "Error seeding meals" }, { status: 500 });
  }
}
