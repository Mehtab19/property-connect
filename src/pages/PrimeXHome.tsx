import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
import virtualAdvisorImg from "@/assets/virtual-advisor.jpg";
import smartChatImg from "@/assets/smart-chat.jpg";

const PrimeXHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-purple-blue flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Prime X <span className="text-muted-foreground font-medium">Estates</span>
          </h1>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
            Your AI Property
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Expert Awaits
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose how you'd like to explore verified properties with Prime X Estates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Virtual Advisor Card */}
          <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card-dark hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
            <div className="h-64 md:h-72 overflow-hidden">
              <img
                src={virtualAdvisorImg}
                alt="Prime X Virtual Property Advisor"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>
            <div className="relative p-6 md:p-8 -mt-16">
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
          <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card-dark hover:border-secondary/40 transition-all duration-500 hover:-translate-y-1">
            <div className="h-64 md:h-72 overflow-hidden flex items-center justify-center bg-muted/30">
              <img
                src={smartChatImg}
                alt="Prime X Smart Property Chat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>
            <div className="relative p-6 md:p-8 -mt-16">
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
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        © 2026 Prime X Estates. All rights reserved.
      </footer>
    </div>
  );
};

export default PrimeXHome;
