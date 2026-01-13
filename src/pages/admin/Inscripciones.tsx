import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Edit, Trash2 } from "lucide-react";

interface Inscripcion {
  dni: string;
  nombre: string;
  apellido: string;
  curso: string;
  estado: string;
  fecha_creacion: string;
}

interface Curso {
  id: number;
  name: string;
}

const Inscripciones = () => {
  const { user } = useOutletContext<any>();
  const { toast } = useToast();

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [filterDni, setFilterDni] = useState("");
  const [filterCursoId, setFilterCursoId] = useState<number | null>(null);
  const [alumnoIdFilter, setAlumnoIdFilter] = useState<number | null>(null);

  const [formDni, setFormDni] = useState("");
  const [alumnoIdForm, setAlumnoIdForm] = useState<number | null>(null);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);

  //paginacion
  // paginación

  // ✅ Cargar cursos e inscripciones iniciales una sola vez
  useEffect(() => {
    loadCursos();
    loadInscripciones();
  }, []);

  // ✅ Ejecuta la carga cada vez que cambian los filtros
  useEffect(() => {
    loadInscripciones();
  }, [alumnoIdFilter, filterCursoId]);

  const loadCursos = async () => {
    const { data, error } = await supabase
      .from("cursos")
      .select("id, name")
      .eq("status", true)
      .order("name");

    if (!error && data) setCursos(data);
  };

  // ✅ Función limpia y consistente
  const loadInscripciones = async () => {
    try {
      const { data, error } = await supabase.rpc("filtrar_inscripciones", {
        alumno_id_param: alumnoIdFilter,
        curso_id_param: filterCursoId,
      });

      if (error) throw error;
      setInscripciones(data || []);
    } catch (err) {
      console.error("Error loading inscripciones:", err);
    }
  };

  const searchInscripcionAlumnoByDni = async (dni: string) => {
    if (!/^\d{8}$/.test(dni)) {
      toast({
        title: "Error",
        description: "DNI debe tener 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc("obtener_alumnos_pendientes", {
        dni_param: dni,
      });

      if (error) throw error;

      if (data?.length > 0) {
        setAlumnoIdFilter(data[0].idalumno);
        toast({
          title: "Alumno encontrado",
          description: `DNI: ${data[0].dni}`,
        });
      } else {
        setAlumnoIdFilter(null);
        toast({
          title: "No encontrado",
          description: "No existe alumno con ese DNI",
          variant: "destructive",
        });
      }

      // ✅ NO LLAMAR loadInscripciones manualmente
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const searchAlumnoByDni = async (dni: string) => {
    if (!/^\d{8}$/.test(dni)) {
      toast({
        title: "Error",
        description: "El DNI debe tener 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("alumnos")
        .select("id, dni")
        .eq("dni", dni)
        .single();

      if (error) throw error;

      if (data) {
        setAlumnoIdForm(data.id);
        toast({
          title: "Alumno encontrado",
          description: `DNI: ${data.dni}`,
        });
      } else {
        setAlumnoIdForm(null);
        toast({
          title: "No encontrado",
          description: "No existe alumno con este DNI",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const cleanFilter = () => {
    setFilterDni("");
    setAlumnoIdFilter(null);
    setFilterCursoId(null);
    // ✅ El useEffect se encargará de refrescar
  };

  const handleSubmitInscripcion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alumnoIdForm || !selectedCursoId) {
      toast({
        title: "Error",
        description: "Debe seleccionar alumno y curso",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("curso_alumno").insert([
        {
          alumno_id: alumnoIdForm,
          curso_id: selectedCursoId,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Inscripción creada",
        description: "Se agregó correctamente",
      });

      setDialogOpen(false);
      resetForm();
      loadInscripciones(); // ✅ recarga manual aquí está ok
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  const handleDelete = async (dni: string, curso: string) => {
    if (user.role !== "admin") {
      toast({
        title: "Permisos insuficientes",
        description: "Solo administradores pueden eliminar inscripciones",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("¿Está seguro de eliminar esta inscripción?")) return;

    // Implementar eliminación lógica
    toast({
      title: "En desarrollo",
      description: "Función en implementación",
    });
  };
  const resetForm = () => {
    setFormDni("");
    setAlumnoIdForm(null);
    setSelectedCursoId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Alumnos Inscritos
          </h1>
          <p className="text-slate-500 mt-1">
            Gestión de inscripciones de alumnos
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Inscripción
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Inscripción</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitInscripcion} className="space-y-4">
              <div>
                <label className="text-sm font-medium">DNI del Alumno *</label>
                <div className="flex space-x-2">
                  <Input
                    value={formDni}
                    onChange={(e) => setFormDni(e.target.value)}
                    placeholder="12345678"
                    maxLength={8}
                  />
                  <Button
                    type="button"
                    onClick={() => searchAlumnoByDni(formDni)}
                    variant="outline"
                  >
                    Buscar Alumno
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Curso *</label>
                <Select
                  onValueChange={(value) => setSelectedCursoId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.map((curso) => (
                      <SelectItem key={curso.id} value={curso.id.toString()}>
                        {curso.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Estado del Certificado
                </label>
                <Input value="Pendiente" disabled />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={!alumnoIdForm || !selectedCursoId}
              >
                Agregar Inscripción
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Buscar por DNI</label>
            <div className="flex space-x-2">
              <div className="relative w-full">
                <Input
                  value={filterDni}
                  onChange={(e) => setFilterDni(e.target.value)}
                  placeholder="12345678"
                  maxLength={8}
                  className="pr-8" // deja espacio para la X dentro del input
                />
                {filterDni && (
                  <X
                    onClick={() => {
                      setFilterDni("");
                      setAlumnoIdFilter(null);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  />
                )}
              </div>

              <Button onClick={() => searchInscripcionAlumnoByDni(filterDni)}>
                Buscar
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Curso</label>
            <div className="flex space-x-2">
              <Select
                value={
                  filterCursoId === null ? "todos" : filterCursoId.toString()
                }
                onValueChange={(value) =>
                  setFilterCursoId(value === "todos" ? null : Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="TODOS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">TODOS</SelectItem>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id.toString()}>
                      {curso.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/*
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFilterCursoId(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              */}
            </div>
          </div>
        </div>
        {
          <Button
            onClick={cleanFilter}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          >
            Limpiar Filtros
          </Button>
        }
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-600 hover:bg-emerald-600">
              <TableHead className="text-white">DNI</TableHead>
              <TableHead className="text-white">Nombre</TableHead>
              <TableHead className="text-white">Apellido</TableHead>
              <TableHead className="text-white">Curso</TableHead>
              <TableHead className="text-white">Estado</TableHead>
              <TableHead className="text-white">Fecha Inscripción</TableHead>
              <TableHead className="text-white text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inscripciones.map((inscripcion, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{inscripcion.dni}</TableCell>
                <TableCell>{inscripcion.nombre}</TableCell>
                <TableCell>{inscripcion.apellido}</TableCell>
                <TableCell>{inscripcion.curso}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      inscripcion.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {inscripcion.estado}
                  </span>
                </TableCell>
                <TableCell>{inscripcion.fecha_creacion}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (user.role !== "admin") {
                          toast({
                            title: "Permisos insuficientes",
                            description: "Solo administradores pueden editar",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDelete(inscripcion.dni, inscripcion.curso)
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {inscripciones.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No se encontraron inscripciones
          </div>
        )}
      </div>
    </div>
  );
};

export default Inscripciones;
