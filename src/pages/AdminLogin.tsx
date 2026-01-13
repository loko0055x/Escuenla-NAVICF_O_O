import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo_navicf.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Verificar que el usuario existe en la tabla users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', data.user.id)
          .eq('status', true)
          .single();

        if (userError || !userData) {
          await supabase.auth.signOut();
          throw new Error("Usuario no autorizado");
        }

        toast({
          title: "Bienvenido",
          description: `Hola ${userData.name}`,
        });

        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="NAVICF Logo" className="h-24 w-auto" />
          </div>

          <h2 className="text-center text-slate-700 text-2xl font-semibold mb-2">
            Panel Administrativo
          </h2>
          <p className="text-center text-slate-500 text-sm mb-8">
            Sistema de Gestión Escolar
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base border-slate-300 focus:border-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base border-slate-300 focus:border-emerald-500"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
