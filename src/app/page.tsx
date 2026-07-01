import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import CurrentTrips from "@/components/site/CurrentTrips";
import ZiyaratPackages from "@/components/site/ZiyaratPackages";
import TrustBar from "@/components/site/TrustBar";
import TourismPackages from "@/components/site/TourismPackages";
import ArbaeenBanner from "@/components/site/ArbaeenBanner";
import Testimonials from "@/components/site/Testimonials";
import InstagramFeed from "@/components/site/InstagramFeed";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import LanguageWrapper from "@/components/site/LanguageWrapper";
import {
  getZiyaratPackages,
  getTourismPackages,
  getCurrentTrips,
  getSettings,
} from "@/server/data";

// Content is edited from the admin dashboard, so always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, ziyarat, tourism, trips] = await Promise.all([
    getSettings(),
    getZiyaratPackages(),
    getTourismPackages(),
    getCurrentTrips(),
  ]);

  const wa = settings.whatsappNumber;

  return (
    <LanguageWrapper>
      <Navbar whatsappNumber={wa} />
      <main>
        <Hero settings={settings} />
        <CurrentTrips trips={trips} whatsappNumber={wa} />
        <ZiyaratPackages packages={ziyarat} whatsappNumber={wa} />
        <TrustBar />
        <TourismPackages packages={tourism} whatsappNumber={wa} />
        <ArbaeenBanner whatsappNumber={wa} />
        <Testimonials />
        <InstagramFeed />
      </main>
      <Footer settings={settings} />
      <FloatingButtons whatsappNumber={wa} />
    </LanguageWrapper>
  );
}
