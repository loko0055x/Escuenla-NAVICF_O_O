import { useEffect, useState } from "react";
import { Star, Clock } from "lucide-react";
import excavadoraImg from "@/assets/excavadora.jpg";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  name: string;
  discount: number;
  duration_value: number;
  duration_unit: string;
  puntuacion: number;
}

interface CourseModule {
  name: string;
  descripcion: string;
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    // @ts-ignore - External Supabase schema

    console.log("sssssssssssssss");
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("status", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching courses:", error);
    } else if (data) {
      console.log("Si hay data");
      setCourses(data);
    }
  };

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
    setLoading(true);

    // @ts-ignore - External Supabase schema
    const { data, error } = await supabase.rpc("obtener_modulos_curso", {
      curso_id_param: course.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los módulos del curso",
        variant: "destructive",
      });
      setModules([]);
    } else if (data) {
      console.log(data);
      setModules(data);
    }
    setLoading(false);
  };

  const getDurationText = (value: number, unit: string) => {
    if (unit === "semanas")
      return `${value} ${value === 1 ? "semana" : "semanas"}`;
    if (unit === "meses") return `${value} ${value === 1 ? "mes" : "meses"}`;
    if (unit === "dias") return `${value} ${value === 1 ? "día" : "días"}`;
    return `${value} ${unit}`;
  };

  return (
    <>
      <section id="cursos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block">
              <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2 justify-center">
                <div className="w-12 h-0.5 bg-primary"></div>
                NUESTROS CURSOS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Algunos de nuestros <span className="text-primary">cursos</span>{" "}
              más popularesx
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={excavadoraImg}
                    alt={course.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {course.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg shadow-lg">
                      -{course.discount}%
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{course.puntuacion}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {getDurationText(
                          course.duration_value,
                          course.duration_unit
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {selectedCourse?.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Módulos del curso y contenido detallado
            </p>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay módulos disponibles para este curso
                </div>
              ) : (
                modules.map((module, index) => (
                  <div
                    key={index}
                    className="group relative border-2 border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-lg"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl"></div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                          {module.modulo_name}
                        </h3>
                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-4 border-l-2 border-primary/20">
                          {module.descripcion}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoursesSection;
