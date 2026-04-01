import ProgramsSection from "@/components/programs/ProgramsSection";
import ProgramsHero from "@/components/programs/ProgramsHero";

export const metadata = {
  title: "Programs | Sync-Fit",
  description: "Explore our fitness programs",
};

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f5] pb-20">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.7s ease both;
        }
      `}</style>

      {/* Hero + integrated navbar inside rounded card */}
      <ProgramsHero />

      {/* Programs Cards Grid */}
      <div className="mt-16">
        <ProgramsSection />
      </div>
    </main>
  );
}
