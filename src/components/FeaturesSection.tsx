import trainingIcon from "@/assets/training-courses.svg";
import booksIcon from "@/assets/exca1.png";
import certifiedIcon from "@/assets/certified-teacher.svg";
import simulatorIcon from "@/assets/video-courses.svg";
import expertIcon from "@/assets/experts-teacher.svg";
import practicalIcon from "@/assets/exca1.png";

const FeaturesSection = () => {
  const features = [
    {
      icon: trainingIcon,
      title: "Formación constante",
      description: "Actualización permanente de conocimientos"
    },
    {
      icon: booksIcon,
      title: "Biblioteca de libros",
      description: "Acceso a material educativo completo"
    },
    {
      icon: certifiedIcon,
      title: "Profesor certificado",
      description: "Instructores con certificación oficial"
    },
    {
      icon: simulatorIcon,
      title: "Simulaciones en vivo",
      description: "Práctica en simuladores profesionales"
    },
    {
      icon: expertIcon,
      title: "Profesor Experto",
      description: "Más de 15 años de experiencia"
    },
    {
      icon: practicalIcon,
      title: "100% Practico",
      description: "Aprendizaje con equipos reales"
    }
  ];

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <div className="w-12 h-0.5 bg-primary"></div>
                POR QUÉ ELEGIRNOS
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Nosotros brindamos{" "}
              <span className="text-primary">cursos 100%</span> Practicos
            </h2>

            <p className="text-lg text-muted-foreground">
              En nuestra escuela de operadores de maquinaria pesada, adquirirás habilidades 
              precisas y conocimientos especializados que te abrirán las puertas a un mundo de 
              oportunidades. Con instructores expertos y equipos de vanguardia, te sumergirás en una 
              experiencia de aprendizaje inigualable. Desde excavadoras hasta motoniveladoras, estarás 
              listo para enfrentar cualquier desafío con confianza y seguridad.
            </p>
          </div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:-translate-y-3 transition-all duration-300 cursor-pointer group"
              >
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-center font-semibold text-sm mb-2">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
