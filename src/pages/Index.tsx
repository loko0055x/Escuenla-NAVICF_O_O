import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import VideoEmbedSection from "@/components/VideoEmbedSection";
import AboutSection from "@/components/AboutSection";
import LogoCarousel from "@/components/LogoCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <VideoSection />
      <VideoEmbedSection />
      <AboutSection />
      <LogoCarousel />
      <FeaturesSection />
      <CoursesSection />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
