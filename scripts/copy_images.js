const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Akshat\\.gemini\\antigravity\\brain\\2d3d4998-c874-4433-a692-36e7faac1d27';
const destDir = 'C:\\Users\\Akshat\\Sync-Fit\\public\\images\\programs';

const filesToCopy = [
  { src: 'strength_training_program_1775116410606.png', dest: 'strength.jpg' },
  { src: 'weight_loss_program_concept_1775116431097.png', dest: 'weight-loss.jpg' },
  { src: 'cardio_endurance_program_1775116448300.png', dest: 'cardio.jpg' },
  { src: 'adaptive_fitness_program_concept_1775116468903.png', dest: 'adaptive.jpg' },
  { src: 'muscle_gain_system_image_1775116484438.png', dest: 'muscle-gain.jpg' },
  { src: 'beginner_smart_start_concept_1775116503140.png', dest: 'beginner.jpg' },
  { src: 'muscle_fiber_concept_strength_1775117121474.png', dest: 'benefits\\muscle-fibers.jpg' },
  { src: 'metabolism_concept_benefit_1775117103218.png', dest: 'benefits\\metabolism.jpg' },
  { src: 'heart_rate_endurance_concept_1775117141382.png', dest: 'benefits\\heart-rate.jpg' },
  { src: 'ai_fitness_logic_concept_1775117221597.png', dest: 'features\\ai-logic.jpg' },
  { src: 'functional_training_adaptive_concept_1775117163818.png', dest: 'features\\functional.jpg' },
  { src: 'consistency_tracking_concept_1775117203109.png', dest: 'features\\consistency.jpg' },
  { src: 'protein_supplement_concept_1775117241810.png', dest: 'features\\protein.jpg' },
  { src: 'nutrition_meal_plan_concept_1775117181330.png', dest: 'features\\nutrition.jpg' }
];

[
  destDir,
  path.join(destDir, 'benefits'),
  path.join(destDir, 'features')
].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

filesToCopy.forEach(file => {
  try {
    fs.copyFileSync(path.join(srcDir, file.src), path.join(destDir, file.dest));
    console.log(`Copied ${file.src} to ${file.dest}`);
  } catch (err) {
    console.error(`Failed to copy ${file.src}:`, err.message);
  }
});
