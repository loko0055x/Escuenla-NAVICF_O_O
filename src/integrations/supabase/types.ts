// Definición de tipos para los resultados de las funciones RPC

// Tipo para el resultado de la función `obtener_alumnos_pendientes`
export type AlumnoPendiente = {
  idAlumno: number;
  dni: string;
};

// Tipo para el resultado de la función `obtener_alumnos_certificados`
export type AlumnoCertificado = {
  idAlumno: number;
  dni: string;
};

// Tipo para el resultado de la función `filtrar_inscripciones`
export type Inscripcion = {
  dni: string;
  nombre: string;
  apellido: string;
  curso: string;
  estado: string;
  fecha_creacion: string | null;
};

// Tipo para el resultado de la función `filtrar_certificados`
export type Certificado = {
  dni: string;
  alumno: string;
  curso: string;
  estado_certificado: string;
  nota: number | null;
  url_pdf: string | null; // Puede ser `null` si no existe una fecha
};

// Tipo para el resultado de la función `obtener_alumnos_con_pendientes`
export type AlumnoConPendientes = {
  alumno_id: number;
  dni: string;
  nombre: string;
  apellido: string;
  curso_id: number;
  curso: string;
  estado_certificado: string;
};

// Tipo para un Alumno
export type Alumno = {
  id: number;
  dni: string | null;
  name: string;
  lastname: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  direccion: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
  status: boolean;
};

// Tipo para un Curso
export type Curso = {
  id: number;
  name: string;
  discount: number;
  duration_value: number;
  duration_unit: "dias" | "semanas" | "meses";
  puntuacion: number;
  created_at: string;
  updated_at: string;
  status: boolean;
};

// Tipo para la tabla de `curso_alumno`
export type CursoAlumno = {
  id: number;
  alumno_id: number;
  curso_id: number;
  url_pdf: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  nota_final: number | null;
  estado_certificado: "pendiente" | "aprobado" | "no_aprobado";
  created_at: string;
  updated_at: string;
  status: boolean;
};

// Tipo para un Módulo
export type Modulo = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  status: boolean;
};

// Tipo para la relación entre curso y módulo
export type CursoModulo = {
  id: number;
  curso_id: number;
  modulo_id: number;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  status: boolean;
};

// Tipo para la tabla de `users`
export type User = {
  id: number;
  auth_id: string; // UUID
  name: string;
  lastname: string;
  phone: string | null;
  email: string;
  photo: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  status: boolean;
};
