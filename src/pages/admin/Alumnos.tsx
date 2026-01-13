import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface Alumno {
  id: number;
  dni: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  direccion?: string;
  birth_date?: string;
  status: boolean;
}

const Alumnos = () => {
  const { user } = useOutletContext<any>();
  const { toast } = useToast();

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    lastname: "",
    email: "",
    phone: "",
    direccion: "",
    birth_date: "",
  });

  // 🧭 Paginación
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (searchTerm.trim().length >= 4 || searchTerm.trim() === "") {
      loadAlumnos(searchTerm);
    } else {
      setAlumnos([]); // opcional: limpiar resultados si hay menos de 4 caracteres
      setTotalCount(0);
    }
  }, [page, searchTerm]);

  const loadAlumnos = async (search = "") => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("alumnos")
      .select("*", { count: "exact" })
      .eq("status", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search.trim()) {
      // 🔍 Buscar por DNI, nombre o apellido
      query = query.or(
        `dni.ilike.%${search}%,name.ilike.%${search}%,lastname.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los alumnos",
        variant: "destructive",
      });
      return;
    }

    setAlumnos(data || []);
    setTotalCount(count || 0);
  };

  const validateForm = () => {
    if (!/^\d{8}$/.test(formData.dni) || formData.dni.startsWith("0")) {
      toast({
        title: "Error",
        description: "DNI debe tener 8 dígitos y no comenzar con 0",
        variant: "destructive",
      });
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      toast({
        title: "Error",
        description: "Nombre no debe contener caracteres especiales",
        variant: "destructive",
      });
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.lastname)) {
      toast({
        title: "Error",
        description: "Apellido no debe contener caracteres especiales",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "Email debe ser válido",
        variant: "destructive",
      });
      return false;
    }
    if (!/^\d{9}$/.test(formData.phone) || formData.phone.startsWith("0")) {
      toast({
        title: "Error",
        description: "Teléfono debe tener 9 dígitos y no comenzar con 0",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingAlumno) {
        const { error } = await supabase
          .from("alumnos")
          .update({
            ...formData,
            birth_date: formData.birth_date || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAlumno.id);

        if (error) throw error;
        toast({
          title: "Alumno actualizado",
          description: "Datos actualizados",
        });
      } else {
        const { error } = await supabase.from("alumnos").insert([
          {
            ...formData,
            birth_date: formData.birth_date || null,
          },
        ]);
        if (error) throw error;
        toast({ title: "Alumno agregado", description: "Registro exitoso" });
      }

      setDialogOpen(false);
      setEditingAlumno(null);
      resetForm();
      loadAlumnos(searchTerm);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este alumno?")) return;
    const { error } = await supabase
      .from("alumnos")
      .update({ status: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el alumno",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Alumno eliminado", description: "Registro desactivado" });
    loadAlumnos(searchTerm);
  };

  const handleEdit = (alumno: Alumno) => {
    setEditingAlumno(alumno);
    setFormData({
      dni: alumno.dni,
      name: alumno.name,
      lastname: alumno.lastname,
      email: alumno.email,
      phone: alumno.phone,
      direccion: alumno.direccion || "",
      birth_date: alumno.birth_date || "",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      dni: "",
      name: "",
      lastname: "",
      email: "",
      phone: "",
      direccion: "",
      birth_date: "",
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Alumnos</h1>
          <p className="text-slate-500 mt-1">Gestión de alumnos registrados</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setEditingAlumno(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Alumno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAlumno ? "Editar Alumno" : "Nuevo Alumno"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">DNI *</label>
                  <Input
                    value={formData.dni}
                    onChange={(e) =>
                      setFormData({ ...formData, dni: e.target.value })
                    }
                    placeholder="12345678"
                    maxLength={8}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellido *</label>
                  <Input
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    placeholder="Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="juan@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Teléfono *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="987654321"
                    maxLength={9}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Fecha de Nacimiento (opcional)
                  </label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) =>
                      setFormData({ ...formData, birth_date: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">
                    Dirección (opcional)
                  </label>
                  <Input
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    placeholder="Av. Principal 123"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {editingAlumno ? "Actualizar" : "Agregar"} Alumno
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por DNI, nombre o apellido..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-emerald-600 hover:bg-emerald-600">
                <TableHead className="text-white">DNI</TableHead>
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Apellido</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Teléfono</TableHead>
                <TableHead className="text-white text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnos.map((alumno) => (
                <TableRow key={alumno.id}>
                  <TableCell className="font-medium">{alumno.dni}</TableCell>
                  <TableCell>{alumno.name}</TableCell>
                  <TableCell>{alumno.lastname}</TableCell>
                  <TableCell>{alumno.email}</TableCell>
                  <TableCell>{alumno.phone}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(alumno)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(alumno.id)}
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
        </div>

        {alumnos.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No se encontraron alumnos
          </div>
        )}

        {/* 🔹 Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-slate-500">
              Página {page} de {totalPages}
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumnos;
