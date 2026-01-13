import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserData {
  name: string;
  lastname: string;
  role: string;
  photo?: string;
}

const AdminLayout = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/admin/login");
      return;
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", session.user.id)
      .eq("status", true)
      .single();

    if (error || !userData) {
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }

    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Alumnos", path: "/admin/alumnos" },
    { icon: FileText, label: "Inscripciones", path: "/admin/inscripciones" },
    { icon: Award, label: "Certificados", path: "/admin/certificados" },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-slate-200 transition-all duration-300 fixed h-full z-20`}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold text-emerald-600">NAVICF</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {sidebarOpen && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar"
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
        )}

        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 px-3 mb-2">
            {sidebarOpen && "MENÚ PRINCIPAL"}
          </div>
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive(item.path)
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            {/*
            <Input
              placeholder="Buscar aquxxí"
              className="w-80 bg-slate-50 border-slate-200"
            />
         */}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">
                Hola, {user.name}
              </p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 font-semibold">
                {user.name.charAt(0)}
                {user.lastname.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
