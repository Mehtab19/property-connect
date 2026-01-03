/**
 * Home Page (Index)
 * Main landing page for PrimeX Estates
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import PropertiesSection from '@/components/PropertiesSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <PropertiesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
