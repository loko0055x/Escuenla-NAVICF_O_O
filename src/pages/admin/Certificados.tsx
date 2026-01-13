import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CertificateV2 from "@/components/admin/CertificateV2";
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
import { FileText, X, ExternalLink, Loader2 } from "lucide-react";

// ============= CONSTANTS =============
const DNI_LENGTH = 8;
const DNI_REGEX = /^\d{8}$/;
const MIN_NOTA = 1;
const MAX_NOTA = 20;
const STORAGE_BUCKET = "Navicf-Storage-O_O";
const STORAGE_FOLDER = "Certificados";
const PDF_GENERATION_TIMEOUT = 30000;
const RENDER_DELAY = 300;

// ============= INTERFACES =============
interface Certificado {
  dni: string;
  alumno: string;
  curso: string;
  estado_certificado: string;
  nota: number;
  url_pdf: string;
}

interface Curso {
  id: number;
  name: string;
}

interface AlumnoPendiente {
  alumno_id: number;
  dni: string;
  nombre: string;
  apellido: string;
  curso_id: number;
  curso: string;
  estado_certificado: string;
}

interface CertificateGenerationResult {
  success: boolean;
  url?: string;
  error?: string;
}

// ============= UTILITY FUNCTIONS =============
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
};

const validateDNI = (dni: string): boolean => DNI_REGEX.test(dni);
const validateNota = (nota: number): boolean =>
  nota >= MIN_NOTA && nota <= MAX_NOTA;
const validateDates = (fechaInicio: string, fechaFin: string): boolean =>
  new Date(fechaFin) > new Date(fechaInicio);

