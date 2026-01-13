// src/utils/generateCertificatePDF.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateCertificatePDF(data) {
  // Crear un contenedor temporal oculto en el DOM
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "0";
  document.body.appendChild(tempDiv);

  // Inyectar el HTML del certificado dentro del div
  tempDiv.innerHTML = `
    <div style="width: 794px; height: 1123px; background: white; padding: 40px; font-family: Arial;">
      <h1 style="text-align:center; color:#00A7E1;">CERTIFICADO</h1>
      <h2 style="text-align:center;">${data.name}</h2>
      <p style="text-align:center;">DNI: ${data.dni}</p>
      <p style="text-align:center;">Curso: ${data.course}</p>
    </div>
  `;

  // Usar html2canvas para capturar la imagen del div
  const canvas = await html2canvas(tempDiv, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Crear el PDF
  const pdf = new jsPDF("p", "pt", "a4");
  pdf.addImage(imgData, "PNG", 0, 0, 595, 842); // Ajustar la escala a A4
  pdf.save(`Certificado-${data.name}.pdf`);

  // Limpiar el DOM
  document.body.removeChild(tempDiv);
}
