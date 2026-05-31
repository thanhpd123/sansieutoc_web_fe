import { Hero } from '../components/Hero';
import { FloatingBookingBar } from '../components/FloatingBookingBar';
import { FeaturesBento } from '../components/FeaturesBento';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FloatingBookingBar />
      <FeaturesBento />
      <Footer />
    </>
  );
}
