import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Logo en haut du Hero */}
      <img src={logo} alt="Elden Ring Logo" className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-auto z-20 drop-shadow-lg" />

      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in-up">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="font-cinzel text-6xl md:text-8xl font-bold text-foreground tracking-wider">
              ELDEN RING
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-primary"></div>
              <Swords className="w-8 h-8 text-primary animate-glow" />
              <div className="h-px w-16 bg-primary"></div>
            </div>
            <p className="font-cinzel text-2xl md:text-3xl text-primary tracking-wide">
              Rise, Tarnished
            </p>
          </div>

          <p className="font-inter text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A vast world where open fields with a variety of situations and huge dungeons
            with complex and three-dimensional designs are seamlessly connected.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="font-cinzel text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-gold)] hover:shadow-[var(--shadow-gold)] transition-all duration-300 hover:scale-105"
            >
              Explore the Lands Between
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-cinzel text-lg px-8 py-6 border-primary text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              Learn the Lore
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
