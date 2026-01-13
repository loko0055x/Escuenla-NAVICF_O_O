import brandLogo from "@/assets/brand.png";

const LogoCarousel = () => {
  const logos = Array(8).fill(brandLogo);

  return (
    <section className="py-12 bg-muted/20 overflow-hidden">
      <div className="relative">
        <div className="flex animate-scroll">
          {logos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 px-12">
              <img 
                src={logo} 
                alt={`Partner ${index + 1}`}
                className="h-20 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div key={`duplicate-${index}`} className="flex-shrink-0 px-12">
              <img 
                src={logo} 
                alt={`Partner ${index + 1}`}
                className="h-20 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;
