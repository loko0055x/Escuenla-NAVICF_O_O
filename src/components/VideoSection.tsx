import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import portadaImage from "@/assets/portada.png";

const VideoSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ESCUELA DE OPERADORES DE MAQUINARIA PESADA
        </h2>
        
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <img 
            src={portadaImage} 
            alt="Video presentación Navicf"
            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all group-hover:bg-black/40">
            <div className="bg-primary/90 rounded-full p-8 transition-transform group-hover:scale-110">
              <Play className="h-16 w-16 text-white" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="text-white text-xl font-semibold bg-black/50 px-6 py-3 rounded-full">
              Conoce Nuestra Escuela
            </p>
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

export default VideoSection;
