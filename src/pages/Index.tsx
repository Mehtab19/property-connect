/**
 * Home Page (Index)
 * Main landing page for PrimeX Estates
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import AIAdvisorySection from '@/components/AIAdvisorySection';
import SolutionsSection from '@/components/SolutionsSection';
import IntelligenceSection from '@/components/IntelligenceSection';
import PropertiesSection from '@/components/PropertiesSection';
import ProcessSection from '@/components/ProcessSection';
import InvestmentToolsSection from '@/components/InvestmentToolsSection';
import CommunitySection from '@/components/CommunitySection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <AIAdvisorySection />
        <SolutionsSection />
        <IntelligenceSection />
        <PropertiesSection />
        <ProcessSection />
        <InvestmentToolsSection />
        <CommunitySection />
        <PartnersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
