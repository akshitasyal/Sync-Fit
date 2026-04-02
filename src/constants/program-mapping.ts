export const PROGRAM_IMAGES = {
  strength: {
    main: "/images/programs/strength.jpg",
    benefits: [
      "/images/programs/benefits/muscle-fibers.jpg",
      "/images/programs/benefits/metabolism.jpg",
      "/images/programs/benefits/heart-rate.jpg",
    ],
    features: [
      "/images/programs/features/ai-logic.jpg",
      "/images/programs/features/functional.jpg",
      "/images/programs/features/consistency.jpg",
      "/images/programs/features/protein.jpg",
    ],
  },
  weightLoss: {
    main: "/images/programs/weight-loss.jpg",
    benefits: [
      "/images/programs/benefits/metabolism.jpg",
      "/images/programs/features/nutrition.jpg",
      "/images/programs/features/consistency.jpg",
    ],
    features: [
      "/images/programs/benefits/heart-rate.jpg",
      "/images/programs/features/ai-logic.jpg",
      "/images/programs/features/functional.jpg",
      "/images/programs/benefits/muscle-fibers.jpg",
    ],
  },
  cardio: {
    main: "/images/programs/cardio.jpg",
    benefits: [
      "/images/programs/benefits/heart-rate.jpg",
      "/images/programs/features/functional.jpg",
      "/images/programs/features/consistency.jpg",
    ],
    features: [
      "/images/programs/benefits/metabolism.jpg",
      "/images/programs/features/ai-logic.jpg",
      "/images/programs/features/nutrition.jpg",
      "/images/programs/features/protein.jpg",
    ],
  },
  adaptive: {
    main: "/images/programs/adaptive.jpg",
    benefits: [
      "/images/programs/features/functional.jpg",
      "/images/programs/benefits/muscle-fibers.jpg",
      "/images/programs/features/consistency.jpg",
    ],
    features: [
      "/images/programs/features/ai-logic.jpg",
      "/images/programs/benefits/metabolism.jpg",
      "/images/programs/benefits/heart-rate.jpg",
      "/images/programs/features/nutrition.jpg",
    ],
  },
  muscleGain: {
    main: "/images/programs/muscle-gain.jpg",
    benefits: [
      "/images/programs/features/protein.jpg",
      "/images/programs/benefits/muscle-fibers.jpg",
      "/images/programs/features/functional.jpg",
    ],
    features: [
      "/images/programs/benefits/metabolism.jpg",
      "/images/programs/features/ai-logic.jpg",
      "/images/programs/features/consistency.jpg",
      "/images/programs/features/nutrition.jpg",
    ],
  },
  beginner: {
    main: "/images/programs/beginner.jpg",
    benefits: [
      "/images/programs/features/consistency.jpg",
      "/images/programs/features/functional.jpg",
      "/images/programs/benefits/heart-rate.jpg",
    ],
    features: [
      "/images/programs/features/ai-logic.jpg",
      "/images/programs/features/nutrition.jpg",
      "/images/programs/benefits/metabolism.jpg",
      "/images/programs/benefits/muscle-fibers.jpg",
    ],
  },
};

export const FALLBACK_IMAGE = "/images/programs/strength.jpg";

export const getProgramImage = (program: string, type: 'main' | 'benefit' | 'feature' = 'main', index: number = 0) => {
  const p = PROGRAM_IMAGES[program as keyof typeof PROGRAM_IMAGES];
  if (!p) return FALLBACK_IMAGE;

  if (type === 'main') return p.main;
  if (type === 'benefit') return p.benefits[index] || p.main;
  if (type === 'feature') return p.features[index] || p.main;

  return FALLBACK_IMAGE;
};
