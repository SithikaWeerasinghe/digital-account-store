import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import ReviewPreview from '@/components/home/ReviewPreview';
import FAQPreview from '@/components/home/FAQPreview';
import HelpCTA from '@/components/home/HelpCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <HowItWorks />
      <TrustSection />
      <ReviewPreview />
      <FAQPreview />
      <HelpCTA />
    </>
  );
}
