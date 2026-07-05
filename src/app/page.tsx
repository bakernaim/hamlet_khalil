import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import CurrentTrips from "@/components/site/CurrentTrips";
import ZiyaratPackages from "@/components/site/ZiyaratPackages";
import TrustBar from "@/components/site/TrustBar";
import VerseBanner from "@/components/site/VerseBanner";
import TourismPackages from "@/components/site/TourismPackages";
import PromoBannerCarousel from "@/components/site/PromoBannerCarousel";
import PromoModal from "@/components/site/PromoModal";
import HowItWorks from "@/components/site/HowItWorks";
import Reviews from "@/components/site/Reviews";
import Gallery from "@/components/site/Gallery";
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
  getApprovedReviews,
  getGalleryItems,
  getSettings,
} from "@/server/data";

// Content is edited from the admin dashboard, so always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, ziyarat, tourism, trips, banners, reviews, gallery] = await Promise.all([
    getSettings(),
    getZiyaratPackages(),
    getTourismPackages(),
    getCurrentTrips(),
    getBanners(),
    getApprovedReviews(),
    getGalleryItems(),
  ]);

  const wa = settings.whatsappNumber;

  // displayMode routes each banner to the bottom bar, the on-load popup, or both.
  const barBanners = banners.filter((b) => b.displayMode !== "modal");
  const modalBanner = banners.find((b) => b.displayMode === "modal" || b.displayMode === "both");

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
        <HowItWorks />
        <Gallery items={gallery} />
        <Reviews reviews={reviews} />
        <FAQ />
        <InstagramFeed instagramUrl={settings.instagramUrl} />
      </main>
      <Footer settings={settings} />
      <PromoBannerCarousel banners={barBanners} whatsappNumber={wa} />
      {modalBanner && <PromoModal banner={modalBanner} whatsappNumber={wa} />}
      <FloatingButtons whatsappNumber={wa} />
    </LanguageWrapper>
  );
}
