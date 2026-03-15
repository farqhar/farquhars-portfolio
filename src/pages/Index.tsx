import HeroSection from "@/components/HeroSection";
import TimelineCarousel from "@/components/TimelineCarousel";
import ProjectCells from "@/components/ProjectCells";
import CTASection from "@/components/CTASection";
import StickyNav from "@/components/StickyNav";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <>
      <StickyNav />
      <FloatingCTA />
      <HeroSection />
      <TimelineCarousel />
      <ProjectCells />
      <CTASection />
    </>
  );
};

export default Index;
