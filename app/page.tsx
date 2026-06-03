import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustSection from '@/components/home/TrustSection';
import HowItWorks from '@/components/home/HowItWorks';
import ReviewPreview from '@/components/home/ReviewPreview';
import FAQPreview from '@/components/home/FAQPreview';
import PromoBannerList from '@/components/promos/PromoBannerList';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Active home + global promo banners (renders nothing if none) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <PromoBannerList placement="home" />
      </div>
      <CategorySection />
      <FeaturedProducts />
      <TrustSection />
      <HowItWorks />
      <ReviewPreview />
      <FAQPreview />
    </>
  );
}
