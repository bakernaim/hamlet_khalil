import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import CurrentTrips from "@/components/site/CurrentTrips";
import ZiyaratPackages from "@/components/site/ZiyaratPackages";
import TrustBar from "@/components/site/TrustBar";
import VerseBanner from "@/components/site/VerseBanner";
import TourismPackages from "@/components/site/TourismPackages";
import HotelBooking from "@/components/site/HotelBooking";
import Flights from "@/components/site/Flights";
import PromoBannerCarousel from "@/components/site/PromoBannerCarousel";
import PromoModal from "@/components/site/PromoModal";
import HowItWorks from "@/components/site/HowItWorks";
import Reviews from "@/components/site/Reviews";
import Gallery from "@/components/site/Gallery";
import FAQ from "@/components/site/FAQ";
import InstagramFeed from "@/components/site/InstagramFeed";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import HolidayNotice from "@/components/site/HolidayNotice";
import LanguageWrapper from "@/components/site/LanguageWrapper";
import {
  getZiyaratPackages,
  getTourismPackages,
  getCurrentTrips,
  getBanners,
  getApprovedReviews,
  getGalleryItems,
  getHeroImages,
  getHotels,
  getFlights,
  getSettings,
  getInstagramPosts,
} from "@/server/data";
import { sectionCopy } from "@/lib/settings";

// Content is edited from the admin dashboard, so always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, ziyarat, tourism, trips, banners, reviews, gallery, heroImages, hotels] = await Promise.all([
    getSettings(),
    getZiyaratPackages(),
    getTourismPackages(),
    getCurrentTrips(),
    getBanners(),
    getApprovedReviews(),
    getGalleryItems(),
    getHeroImages(),
    getHotels(),
  ]);

  const flights = await getFlights();

  // Admin-managed Instagram posts; empty → the section shows static fallback.
  const instagram = await getInstagramPosts();

  const wa = settings.whatsappNumber;

  // displayMode routes each banner to the bottom bar, the on-load popup, or both.
  const barBanners = banners.filter((b) => b.displayMode !== "modal");
  const modalBanner = banners.find((b) => b.displayMode === "modal" || b.displayMode === "both");

  return (
    <LanguageWrapper>
      <Navbar whatsappNumber={wa} />
      <main>
        <Hero settings={settings} images={heroImages} />
        <CurrentTrips trips={trips} whatsappNumber={wa} ziyarat={ziyarat} tourism={tourism} copy={sectionCopy(settings, "trips")} />
        <ZiyaratPackages packages={ziyarat} copy={sectionCopy(settings, "ziyarat")} />
        <TourismPackages packages={tourism} copy={sectionCopy(settings, "tourism")} />
        <HotelBooking hotels={hotels} whatsappNumber={wa} copy={sectionCopy(settings, "hotels")} />
        <Flights flights={flights} whatsappNumber={wa} copy={sectionCopy(settings, "flights")} />
        <HowItWorks copy={sectionCopy(settings, "how")} />
        <TrustBar copy={sectionCopy(settings, "about")} />
        <VerseBanner />
        <Gallery items={gallery} copy={sectionCopy(settings, "gallery")} />
        <Reviews reviews={reviews} copy={sectionCopy(settings, "reviews")} />
        <FAQ copy={sectionCopy(settings, "faq")} />
        <InstagramFeed instagramUrl={settings.instagramUrl} items={instagram} copy={sectionCopy(settings, "instagram")} />
      </main>
      <Footer settings={settings} />
      <PromoBannerCarousel banners={barBanners} whatsappNumber={wa} />
      {modalBanner && <PromoModal banner={modalBanner} whatsappNumber={wa} />}
      <HolidayNotice settings={settings} />
      <FloatingButtons whatsappNumber={wa} />
    </LanguageWrapper>
  );
}
