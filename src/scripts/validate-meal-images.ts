import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { MEAL_IMAGE_REGISTRY } from '../constants/mealImages';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://akshitasyal09:akshitasyal8@cluster0.vhrwss5.mongodb.net/syncfit?retryWrites=true&w=majority";
const MEALS_DIR = path.join(process.cwd(), 'public', 'images', 'meals');

export interface ValidationReport {
  totalMealsInDb: number;
  totalImagesVerified: number;
  distinctImageFiles: number;
  disallowedDuplicates: Array<{ image: string; meals: string[] }>;
  missingFiles: string[];
  passed: boolean;
}

export async function validateMealImages(): Promise<ValidationReport> {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  if (!db) throw new Error("Could not connect to MongoDB");

  const meals = await db.collection('meals').find({}).toArray();
  const imageToMeals = new Map<string, string[]>();
  const missingFiles: string[] = [];

  for (const m of meals) {
    const name = (m.name || '').trim();
    const imageUrl = m.imageUrl;

    if (!imageUrl) {
      missingFiles.push(`${name} (No imageUrl in DB)`);
      continue;
    }

    const relPath = imageUrl.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', relPath);

    if (!fs.existsSync(fullPath)) {
      missingFiles.push(`${name} -> ${imageUrl} (File does not exist on disk)`);
      continue;
    }

    if (!imageToMeals.has(imageUrl)) {
      imageToMeals.set(imageUrl, []);
    }
    imageToMeals.get(imageUrl)!.push(name);
  }

  // Check for illegitimate duplicates across different dishes
  const disallowedDuplicates: Array<{ image: string; meals: string[] }> = [];

  function normalizeDishName(n: string) {
    return n
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/\((.*?)\)/g, '$1') // unwrap parentheses
      .replace(/\s*\b(?:vegan|vrat|fasting|lunch|dinner|breakfast|snack|special|specials)\b\s*/gi, ' ')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  for (const [img, names] of imageToMeals.entries()) {
    if (names.length > 1) {
      const distinctDishes = new Set(names.map(normalizeDishName));
      if (distinctDishes.size > 1) {
        disallowedDuplicates.push({
          image: img,
          meals: names
        });
      }
    }
  }

  const passed = missingFiles.length === 0 && disallowedDuplicates.length === 0;

  return {
    totalMealsInDb: meals.length,
    totalImagesVerified: meals.length - missingFiles.length,
    distinctImageFiles: imageToMeals.size,
    disallowedDuplicates,
    missingFiles,
    passed
  };
}

if (require.main === module) {
  validateMealImages().then(report => {
    console.log('\n=============================================');
    console.log('       SYNCLIGHT MEAL IMAGE AUDIT REPORT     ');
    console.log('=============================================');
    console.log(`Total Meals in Database:      ${report.totalMealsInDb}`);
    console.log(`Total Images Verified:        ${report.totalImagesVerified}`);
    console.log(`Distinct Image Files:         ${report.distinctImageFiles}`);
    console.log(`Disallowed Duplicates:        ${report.disallowedDuplicates.length}`);
    console.log(`Missing Image Files:          ${report.missingFiles.length}`);
    console.log(`Overall Validation Status:    ${report.passed ? 'PASSED (100% CLEAN)' : 'FAILED'}`);
    console.log('=============================================\n');

    if (report.disallowedDuplicates.length > 0) {
      console.error('ERROR: Found different dishes sharing the same image:');
      console.error(report.disallowedDuplicates);
      process.exit(1);
    }

    if (report.missingFiles.length > 0) {
      console.error('ERROR: Missing image files:');
      console.error(report.missingFiles);
      process.exit(1);
    }

    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
