import { useState } from "react";
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo_navicf.png";
//const [loading, setLoading] = useState(false);

const Footer = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  //const [lastSubmit, setLastSubmit] = useState<number>(0);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Se requiere el nombre completo";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Se requiere correo electrónico válido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Se requiere correo electrónico válido";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Se requiere número de celular";
      isValid = false;
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Solo se permiten números";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({ name: "", email: "", phone: "", message: "" });
    }

    const now = Date.now();
    /*  const timeSinceLastSubmit = now - lastSubmit;
    const minInterval = 30000; // 30 seconds in milliseconds

      if (timeSinceLastSubmit < minInterval && lastSubmit > 0) {
      const remainingSeconds = Math.ceil(
        (minInterval - timeSinceLastSubmit) / 1000
      );
      toast({
        title: "Espera un momento",
        description: `Por favor espera ${remainingSeconds} segundos antes de enviar otro mensaje.`,
        variant: "destructive",
      });
      return;
    }*/

    // setLoading(true);

    /*try {
      // @ts-ignore - External Supabase schema
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          to: "loko2003elcrack@gmail.com",
          from: formData.email,
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
        },
      });

      if (error) throw error;

      setLastSubmit(now);

      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "Quiero solicitar una clase gratis",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }*/
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  return (
    <footer
      id="contacto"
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-8 overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column - Contact Info */}
          <div className="space-y-8 animate-fade-in-right">
            <h3 className="text-4xl font-bold text-white mb-8 relative inline-block">
              Contáctanos
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-primary to-accent"></div>
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Celular:</p>
                  <p className="text-slate-300 text-lg">(+51)937 414 195</p>
                  <a
                    href="tel:+51937414195"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    24 / 7 Soporte
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                <div className="bg-accent/10 p-3 rounded-full group-hover:bg-accent/20 transition-colors">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Nuestra Oficina:
                  </p>
                  <p className="text-slate-300 text-lg">
                    Mz 61 Lt 23 av. El Mayo s/n.
                    <br />
                    AAHH 10 de octubre - SJL
                    <br />
                    Lima - Perú.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Envíanos un correo a:
                  </p>
                  <a
                    href="mailto:info@escuelanavicf.com"
                    className="text-accent hover:text-accent/80 transition-colors text-lg block"
                  >
                    info@escuelanavicf.com
                  </a>
                  <a
                    href="mailto:ventas@escuelanavicf.com"
                    className="text-accent hover:text-accent/80 transition-colors text-lg block"
                  >
                    ventas@escuelanavicf.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                <div className="bg-accent/10 p-3 rounded-full group-hover:bg-accent/20 transition-colors">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">
                    Horas Laborales:
                  </p>
                  <p className="text-slate-300 text-lg">
                    Lunes - Sábado : 08:00 am - 18:00 pm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl hover:shadow-3xl transition-all">
              <h3 className="text-3xl font-bold text-white mb-3">
                Reciba una clase gratis
              </h3>
              <p className="text-primary font-semibold mb-8 text-lg">
                En el Simulador
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Nombre Completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-primary focus:bg-white/15 transition-all ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-accent focus:bg-white/15 transition-all ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Número de celular"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={9}
                    className={`h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-primary focus:bg-white/15 transition-all ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    name="message"
                    placeholder="Mensaje (opcional)"
                    value={formData.message}
                    onChange={handleChange}
                    className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/15 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] hover:-translate-y-1"
                  disabled={false}
                >
                  Solicitar Clase Gratis
                  {
                    // loading ? "Enviando..." : "Solicitar Clase Gratis"
                  }
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section - Logo and Social */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Navicf Logo"
                className="h-16 hover:scale-105 transition-transform"
              />
            </div>

            <p className="text-slate-400 text-sm text-center">
              © Copyright 2025 EscuelaNavicf.com, Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="bg-white/10 rounded-full p-2 hover:bg-primary hover:text-white transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 rounded-full p-2 hover:bg-primary hover:text-white transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 rounded-full p-2 hover:bg-primary hover:text-white transition-all hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 rounded-full p-2 hover:bg-primary hover:text-white transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-500">
              Desarrollado por{" "}
              <a
                href="https://web.whatsapp.com/send?phone=51924751425&text=Hola David"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-green-400 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                loko0055x David
              </a>{" "}
              | Tel: 924751425
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
