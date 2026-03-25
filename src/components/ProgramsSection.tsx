import React from 'react';
import {
  BuildingLibraryIcon,
  ScaleIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon,
  StarIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

const programs = [
  {
    id: "01",
    title: "Smart Strength Training",
    description: "AI-powered strength programs tailored to your fitness level using fuzzy logic and personalized intensity recommendations.",
    icon: BuildingLibraryIcon,
    bgImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Intelligent Weight Loss Plan",
    description: "Dynamic fat-loss plans combining calorie optimization, adaptive workouts, and personalized meal strategies.",
    icon: ScaleIcon,
    bgImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Cardio & Endurance Optimization",
    description: "Boost stamina with smart cardio routines adjusted based on your energy levels and recovery patterns.",
    icon: HeartIcon,
    bgImage: "https://images.unsplash.com/photo-1540496905036-5937c1064743?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "Adaptive Fitness Programs",
    description: "Flexible training plans that evolve with your progress, feedback, and consistency scores.",
    icon: UserGroupIcon,
    bgImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "05",
    title: "Muscle Gain System",
    description: "High-protein diet integration with optimized strength training for maximum muscle growth and recovery.",
    icon: SparklesIcon,
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "06",
    title: "Beginner Smart Start",
    description: "Safe and guided plans for beginners with simplified meals, lighter workouts, and gradual progression.",
    icon: StarIcon,
    bgImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop"
  }
];

export default function ProgramsSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group relative overflow-hidden bg-[#f8f7f5] rounded-[30px] p-10 min-h-[420px] flex flex-col transition-all duration-300"
            >
              {/* Hover Background Image Layer */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-0 group-hover:opacity-100 z-0"
                style={{ backgroundImage: `url(${program.bgImage})` }}
              />
              {/* Hover Dark Overlay Layer */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

              {/* Content Context Layer */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#c1ff00] transition-transform duration-300 group-hover:-translate-y-1">
                    <program.icon className="w-8 h-8 text-[#111111]" />
                  </div>
                  <span className="text-xl font-bold text-[#111111] group-hover:text-white transition-colors duration-300 font-sans">
                    {program.id}.
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-[#111111] group-hover:text-white mb-4 transition-colors duration-300">
                    {program.title}
                  </h3>
                  <p className="text-[#666666] group-hover:text-gray-200 leading-relaxed transition-colors duration-300">
                    {program.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 group-hover:border-white/30 transition-colors duration-300 flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-[#111111] group-hover:text-white transition-colors duration-300">
                    View Plan
                  </span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c1ff00] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRightIcon className="w-5 h-5 text-[#111111]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
