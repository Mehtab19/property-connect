/**
 * Home Page (Index)
 * Main landing page for PrimeX Estate - PropertyX
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import WhoIsItForSection from '@/components/WhoIsItForSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PropertiesSection from '@/components/PropertiesSection';
import MortgageCTASection from '@/components/MortgageCTASection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import ChatbotWidget from '@/components/ChatbotWidget';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhoIsItForSection />
        <HowItWorksSection />
        <PropertiesSection />
        <MortgageCTASection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default Index;
