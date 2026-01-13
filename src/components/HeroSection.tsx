import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-mining.jpg";

const HeroSection = () => {
  const [currentMachine, setCurrentMachine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const machines = [
    "Camión minero",
    "Excavadora hidráulica",
    "Tractor oruga",
    "Motoniveladora"
  ];

  useEffect(() => {
    const currentWord = machines[currentMachine];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentMachine((prev) => (prev + 1) % machines.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentMachine]);

  return (
    <section id="inicio" className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-right space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Certifícate en{" "}
              <span className="text-primary transition-all duration-300 inline-block min-w-[300px] relative">
                {displayText}
                <span className="animate-pulse text-primary">|</span>
              </span>
              <span className="block mt-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Como Operador Profesional
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Navicf: Tu puerta al éxito en maquinaria pesada. Aprende con expertos, 
              prácticas en equipos reales, simuladores y certifícate como operador 
              profesional. ¡Sé el mejor!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                className="rounded-full text-base px-10 py-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1"
                onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver más...
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full text-base px-10 py-7 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Recibe tu clase de simulador gratis
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in-up">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <img 
                src={heroImage} 
                alt="Operador profesional de maquinaria minera"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://web.whatsapp.com/send?phone=51937434195"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-5 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 hover:-translate-y-1 animate-float group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
      </a>
    </section>
  );
};

export default HeroSection;
