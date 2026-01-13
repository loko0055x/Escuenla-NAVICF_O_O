import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo_navicf.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Cursos", href: "#cursos" },
    { name: "Ingresar", href: "/admin/login", isRoute: true },
  ];

  const handleNavClick = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      navigate(href);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-background via-background to-muted/20 backdrop-blur-md z-50 border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="NAVICF Logo" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.isRoute)}
                className="text-foreground hover:text-primary transition-all font-medium relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left px-2 py-1"
              >
                {link.name}
              </button>
            ))}
            <Button
              variant="default"
              className="rounded-full transition-all hover:scale-105 hover:shadow-xl bg-primary hover:bg-primary/90"
              onClick={() => navigate("/certificados")}
            >
              Consulta de Certificados
            </Button>
            <Button
              variant="secondary"
              className="rounded-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground transition-all hover:scale-105 hover:shadow-xl"
              onClick={() => handleNavClick("#contacto")}
            >
              Simulador Gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 text-left"
                >
                  {link.name}
                </button>
              ))}
              <Button
                variant="default"
                className="rounded-full w-full"
                onClick={() => {
                  navigate("/certificados");
                  setIsOpen(false);
                }}
              >
                Consulta de Certificados
              </Button>
              <Button
                variant="secondary"
                className="rounded-full w-full bg-accent hover:bg-accent/90"
                onClick={() => handleNavClick("#contacto")}
              >
                Simulador Gratis
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