// ============= MAIN COMPONENT =============
const Certificados = () => {
  const { user } = useOutletContext<any>();
  const { toast } = useToast();

  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterDni, setFilterDni] = useState("");
  const [filterCursoId, setFilterCursoId] = useState<number | null>(null);
  const [alumnoIdFilter, setAlumnoIdFilter] = useState<number | null>(null);

  const [formDni, setFormDni] = useState("");
  const [alumnoData, setAlumnoData] = useState<AlumnoPendiente | null>(null);
  const [cursosAlumno, setCursosAlumno] = useState<AlumnoPendiente[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<AlumnoPendiente | null>(
    null
  );
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [notaFinal, setNotaFinal] = useState("");

  const loadCursos = useCallback(async () => {
    try {
      // @ts-ignore
      const { data, error } = await supabase
        .from("cursos")
        .select("id, name")
        .eq("status", true)
        .order("name");
      if (error) throw error;
      if (data) setCursos(data);
    } catch (error: any) {
      console.error("Error loading cursos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadCertificados = useCallback(async () => {
    setIsLoading(true);
    try {
      // @ts-ignore
      const { data, error } = await supabase.rpc("filtrar_certificados", {
        alumno_id_param: filterDni ? alumnoIdFilter : null,
        curso_id_param: filterCursoId,
      });
      if (error) throw error;
      setCertificados(data || []);
    } catch (error: any) {
      console.error("Error loading certificados:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los certificados",
        variant: "destructive",
      });
      setCertificados([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterDni, alumnoIdFilter, filterCursoId, toast]);

  const searchAlumnoCertificados = useCallback(
    async (dni: string) => {
      if (!validateDNI(dni)) {
        toast({
          title: "Error",
          description: `DNI debe tener ${DNI_LENGTH} dígitos`,
          variant: "destructive",
        });
        return;
      }
      try {
        // @ts-ignore
        const { data, error } = await supabase.rpc(
          "obtener_alumnos_certificados",
          { dni_param: dni }
        );
        if (error) throw error;
        if (data && data.length > 0) {
          setAlumnoIdFilter(data[0].idalumno);
          toast({
            title: "Alumno encontrado",
            description: `DNI: ${data[0].dni}`,
          });
        } else {
          setAlumnoIdFilter(null);
          toast({
            title: "No encontrado",
            description: "No se encontró alumno con ese DNI",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error searching alumno:", error);
        toast({
          title: "Error",
          description: error.message || "Error al buscar alumno",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const searchAlumnoPendientes = useCallback(async () => {
    if (!validateDNI(formDni)) {
      toast({
        title: "Error",
        description: `DNI debe tener ${DNI_LENGTH} dígitos`,
        variant: "destructive",
      });
      return;
    }
    try {
      // @ts-ignore
      const { data, error } = await supabase.rpc(
        "obtener_alumnos_con_pendientes",
        { dni_param: formDni }
      );
      if (error) throw error;
      if (data && data.length > 0) {
        setCursosAlumno(data);
        setAlumnoData(data[0]);
        toast({
          title: "Alumno encontrado",
          description: `${data[0].nombre} ${data[0].apellido}`,
        });
      } else {
        setCursosAlumno([]);
        setAlumnoData(null);
        toast({
          title: "No encontrado",
          description: "No se encontró alumno con cursos pendientes",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error searching pendientes:", error);
      toast({
        title: "Error",
        description: error.message || "Error al buscar alumno",
        variant: "destructive",
      });
    }
  }, [formDni, toast]);

  const generatePDF = async (
    certificateElement: HTMLElement
  ): Promise<CertificateGenerationResult> => {
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: certificateElement.scrollWidth,
        windowHeight: certificateElement.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      return { success: true, url: pdf.output("blob") as any };
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      return { success: false, error: error.message || "Error al generar PDF" };
    }
  };

  const uploadPDFToStorage = async (
    pdfBlob: Blob,
    fileName: string
  ): Promise<CertificateGenerationResult> => {
    try {
      const filePath = `${STORAGE_FOLDER}/${fileName}`;
      // @ts-ignore
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, pdfBlob, {
          contentType: "application/pdf",
          upsert: false,
        });
      if (error) throw error;
      // @ts-ignore
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      return { success: true, url: publicUrlData.publicUrl };
    } catch (error: any) {
      console.error("Error uploading PDF:", error);
      return { success: false, error: error.message || "Error al subir PDF" };
    }
  };

  const updateCertificateRecord = async (
    alumnoId: number,
    cursoId: number,
    pdfUrl: string,
    fechaInicio: string,
    fechaFin: string,
    nota: number
  ): Promise<CertificateGenerationResult> => {
    try {
      // @ts-ignore
      const { error } = await supabase
        .from("curso_alumno")
        .update({
          estado_certificado: "completado",
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          nota_final: nota,
          updated_at: new Date().toISOString(),
          url_pdf: pdfUrl,
        })
        .eq("alumno_id", alumnoId)
        .eq("curso_id", cursoId);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error updating certificate:", error);
      return {
        success: false,
        error: error.message || "Error al actualizar certificado",
      };
    }
  };

  const handleGenerarCertificado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCurso || !fechaInicio || !fechaFin || !notaFinal) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }
    if (!validateDates(fechaInicio, fechaFin)) {
      toast({
        title: "Error",
        description: "La fecha de fin debe ser mayor a la fecha de inicio",
        variant: "destructive",
      });
      return;
    }
    const nota = parseFloat(notaFinal);
    if (!validateNota(nota)) {
      toast({
        title: "Error",
        description: `La nota debe estar entre ${MIN_NOTA} y ${MAX_NOTA}`,
        variant: "destructive",
      });
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, RENDER_DELAY));
      const certificateElement = document.getElementById(
        "certificate-content-v2"
      );
      if (!certificateElement)
        throw new Error("No se encontró el elemento del certificado");
      const pdfResult = await Promise.race([
        generatePDF(certificateElement),
        new Promise<CertificateGenerationResult>((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout generando PDF")),
            PDF_GENERATION_TIMEOUT
          )
        ),
      ]);
      console.log(pdfResult.url);
      if (!pdfResult.success || !pdfResult.url)
        throw new Error(pdfResult.error || "Error al generar PDF");
      const timestamp = Date.now();
      const dniSanitized = sanitizeFileName(selectedCurso.dni);
      const cursoSanitized = sanitizeFileName(selectedCurso.curso);
      const fileName = `${dniSanitized}-${cursoSanitized}-${timestamp}.pdf`;
      const uploadResult = await uploadPDFToStorage(pdfResult.url, fileName);
      console.log(uploadResult.url);
      if (!uploadResult.success || !uploadResult.url)
        throw new Error(uploadResult.error || "Error al subir PDF");
      const updateResult = await updateCertificateRecord(
        selectedCurso.alumno_id,
        selectedCurso.curso_id,
        uploadResult.url,
        fechaInicio,
        fechaFin,
        nota
      );
      if (!updateResult.success)
        throw new Error(updateResult.error || "Error al actualizar registro");
      toast({
        title: "Éxito",
        description: "Certificado generado correctamente",
      });
      setDialogOpen(false);
      setFormDni("");
      setAlumnoData(null);
      setCursosAlumno([]);
      setSelectedCurso(null);
      setFechaInicio("");
      setFechaFin("");
      setNotaFinal("");
      await loadCertificados();
    } catch (error: any) {
      console.error("Error en generación de certificado:", error);
      toast({
        title: "Error",
        description: error.message || "Error al generar certificado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchDni = () => {
    if (filterDni) searchAlumnoCertificados(filterDni);
  };
  const handleClearDni = () => {
    setFilterDni("");
    setAlumnoIdFilter(null);
  };
  const handleClearCurso = () => setFilterCursoId(null);
  const handleFormDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, DNI_LENGTH);
    setFormDni(value);
    if (!value) {
      setAlumnoData(null);
      setCursosAlumno([]);
    }
  };
  const handleFilterDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, DNI_LENGTH);
    setFilterDni(value);
  };

  useEffect(() => {
    loadCursos();
    loadCertificados();
  }, []);
  useEffect(() => {
    loadCertificados();
  }, [alumnoIdFilter, filterCursoId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Certificados</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <FileText className="w-4 h-4" />
              Generar Certificado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generar Nuevo Certificado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGenerarCertificado} className="space-y-4">
              <div>
                <label className="text-sm font-medium">DNI del Alumno *</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="12345678"
                    value={formDni}
                    onChange={handleFormDniChange}
                    maxLength={DNI_LENGTH}
                  />
                  <Button type="button" onClick={searchAlumnoPendientes}>
                    Buscar
                  </Button>
                </div>
              </div>
              {alumnoData && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nombre</label>
                      <Input value={alumnoData.nombre} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Apellido</label>
                      <Input value={alumnoData.apellido} disabled />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Curso Pendiente *
                    </label>
                    <Select
                      onValueChange={(value) => {
                        const curso = cursosAlumno.find(
                          (c) => c.curso_id.toString() === value
                        );
                        setSelectedCurso(curso || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {cursosAlumno.map((curso) => (
                          <SelectItem
                            key={curso.curso_id}
                            value={curso.curso_id.toString()}
                          >
                            {curso.curso}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Fecha Inicio *
                      </label>
                      <Input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fecha Fin *</label>
                      <Input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Nota Final ({MIN_NOTA}-{MAX_NOTA}) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min={MIN_NOTA}
                      max={MAX_NOTA}
                      value={notaFinal}
                      onChange={(e) => setNotaFinal(e.target.value)}
                      placeholder="18.5"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      "Agregar Certificado"
                    )}
                  </Button>
                </>
              )}
              {!alumnoData && formDni && (
                <p className="text-center text-muted-foreground py-4">
                  No se encontró el alumno o no tiene cursos pendientes
                </p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Buscar por DNI</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="12345678"
                value={filterDni}
                onChange={handleFilterDniChange}
                maxLength={DNI_LENGTH}
              />
              <Button onClick={handleSearchDni}>Buscar</Button>
              {filterDni && (
                <Button variant="outline" size="icon" onClick={handleClearDni}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Filtrar por Curso</label>
            <div className="flex gap-2">
              <Select
                value={filterCursoId?.toString() || "todos"}
                onValueChange={(value) =>
                  setFilterCursoId(value === "todos" ? null : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
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
              {filterCursoId && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearCurso}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : certificados.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No se encontraron certificados
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DNI</TableHead>
                <TableHead>Alumno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificados.map((cert, idx) => (
                <TableRow key={`${cert.dni}-${cert.curso}-${idx}`}>
                  <TableCell>{cert.dni}</TableCell>
                  <TableCell>{cert.alumno}</TableCell>
                  <TableCell>{cert.curso}</TableCell>
                  <TableCell>
                    <span
                      className={
                        cert.estado_certificado === "completado"
                          ? "text-green-600 font-medium"
                          : "text-yellow-600 font-medium"
                      }
                    >
                      {cert.estado_certificado}
                    </span>
                  </TableCell>
                  <TableCell>{cert.nota}</TableCell>
                  <TableCell>
                    {cert.url_pdf ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.url_pdf, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver PDF
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Sin PDF
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {selectedCurso && (
        <div style={{ position: "absolute", left: "-9999px" }}>
          <CertificateV2
            nombre={`${selectedCurso.nombre} ${selectedCurso.apellido}`}
            dni={selectedCurso.dni}
            curso={selectedCurso.curso}
            fechainicio={fechaInicio}
            fechafin={fechaFin}
          />
        </div>
      )}
    </div>
  );
};

export default Certificados;
