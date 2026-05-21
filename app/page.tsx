import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustSection from '@/components/home/TrustSection';
import HowItWorks from '@/components/home/HowItWorks';
import ReviewPreview from '@/components/home/ReviewPreview';
import FAQPreview from '@/components/home/FAQPreview';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TrustSection />
      <HowItWorks />
      <ReviewPreview />
      <FAQPreview />
    </>
  );
}
