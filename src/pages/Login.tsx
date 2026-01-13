import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import logo from "@/assets/logo_navicf.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Error",
        description: "Por favor ingrese un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Iniciando sesión...",
      description: "Verificando credenciales",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      {/* Back to home link */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-slate-400 hover:text-primary transition-colors text-sm font-medium z-10"
      >
        ← Volver al inicio
      </Link>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="NAVICF Logo" className="h-20 w-auto" />
          </div>

          {/* Title */}
          <h2 className="text-center text-slate-600 text-lg mb-8 font-medium">
            Certificados y Diplomas
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Ingrese Correo Electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base border-slate-300 focus:border-primary"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Ingrese Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base border-slate-300 focus:border-primary"
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              Acceder
            </Button>
          </form>
        </div>

        <div className="text-right mt-20">
          <p className="text-slate-400 text-sm">Activar Windows</p>
          <p className="text-slate-500 text-xs">
            Ve a Configuración para activar Windows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
