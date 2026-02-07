/**
 * Prime X AI Advisors Section
 * Split cards for Virtual Advisor and Smart Chat, themed to the main landing page
 */

import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, MessageSquare, Mic } from "lucide-react";
import virtualAdvisorImg from "@/assets/virtual-advisor.jpg";
import smartChatImg from "@/assets/smart-chat.jpg";

const PrimeXAdvisorsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI-Powered Assistance</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
            Your AI Property
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary ml-3">
              Expert Awaits
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose how you'd like to explore verified properties with Prime X Estates
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Virtual Advisor Card */}
          <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
            <div className="h-56 md:h-64 overflow-hidden relative">
              <img
                src={virtualAdvisorImg}
                alt="Prime X Virtual Property Investment Advisor"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                <Mic className="w-3 h-3" />
                Voice-Style Experience
              </div>
            </div>
            <div className="relative p-6 md:p-8 -mt-12">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Prime X Virtual Property Investment Advisor
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
                Talk to an AI-powered property expert that guides you through buying, renting, or investing in real estate. Get personalized recommendations just like speaking with a professional agent.
              </p>
              <button
                onClick={() => navigate("/virtual-advisor")}
                className="w-full gradient-purple-blue text-primary-foreground font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Talk to Prime X Advisor
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smart Chat Card */}
          <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-xl hover:border-secondary/40 transition-all duration-500 hover:-translate-y-1">
            <div className="h-56 md:h-64 overflow-hidden relative flex items-center justify-center bg-muted/30">
              <img
                src={smartChatImg}
                alt="Prime X Smart Property Chat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-secondary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                <MessageSquare className="w-3 h-3" />
                Text Chat Experience
              </div>
            </div>
            <div className="relative p-6 md:p-8 -mt-12">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Prime X Smart Property Chat
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
                Prefer typing? Instantly explore verified properties, prices, and availability through a fast and intelligent chat experience.
              </p>
              <button
                onClick={() => navigate("/smart-chat")}
                className="w-full gradient-blue-purple text-primary-foreground font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Start Smart Chat
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrimeXAdvisorsSection;
