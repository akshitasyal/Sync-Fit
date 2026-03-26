import ProgramsSection from "@/components/ProgramsSection";

export const metadata = {
  title: "Programs | Sync-Fit",
  description: "Explore our fitness programs",
};

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f5] pb-20">
      {/* Hero Banner Section */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('/images/page-header-bg.jpg')" }} 
          />
          {/* Accurate gradient overlay: fading into deep black at the bottom */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-black/50 to-[#0a0a0a]" />

          {/* Content */}
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Our Programs
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Our Programs
              </p>
              {/* Distinctive lime green dot at the bottom of the breadcrumb */}
              <div className="w-2 h-2 rounded-full bg-[#c1ff00] mt-10"></div>
            </nav>
          </div>
        </section>
      </div>

      {/* Programs Cards Grid */}
      <ProgramsSection />
    </main>
  );
}
