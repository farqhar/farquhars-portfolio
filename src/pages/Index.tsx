import HeroSection from "@/components/HeroSection";
import TimelineCarousel from "@/components/TimelineCarousel";
import ProjectDeck from "@/components/ProjectDeck";
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
      <ProjectDeck />
      <CTASection />
    </>
  );
};

export default Index;
