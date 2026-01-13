import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";

interface Certificado {
  alumno_id: number;
  dni: string;
  nombre: string;
  apellido: string;
  curso_id: number;
  curso: string;
  pdflink: string;
  estado_certificado: string;
}

const Certificados = () => {
  const [dni, setDni] = useState("");
  const { toast } = useToast();
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un DNI",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{8}$/.test(dni)) {
      toast({
        title: "Error",
        description: "El DNI debe contener exactamente 8 dígitos numéricos",
        variant: "destructive",
      });
      return;
    }

    try {
      // @ts-ignore - External Supabase schema
      const { data, error } = await supabase.rpc("obtener_certificadospordni", {
        dni_param: dni,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setCertificados(data);
        setDialogOpen(true);
      } else {
        toast({
          title: "No encontrado",
          description: "No se encontraron certificados para este DNI",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 8) {
      setDni(value);
    }
  };

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        {/* Back to home link */}
        <Link
          to="/"
          className="absolute top-8 left-8 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
        >
          ← Volver al inicio
        </Link>

        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
              Consulta
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium">
              Ingrese DNI para Validar Certificados
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3 max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="DNI..."
                value={dni}
                onChange={handleInputChange}
                maxLength={8}
                className="h-14 text-lg border-2 focus:border-primary transition-all"
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg"
              >
                <Search className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Certificados de {certificados[0]?.nombre}{" "}
              {certificados[0]?.apellido}
            </DialogTitle>
            <p className="text-muted-foreground">DNI: {certificados[0]?.dni}</p>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {certificados.map((cert) => (
              <div
                key={cert.curso_id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-lg">{cert.curso}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Estado:{" "}
                      <span className="text-green-600 font-semibold capitalize">
                        {cert.estado_certificado}
                      </span>
                    </p>
                  </div>
                  {cert.pdflink && (
                    <Button
                      onClick={() => handleDownload(cert.pdflink)}
                      variant="default"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Certificados;
