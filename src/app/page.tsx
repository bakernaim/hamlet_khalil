import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import CurrentTrips from "@/components/site/CurrentTrips";
import ZiyaratPackages from "@/components/site/ZiyaratPackages";
import TrustBar from "@/components/site/TrustBar";
import VerseBanner from "@/components/site/VerseBanner";
import TourismPackages from "@/components/site/TourismPackages";
import PromoBanner from "@/components/site/PromoBanner";
import HowItWorks from "@/components/site/HowItWorks";
import Testimonials from "@/components/site/Testimonials";
import FAQ from "@/components/site/FAQ";
import InstagramFeed from "@/components/site/InstagramFeed";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import LanguageWrapper from "@/components/site/LanguageWrapper";
import {
  getZiyaratPackages,
  getTourismPackages,
  getCurrentTrips,
  getBanners,
  getSettings,
} from "@/server/data";

// Content is edited from the admin dashboard, so always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, ziyarat, tourism, trips, banners] = await Promise.all([
    getSettings(),
    getZiyaratPackages(),
    getTourismPackages(),
    getCurrentTrips(),
    getBanners(),
  ]);

  const wa = settings.whatsappNumber;

  return (
    <LanguageWrapper>
      <Navbar whatsappNumber={wa} />
      <main>
        <Hero settings={settings} />
        <CurrentTrips trips={trips} whatsappNumber={wa} ziyarat={ziyarat} tourism={tourism} />
        <ZiyaratPackages packages={ziyarat} />
        <TrustBar />
        <VerseBanner />
        <TourismPackages packages={tourism} />
        {banners.map((b) => (
          <PromoBanner key={b.id} banner={b} whatsappNumber={wa} />
        ))}
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <InstagramFeed instagramUrl={settings.instagramUrl} />
      </main>
      <Footer settings={settings} />
      <FloatingButtons whatsappNumber={wa} />
    </LanguageWrapper>
  );
}
