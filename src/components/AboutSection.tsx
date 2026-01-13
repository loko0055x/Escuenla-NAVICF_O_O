import { useState } from "react";
import { Play, Check, Phone } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import aboutPic1 from "@/assets/about-picture1.png";
import aboutPic2 from "@/assets/about-picture2.png";

const AboutSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open("https://web.whatsapp.com/send?phone=51937434195", "_blank");
  };

  return (
    <section id="nosotros" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Images */}
          <div className="relative">
            <div className="relative">
              <div className="absolute -top-8 -left-8 bg-primary text-white rounded-3xl p-8 z-10 shadow-xl">
                <div className="text-5xl font-bold">15+</div>
                <div className="text-lg">AÑOS</div>
                <div className="text-sm">de Experiencia</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-16">
                <img 
                  src={aboutPic1} 
                  alt="Operador en maquinaria"
                  className="rounded-2xl shadow-lg w-full h-auto"
                />
                <img 
                  src={aboutPic2} 
                  alt="Instructor profesional"
                  className="rounded-2xl shadow-lg w-full h-auto mt-8"
                />
              </div>

              <div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-primary rounded-full p-6 cursor-pointer hover:scale-110 transition-transform shadow-xl group"
                onClick={() => setIsOpen(true)}
              >
                <Play className="h-8 w-8 text-white" fill="white" />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-sm font-semibold text-primary">Escuela Navicf</p>
                  <p className="text-xs text-muted-foreground">Conocenos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <div className="w-12 h-0.5 bg-primary"></div>
                NUESTRA ESCUELA
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Conviertete en un{" "}
              <span className="text-primary">OPERADOR</span> Certificado
            </h2>

            <p className="text-lg text-muted-foreground">
              Escuela Navicf potencia tu carrera hacia horizontes ilimitados: Conviértete en un 
              operador de maquinaria pesada de élite con nuestra formación de excelencia.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform">
                <div className="bg-primary rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">Profesor altamente calificado</span>
              </div>
              <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform">
                <div className="bg-primary rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">Acceso a nuestra plataforma ilimitadamente</span>
              </div>
              <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform">
                <div className="bg-primary rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">100% práctico</span>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={handleWhatsAppClick}
              className="rounded-full text-base px-8 py-6 bg-[#25D366] hover:bg-[#20BA5A] text-white"
            >
              <Phone className="mr-2 h-5 w-5" />
              937434195
            </Button>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-5xl p-0">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/yv4N0m20VI0?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default AboutSection;
