import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, BookOpen, Layers } from "lucide-react";
import UsersTable from "@/components/admin/UsersTable";

interface DashboardStats {
  alumnosRegistrados: number;
  inscripcionesMes: number;
  cursosActivos: number;
  modulosActivos: number;
}

const Dashboard = () => {
  const { user } = useOutletContext<any>();
  const [stats, setStats] = useState<DashboardStats>({
    alumnosRegistrados: 0,
    inscripcionesMes: 0,
    cursosActivos: 0,
    modulosActivos: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Alumnos registrados
      const { count: alumnosCount } = await supabase
        .from("alumnos" as any)
        .select("*", { count: "exact", head: true })
        .eq("status", true);

      // Inscripciones del mes actual
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString();
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).toISOString();

      const { count: inscripcionesCount } = await supabase
        .from("curso_alumno" as any)
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth)
        .lte("created_at", endOfMonth);

      // Cursos activos
      const { count: cursosCount } = await supabase
        .from("cursos" as any)
        .select("*", { count: "exact", head: true })
        .eq("status", true);

      // Módulos activos
      const { count: modulosCount } = await supabase
        .from("modulos" as any)
        .select("*", { count: "exact", head: true })
        .eq("status", true);

      setStats({
        alumnosRegistrados: alumnosCount || 0,
        inscripcionesMes: inscripcionesCount || 0,
        cursosActivos: cursosCount || 0,
        modulosActivos: modulosCount || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: "Alumnos Registrados",
      value: stats.alumnosRegistrados,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: FileText,
      label: "Inscripciones del Mes",
      value: stats.inscripcionesMes,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: BookOpen,
      label: "Cursos Activos",
      value: stats.cursosActivos,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Layers,
      label: "Módulos Activos",
      value: stats.modulosActivos,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Bienvenido al Sistema de Gestión Escolar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-slate-800">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <UsersTable />
    </div>
  );
};

export default Dashboard;
