import { QRCodeSVG } from "qrcode.react";

interface CertificateProps {
  nombre: string;
  dni: string;
  curso: string;
  fecha?: string;
  ciudad?: string;
}

const CertificateV2 = ({
  nombre,
  dni,
  curso,
  fecha = "10 DE JUNIO DEL 2021",
  ciudad = "LIMA/PERU",
}: CertificateProps) => {
  const qrUrl = `http://localhost:8080/certificate?dniAlumno=${dni}&cursoID=1`;
  const logoUrl =
    "https://cttbwkpcmbdggqpfnsht.supabase.co/storage/v1/object/public/fotosWalter-DigitalCards/Categoria/logo_navicf.png";
  const sellosUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQidrZMPHTkJNjzt0MtC6vhd_vX7p45m4ps4A&s";
  const fondoUrl =
    "https://grbuljexuwksucojmxfy.supabase.co/storage/v1/object/public/Navicf-Storage-O_O/fondopantalla.jpg";

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-8"
      id="certificate-content-v2"
    >
      {" "}
      <div
        className="relative w-[1122px] h-[794px] bg-white overflow-hidden"
        style={{
          backgroundImage: `url(${fondoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {" "}
        <div className="absolute inset-4 border-2 border-gray-600"></div>
        <div className="absolute inset-6 border border-gray-500"></div>{" "}
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3 ml-16">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight -mt-12">
                CEP
              </h2>
              <div className="border-l-2 border-gray-600 h-14 md:h-16 mx-2"></div>
              <div className="flex flex-col justify-center">
                <span className="text-xs md:text-sm font-bold text-gray-800 uppercase leading-tight">
                  Cursos de
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-800 uppercase leading-tight">
                  Equipos
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-800 uppercase leading-tight">
                  Pesados
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <img
                src={logoUrl}
                alt="NAVICF"
                className="h-16 md:h-20 object-contain"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1
              className="text-6xl font-bold mb-2"
              style={{ color: "hsl(var(--certificate-blue))" }}
            >
              CERTIFICADO
            </h1>
            <p className="text-xl text-gray-600 mb-8">OTORGADO A</p>

            <h2 className="text-4xl font-bold text-gray-800 mb-4 tracking-wide">
              {nombre.toUpperCase()}
            </h2>

            <p className="text-lg text-gray-700 mb-6">DNI {dni}</p>

            <p className="text-sm text-gray-600 mb-6 max-w-2xl leading-relaxed">
              En merito de haber aprobado satisfactoriamente el curso técnico
              operativo de capacitación
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">
              {curso.toUpperCase()}
            </h3>

            <p className="text-sm text-gray-600 mb-8">
              En periodo programado de 2021-01 - 2021-09 con una duración de 120
              horas teóricas y prácticas
            </p>

            <p className="text-lg font-semibold text-gray-800">
              {ciudad}, {fecha}
            </p>
          </div>

          <div className="flex justify-between items-end mt-8">
            <div className="flex flex-col items-center">
              <QRCodeSVG value={qrUrl} size={100} />
            </div>

            <div className="flex-1 flex justify-center gap-8 md:gap-12 px-4 md:px-8">
              <div className="text-center">
                <div className="h-16 flex items-center justify-center mb-2">
                  <img
                    src={sellosUrl}
                    alt="Firma"
                    className="h-12 object-contain opacity-60"
                  />
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    NANCY FACUNDO PEÑA
                  </p>
                  <p className="text-xs text-gray-600">GERENTE GENERAL</p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-16 flex items-center justify-center mb-2">
                  <img
                    src={sellosUrl}
                    alt="Firma"
                    className="h-12 object-contain opacity-60"
                  />
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    YEISON PUCHOC MILLAN
                  </p>
                  <p className="text-xs text-gray-600">ING. MECANICO</p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-16 flex items-center justify-center mb-2">
                  <img
                    src={sellosUrl}
                    alt="Firma"
                    className="h-12 object-contain opacity-60"
                  />
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    VICTOR HUAMAN PAIMA
                  </p>
                  <p className="text-xs text-gray-600">INSTRUCTOR DE EQUIPOS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateV2;

{
  /*
  import { QRCodeSVG } from "qrcode.react";

interface CertificateProps {
  nombre: string;
  dni: string;
  curso: string;
  fecha?: string;
  ciudad?: string;
}

const CertificateV2 = ({
  nombre,
  dni,
  curso,
  fecha = "10 DE JUNIO DEL 2021",
  ciudad = "LIMA/PERU",
}: CertificateProps) => {
  const qrUrl = `http://localhost:8080/certificate?dniAlumno=${dni}&cursoID=1`;
  const logoUrl =
    "https://cttbwkpcmbdggqpfnsht.supabase.co/storage/v1/object/public/fotosWalter-DigitalCards/Categoria/logo_navicf.png";
  const sellosUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQidrZMPHTkJNjzt0MtC6vhd_vX7p45m4ps4A&s";
  const fondoUrl =
    "https://grbuljexuwksucojmxfy.supabase.co/storage/v1/object/public/Navicf-Storage-O_O/fondopantalla.jpg";

  return (
    <div
      className="min-h-screen bg-white p-4 md:p-8"
      id="certificate-content-v2"
    >
      {" "}
      <div
        className="relative w-[1122px] h-[794px] bg-white overflow-hidden"
        style={{
          backgroundImage: `url(${fondoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {" "}
        <div className="absolute inset-4 border-2 border-gray-600"></div>
        <div className="absolute inset-6 border border-gray-500"></div>{" "}
         <div className="relative z-10 p-8 md:p-12">
           <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3 ml-16">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight -mt-12">
                CEP
              </h2>
              <div className="border-l-2 border-gray-600 h-14 md:h-16 mx-2"></div>
              <div className="flex flex-col justify-center">
                <span className="text-xs md:text-sm font-bold text-gray-800 uppercase leading-tight">
                  Cursos de
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-800 uppercase leading-tight">
                  Equipos
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-800 uppercase leading-tight">
                  Pesados
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <img
                src={logoUrl}
                alt="NAVICF"
                className="h-16 md:h-20 object-contain"
              />
            </div>
          </div>

           <div className="flex-1 flex flex-col items-center justify-center text-center">
             <h1
              className="text-6xl font-bold mb-2"
              style={{ color: "hsl(var(--certificate-blue))" }}
            >
              CERTIFICADO
            </h1>
            <p className="text-xl text-gray-600 mb-8">OTORGADO A</p>

             <h2 className="text-4xl font-bold text-gray-800 mb-4 tracking-wide">
              {nombre.toUpperCase()}
            </h2>

             <p className="text-lg text-gray-700 mb-6">DNI {dni}</p>

             <p className="text-sm text-gray-600 mb-6 max-w-2xl leading-relaxed">
              En merito de haber aprobado satisfactoriamente el curso técnico
              operativo de capacitación
            </p>

             <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">
              {curso.toUpperCase()}
            </h3>

             <p className="text-sm text-gray-600 mb-8">
              En periodo programado de 2021-01 - 2021-09 con una duración de 120
              horas teóricas y prácticas
            </p>

             <p className="text-lg font-semibold text-gray-800">
              {ciudad}, {fecha}
            </p>
          </div>

           <div className="flex justify-between items-end mt-8">
             <div className="flex flex-col items-center">
              <QRCodeSVG value={qrUrl} size={100} />
            </div>

             <div className="flex-1 flex justify-center gap-8 md:gap-12 px-4 md:px-8">
              <div className="text-center">
                <div className="h-16 flex items-center justify-center mb-2">
                  <img
                    src={sellosUrl}
                    alt="Firma"
                    className="h-12 object-contain opacity-60"
                  />
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    NANCY FACUNDO PEÑA
                  </p>
                  <p className="text-xs text-gray-600">GERENTE GENERAL</p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-16 flex items-center justify-center mb-2">
                  <img
                    src={sellosUrl}
                    alt="Firma"
                    className="h-12 object-contain opacity-60"
                  />
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    YEISON PUCHOC MILLAN
                  </p>
                  <p className="text-xs text-gray-600">ING. MECANICO</p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-16 flex items-center justify-center mb-2">
                  <img
                    src={sellosUrl}
                    alt="Firma"
                    className="h-12 object-contain opacity-60"
                  />
                </div>
                <div className="border-t border-gray-400 pt-1">
                  <p className="text-xs font-semibold text-gray-700">
                    VICTOR HUAMAN PAIMA
                  </p>
                  <p className="text-xs text-gray-600">INSTRUCTOR DE EQUIPOS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateV2;

  */
}
