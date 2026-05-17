import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ZiyaratPackages from "@/components/ZiyaratPackages";
import TrustBar from "@/components/TrustBar";
import TourismPackages from "@/components/TourismPackages";
import ArbaeenBanner from "@/components/ArbaeenBanner";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import LanguageWrapper from "@/components/LanguageWrapper";

export default function Home() {
  return (
    <LanguageWrapper>
      <Navbar />
      <main>
        <Hero />
        <ZiyaratPackages />
        <TrustBar />
        <TourismPackages />
        <ArbaeenBanner />
        <Testimonials />
        <InstagramFeed />
      </main>
      <Footer />
      <FloatingButtons />
    </LanguageWrapper>
  );
}
